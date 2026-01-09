import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import prisma from '../lib/prisma.js'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

// Store uploads in a local "uploads" folder (relative to project root)
const upload = multer({ dest: 'uploads/' })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const router = Router()

// GET /api/items - Get all items with filters
router.get('/', auth, async (req: any, res: any) => {
  const { search, category, minPrice, maxPrice, condition, tags, sortBy, page, limit } = req.query

  const searchStr = (search as string) || ''
  const categoryStr = (category as string) || ''
  const conditionStr = (condition as string) || ''
  const tagsStr = (tags as string) || ''
  const minPriceNum = minPrice ? Number(minPrice) : 0
  const maxPriceNum = maxPrice ? Number(maxPrice) : 1000000 // Increased max for flexibility
  const pageInt = page ? Number(page) : 1
  const limitInt = limit ? Number(limit) : 10
  const sortByStr = (sortBy as string) || 'recent'

  try {
    // Build where clause
    const whereClause: any = {
      isAvailable: true
    }

    // Search in title and description
    if (searchStr) {
      whereClause.OR = [
        {
          title: {
            contains: searchStr,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: searchStr,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Category filter
    if (categoryStr) {
      whereClause.category = categoryStr
    }

    // Price range
    whereClause.price = {
      gte: minPriceNum,
      lte: maxPriceNum
    }

    // Condition filter
    if (conditionStr) {
      whereClause.condition = conditionStr
    }

    // Tags filter (search in tags array)
    if (tagsStr) {
      const tagArray = tagsStr.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean)
      if (tagArray.length > 0) {
        whereClause.tags = {
          hasSome: tagArray
        }
      }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' } // default
    if (sortByStr === 'price_low') {
      orderBy = { price: 'asc' }
    } else if (sortByStr === 'price_high') {
      orderBy = { price: 'desc' }
    } else if (sortByStr === 'popular') {
      // For now, use createdAt as popularity proxy
      // In future, can add viewCount or likeCount
      orderBy = { createdAt: 'desc' }
    } else if (sortByStr === 'recent') {
      orderBy = { createdAt: 'desc' }
    }

    // Get total count for pagination
    const total = await prisma.item.count({ where: whereClause })

    // Get items
    const items = await prisma.item.findMany({
      where: whereClause,
      orderBy,
      take: limitInt,
      skip: (pageInt - 1) * limitInt,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            hostel: true,
            year: true,
            avatar: true
          }
        }
      }
    })

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitInt)

    res.status(200).json({
      success: true,
      items,
      pagination: {
        total,
        page: pageInt,
        limit: limitInt,
        pages: totalPages,
        hasMore: pageInt < totalPages
      }
    })
  } catch (error) {
    console.error('Error getting items:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting items'
    })
  }
})

// GET /api/items/:id/similar - Get similar items for a given item
router.get('/:id/similar', auth, async (req: any, res: any) => {
  const id = req.params.id

  try {
    // Find the base item first
    const baseItem = await prisma.item.findUnique({
      where: { id }
    })

    if (!baseItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      })
    }

    // Find other items in the same category, excluding this item
    const items = await prisma.item.findMany({
      where: {
        category: baseItem.category,
        isAvailable: true,
        NOT: { id }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 8,
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            hostel: true,
            year: true,
            avatar: true
          }
        }
      }
    })

    res.status(200).json({ success: true, items })
  } catch (error) {
    console.error('Error getting similar items:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting similar items'
    })
  }
})

// GET /api/items/:id - Get item by ID
router.get('/:id', auth, async (req: any, res: any) => {
  const id = req.params.id

  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            hostel: true,
            year: true,
            avatar: true
          }
        }
      }
    })

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      })
    }

    res.status(200).json({ success: true, item })
  } catch (error) {
    console.error('Error getting item:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting item'
    })
  }
})

// POST /api/items - Create new item
router.post('/', auth, upload.array('images', 5), async (req: any, res: any) => {
  const { title, description, price, category, condition, tags } = req.body
  const files = req.files as Express.Multer.File[]

  try {
    const user = await prisma.user.findUnique({
      where: { uid: req.user.uid }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const uploadResults = await Promise.all(
      (files || []).map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder: 'campusswap/items'
        })
      )
    )

    const imageUrls = uploadResults.map((r) => r.url)
    const parsedPrice = Number(price)

    const parsedTags: string[] = tags
      ? Array.isArray(tags)
        ? (tags as string[])
        : JSON.parse(tags)
      : []

    const item = await prisma.item.create({
      data: {
        title,
        description,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        category,
        condition,
        images: imageUrls,
        tags: parsedTags,
        isAvailable: true,
        sellerId: user.id
      }
    })

    res.status(201).json({ success: true, item })
  } catch (error) {
    console.error('Error creating item:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating item'
    })
  }
})

// PUT /api/items/:id - Update item
router.put('/:id', auth, async (req: any, res: any) => {
  const id = req.params.id
  const { title, description, price, category, condition, isAvailable } = req.body

  try {
    const data: any = {}

    if (title !== undefined) data.title = title
    if (description !== undefined) data.description = description
    if (category !== undefined) data.category = category
    if (condition !== undefined) data.condition = condition
    if (price !== undefined) {
      const parsedPrice = Number(price)
      data.price = isNaN(parsedPrice) ? 0 : parsedPrice
    }
    if (isAvailable !== undefined) {
      data.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : isAvailable === 'true'
    }

    const item = await prisma.item.update({
      where: { id },
      data
    })

    res.status(200).json({ success: true, item })
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating item'
    })
  }
})

// DELETE /api/items/:id - Delete item
router.delete('/:id', auth, async (req: any, res: any) => {
  const id = req.params.id

  try {
    const item = await prisma.item.delete({
      where: { id }
    })

    res.status(200).json({ success: true, item })
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting item'
    })
  }
})

// GET /api/items/my - Get current user's items
router.get('/my', auth, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: req.user.uid }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const items = await prisma.item.findMany({
      where: {
        sellerId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({ success: true, items })
  } catch (error) {
    console.error('Error getting my items:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting my items'
    })
  }
})

// GET /api/items/test - Create a test item for development
router.get('/test', auth, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: req.user.uid }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const testItem = await prisma.item.create({
      data: {
        title: 'Test Item - Study Table',
        description: 'A test study table in good condition. Perfect for students.',
        price: 1500,
        category: 'Furniture',
        condition: 'Used',
        images: ['https://via.placeholder.com/400x300'],
        tags: [],
        isAvailable: true,
        sellerId: user.id
      }
    })

    res.status(201).json({ success: true, item: testItem })
  } catch (error) {
    console.error('Error creating test item:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating test item'
    })
  }
})

// POST /api/items/seed-homepage - Seed dummy homepage items for current user (hackathon/demo)
router.post('/seed-homepage', auth, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: req.user.uid }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Avoid creating duplicates for the same user
    const existingCount = await prisma.item.count({
      where: { sellerId: user.id }
    })

    if (existingCount > 0) {
      return res.status(200).json({
        success: true,
        message: 'Items already exist for this user, skipping seed.',
        existingCount
      })
    }

    const dummyItems = [
      {
        title: 'Engineering Mathematics Book',
        description: 'Engineering Mathematics textbook in good condition, minimal markings.',
        price: 350,
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1'],
        tags: ['book', 'engineering', 'maths'],
        category: 'TextBooks'
      },
      {
        title: 'HP Wired Keyboard',
        description: 'HP USB keyboard, smooth keys, fully working.',
        price: 500,
        condition: 'Very Good',
        images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3'],
        tags: ['keyboard', 'electronics', 'hp'],
        category: 'Electronics'
      },
      {
        title: 'Scientific Calculator',
        description: 'Casio scientific calculator, perfect for exams.',
        price: 700,
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1587145820266-a5951ee6f620'],
        tags: ['calculator', 'casio', 'exam'],
        category: 'Electronics'
      },
      {
        title: 'Hostel Study Table',
        description: 'Compact wooden study table suitable for hostel rooms.',
        price: 1800,
        condition: 'Used',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7'],
        tags: ['table', 'furniture', 'hostel'],
        category: 'Furniture'
      },
      {
        title: 'Backpack for College',
        description: 'Spacious backpack with laptop compartment.',
        price: 900,
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
        tags: ['bag', 'backpack', 'college'],
        category: 'HostelItems'
      },
      {
        title: 'Electric Kettle',
        description: '1.5L electric kettle, useful for hostel life.',
        price: 1100,
        condition: 'Very Good',
        images: ['https://images.unsplash.com/photo-1616627981431-5b8c1a4f8f8e'],
        tags: ['kettle', 'hostel', 'appliance'],
        category: 'HostelItems'
      },
      {
        title: 'Laptop Cooling Pad',
        description: 'Cooling pad with dual fans, improves laptop airflow.',
        price: 650,
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04'],
        tags: ['laptop', 'cooling', 'accessory'],
        category: 'Electronics'
      },
      {
        title: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness.',
        price: 450,
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'],
        tags: ['lamp', 'study', 'light'],
        category: 'Furniture'
      }
    ]

    const result = await prisma.item.createMany({
      data: dummyItems.map((d) => ({
        title: d.title,
        description: d.description,
        price: d.price,
        category: d.category,
        condition: d.condition,
        images: d.images,
        tags: d.tags,
        isAvailable: true,
        sellerId: user.id
      }))
    })

    res.status(201).json({
      success: true,
      message: 'Dummy homepage items created for current user.',
      createdCount: result.count
    })
  } catch (error) {
    console.error('Error seeding homepage items:', error)
    res.status(500).json({
      success: false,
      message: 'Error seeding homepage items'
    })
  }
})

// GET /api/items/debug - Debug endpoint to check all items
router.get('/debug', auth, async (req: any, res: any) => {
  try {
    const allItems = await prisma.item.findMany({
      include: {
        seller: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            hostel: true,
            year: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({
      success: true,
      count: allItems.length,
      items: allItems
    })
  } catch (error) {
    console.error('Debug error:', error)
    res.status(500).json({
      success: false,
      message: 'Debug error',
      error: (error as Error).message
    })
  }
})

export default router


