import express, { Response } from 'express';
import { AuthRequest, auth } from '../middleware/auth';
import prisma from '../lib/prisma';
import firebaseadmin from '../config/firsbaseadmin';
import { generateToken, verifyToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

const router = express.Router();

// POST /auth/google - Login with Google
router.post('/google', async (req: express.Request, res: Response) => {
  try {
    // Check if Firebase Admin is initialized
    if (!firebaseadmin.apps.length) {
      return res.status(503).json({ 
        success: false, 
        message: 'Firebase Admin not configured. Please add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to your .env file.' 
      });
    }

    const { firebaseToken } = req.body;
    
    if (!firebaseToken) {
      return res.status(400).json({ success: false, message: 'Firebase token required' });
    }

    // Verify Firebase token
    const decoded = await firebaseadmin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name, picture } = decoded;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { uid: uid }
    });

    const isNewUser = !user;

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          uid: uid,
          email: email!,
          fullName: name || 'User',
          avatar: picture || null,
        }
      });
    }

    // Generate our JWT
    const jwtToken = generateToken({ uid: user.uid, email: user.email });

    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        hostel: user.hostel,
        year: user.year,
      },
      isNewUser
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
});

// POST /auth/login - Login with email/password
router.post('/login', async (req: express.Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password (only for email users)
    if (user.uid.startsWith('email_') && !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.uid.startsWith('email_')) {
      const isValidPassword = await bcrypt.compare(password, user.password!);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    // Generate our JWT
    const jwtToken = generateToken({ uid: user.uid, email: user.email });
    const isNewUser= false;
    res.status(200).json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        hostel: user.hostel,
        year: user.year,
      },
      isNewUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
});

// POST /auth/register - Register with email/password
router.post('/register', async (req: express.Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const isNewUser = true;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData: Prisma.UserCreateInput = {
      uid: `email_${Date.now()}`, // Generate unique UID for email users
      email: email,
      fullName: fullName,
      password: hashedPassword,
    };

    const user = await prisma.user.create({
      data: userData
    });

    // Generate our JWT
    const jwtToken = generateToken({ uid: user.uid, email: user.email });

    res.status(201).json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        hostel: user.hostel,
        year: user.year,
      },
      isNewUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// POST /auth/complete-profile - Complete onboarding / update profile
router.post('/complete-profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { hostel, year, phone } = req.body;
    const uid = req.user?.uid;
    
    if (!uid) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const user = await prisma.user.update({
      where: { uid: uid },
      data: {
        hostel: hostel || null,
        year: year || null,
        phone: phone || null,
      }
    });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        hostel: user.hostel,
        year: user.year,    
        phone: user.phone,
      }
    });
  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// GET /auth/me - Get current user
router.get('/me', async (req: express.Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token required' });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { uid: decoded.uid }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        uid: user.uid,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        hostel: user.hostel,
        year: user.year,
        phone: user.phone,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
});
router.get("/check-auth", (req: express.Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Authenticated' });
});
export default router;
