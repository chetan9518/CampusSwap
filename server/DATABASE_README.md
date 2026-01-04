# CampusSwap Database Schema

## Overview
This Prisma schema supports a complete campus marketplace platform with user authentication, item listings, messaging, reviews, and moderation features.

## Core Models

### 1. User
**Purpose**: Central user authentication and profile management
```sql
Key Fields:
- email, password (authentication)
- fullName, phone, hostel, year (profile info)
- avatar, rating, isVerified (trust signals)
```

### 2. Category
**Purpose**: Item categorization for better browsing
```sql
Predefined Categories:
- Textbooks
- Electronics  
- Furniture
- Hostel Items
- Study Materials
- Sports Equipment
```

### 3. Item
**Purpose**: Main product/listing entity
```sql
Key Features:
- Multiple images, pricing, condition
- Negotiable/delivery options
- Campus-specific meeting spots
- View/favorite counts
- Status tracking (available, sold, reserved)
```

### 4. Message
**Purpose**: Real-time chat between buyers and sellers
```sql
Features:
- Text and image messages
- Read status tracking
- Item-specific conversations
- Offer messages
```

### 5. Review
**Purpose**: User reputation system
```sql
Features:
- 1-5 star ratings
- Comments
- Item-specific reviews
- Prevents duplicate reviews
```

## Supporting Models

### 6. Favorite
**Purpose**: Saved items/wishlist functionality
- Users can save items for later
- Unique constraints prevent duplicates

### 7. Notification  
**Purpose**: User engagement and updates
- Message notifications
- Offer alerts
- System announcements
- Read status tracking

### 8. Report
**Purpose**: Content moderation and safety
- Multiple report reasons
- Admin review workflow
- Item-specific reporting

## Key Relationships

```
User 1:N Item (seller)
User 1:N Message (sender/receiver)
User 1:N Review (reviewer/reviewed)
User 1:N Favorite
User 1:N Notification
User 1:N Report (reporter)

Item 1:N Message
Item 1:N Review  
Item 1:N Favorite
Item 1:N Report

Category 1:N Item
```

## Hackathon Features Supported

### ✅ Core MVP Features
1. **User Authentication** - Email/password login
2. **Item Listings** - Create, view, search items
3. **Categories** - Browse by category
4. **Basic Search** - Title and tag search
5. **User Profiles** - Basic profile info
6. **Messaging** - Buyer-seller chat

### ✅ Advanced Features
1. **Reviews & Ratings** - Trust system
2. **Favorites** - Save items
3. **Notifications** - Real-time updates
4. **Image Uploads** - Multiple item images
5. **Status Tracking** - Available/sold/reserved
6. **Campus Specific** - Hostel/year filtering

### ✅ Premium Features
1. **Content Moderation** - Report system
2. **Advanced Search** - Tags, filters
3. **View Analytics** - Item popularity
4. **Exchange Locations** - Campus meeting spots
5. **Delivery Options** - Delivery availability

## Database Optimization

### Indexes (Implicit)
- All foreign keys automatically indexed
- Unique constraints on email, user-item combos
- Optimized for common queries

### Performance Considerations
- Image URLs stored as strings (external storage)
- JSON field for flexible notification data
- Cascade deletes for data integrity
- View counts for analytics

## Scaling for Hackathon

### Expected Load
- **Users**: 100-500 students
- **Items**: 500-2000 listings  
- **Messages**: 5000-20000 messages
- **Daily Active Users**: 50-200

### Performance Tips
1. **Use connection pooling** in production
2. **Implement pagination** for item listings
3. **Cache popular categories** and items
4. **Optimize image storage** with CDN
5. **Monitor query performance**

## Sample Data for Demo

```javascript
// Users
- 10-20 demo users with different hostels/years
- Mix of verified/unverified accounts
- Various rating levels

// Items  
- 50-100 sample items across categories
- Realistic campus items (textbooks, laptops, furniture)
- Different price ranges and conditions

// Messages
- Sample conversations between users
- Offer negotiations
- Meeting arrangements
```

## Migration Strategy (Prisma 7+)

```bash
# Initialize database
npx prisma migrate dev --name init

# Generate client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

## Environment Variables

Create `.env` file in server directory:

```env
# Database URL for PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/campusswap"

# Optional: Prisma Accelerate for production
# PRISMA_ACCELERATE_URL="prisma://accelerate-url"
```

## Prisma 7 Configuration

The project uses the new Prisma 7 configuration:
- `prisma/schema.prisma` - Model definitions only
- `prisma.config.ts` - Database connection configuration
- Client instantiation in `src/lib/prisma.ts`

## Security Considerations

1. **Password hashing** - Use bcrypt in application layer
2. **Input validation** - Sanitize all user inputs
3. **Rate limiting** - Prevent spam messages
4. **Image validation** - Check file types/sizes
5. **Privacy** - Only show necessary user info

This schema provides a solid foundation for a hackathon-winning campus marketplace! 🚀
