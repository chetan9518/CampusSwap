import { Router } from 'express'
import authRoutes from './auth.js'
import userRoutes from './users.js'
import itemRoutes from './items.js'
import messageRoutes from './messages.js'

const router = Router()

// API routes
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/items', itemRoutes)
router.use('/messages', messageRoutes)

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CampusSwap API is running',
    timestamp: new Date().toISOString()
  })
})

export default router