import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { auth, AuthRequest } from '../middleware/auth.js'

const router = Router()
const prisma = new PrismaClient()

// GET /api/messages - Get inbox (conversations) for current user
router.get('/', auth, async (req: AuthRequest, res: any) => {
  try {
    const userId = req.user?.uid
    
    // Find user by Firebase uid to get database id
    const user = await prisma.user.findUnique({
      where: { uid: userId }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Get conversations where user is buyer or seller
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: user.id },
          { sellerId: user.id }
        ]
      },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            images: true,
            price: true
          }
        },
        buyer: {
          select: {
            id: true,
            fullName: true
          }
        },
        seller: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform to inbox format
    const inbox = conversations.map((conv: any) => ({
      conversationId: conv.id,
      item: {
        id: conv.item.id,
        title: conv.item.title,
        image: conv.item.images[0] || '/placeholder.jpg',
        price: conv.item.price
      },
      lastMessage: conv.lastMessage,
      updatedAt: conv.updatedAt,
      otherUser: user.id === conv.buyerId ? conv.seller : conv.buyer
    }));

    res.status(200).json({ 
      success: true, 
      conversations: inbox 
    });
  } catch (error) {
    console.error('Error getting inbox:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting inbox' 
    });
  }
});

// GET /api/messages/conversation/:conversationId/messages - Get messages for conversation
router.get('/conversation/:conversationId/messages', auth, async (req: AuthRequest, res: any) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.uid;

    // Find user by Firebase uid to get database id
    const user = await prisma.user.findUnique({
      where: { uid: userId }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify user is part of this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { buyerId: user.id },
          { sellerId: user.id }
        ]
      },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ 
        success: false, 
        message: "Conversation not found" 
      });
    }

    // Get last 20 messages
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20,
      select: {
        id: true,
        senderId: true,
        text: true,
        createdAt: true
      }
    });

    // Reverse to show oldest first
    const orderedMessages = messages.reverse();

    res.status(200).json({ 
      success: true, 
      conversation: {
        id: conversation.id,
        item: conversation.item
      },
      messages: orderedMessages 
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting messages' 
    });
  }
});

// POST /api/messages - Send message
router.post('/', auth, async (req: AuthRequest, res: any) => {
  try {
    const { conversationId, text, itemId } = req.body;
    const senderId = req.user?.uid;

    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Message text is required' 
      });
    }

    // Find user by Firebase uid to get database id
    const sender = await prisma.user.findUnique({
      where: { uid: senderId }
    });
    
    if (!sender) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    let conversation;

    if (conversationId) {
      // Existing conversation
      conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            { buyerId: sender.id },
            { sellerId: sender.id }
          ]
        }
      });

      if (!conversation) {
        return res.status(404).json({ 
          success: false, 
          message: "Conversation not found" 
        });
      }
    } else if (itemId) {
      // New conversation - get item details
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { seller: true }
      });

      if (!item) {
        return res.status(404).json({ 
          success: false, 
          message: "Item not found" 
        });
      }

      // Prevent users from contacting themselves
      if (item.sellerId === sender.id) {
        return res.status(400).json({ 
          success: false, 
          message: "You cannot contact yourself about your own item" 
        });
      }

      // Check if conversation already exists
      const existingConv = await prisma.conversation.findFirst({
        where: {
          itemId: itemId,
          buyerId: sender.id,
          sellerId: item.sellerId
        }
      });

      if (existingConv) {
        conversation = existingConv;
      } else {
        // Create new conversation
        conversation = await prisma.conversation.create({
          data: {
            itemId: itemId,
            buyerId: sender.id,
            sellerId: item.sellerId
          }
        });
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Either conversationId or itemId is required' 
      });
    }

    // Determine receiver
    const receiverId = conversation.buyerId === sender.id ? conversation.sellerId : conversation.buyerId;

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: sender.id,
        receiverId: receiverId,
        text: text.trim()
      }
    });

    // Update conversation's last message
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessage: text.trim() }
    });

    res.status(201).json({ 
      success: true, 
      conversationId: conversation.id,
      message: {
        id: message.id,
        senderId: message.senderId,
        text: message.text,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending message' 
    });
  }
});

export default router;