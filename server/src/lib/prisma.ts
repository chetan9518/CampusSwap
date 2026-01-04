import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient({

  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})



export default prisma


export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  }
}

// Graceful shutdown
export async function disconnectDB() {
  await prisma.$disconnect()
  console.log('🔌 Database disconnected')
}
