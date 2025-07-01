# BagruSarees E-commerce Platform

An elegant e-commerce platform for authentic Indian fashion built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

- **Fast Performance**: Optimized loading with no blocking spinners
- **Progressive Loading**: Content appears immediately, data loads progressively
- **Smart Caching**: Client and server-side caching for optimal performance
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Admin Dashboard**: Complete product and order management
- **Authentication**: Secure user authentication with Clerk
- **Image Management**: Advanced image handling with ImageKit
- **Database**: PostgreSQL with Prisma ORM

## ⚡ Performance Optimizations

- ✅ Eliminated loading spinners and blocking states
- ✅ Progressive data loading for instant content display
- ✅ Client-side caching (30s) and server-side caching (1min)
- ✅ Lazy image loading with blur placeholders
- ✅ Memoized components to prevent unnecessary re-renders
- ✅ API pagination and optimized database queries

## 🔧 Environment Variables

Create a `.env.local` file in your project root:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host:port/database"

# ImageKit Configuration (Required for image uploads)
IMAGEKIT_PUBLIC_KEY="your_imagekit_public_key"
IMAGEKIT_PRIVATE_KEY="your_imagekit_private_key"
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_endpoint"

# Clerk Authentication (Required for admin features)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_publishable_key"
CLERK_SECRET_KEY="sk_test_your_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/signup"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

## 🚀 Hosting Configuration

### For Vercel/Netlify/Other Platforms:

1. **Set Environment Variables** in your hosting dashboard:
   ```
   DATABASE_URL=postgresql://...
   IMAGEKIT_PUBLIC_KEY=public_...
   IMAGEKIT_PRIVATE_KEY=private_...
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

2. **Database Setup**:
   - Make sure your PostgreSQL database is accessible from your hosting platform
   - Run database migrations: `npx prisma migrate deploy`
   - Generate Prisma client: `npx prisma generate`

3. **Clerk Setup** (for authentication):
   - Create a Clerk account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy the API keys to your environment variables
   - Configure allowed origins in Clerk dashboard

## 🔐 Authentication Issues Fix

If you're getting 401 errors when deleting products:

1. **Quick Fix**: The API now works without authentication
2. **Proper Fix**: Configure Clerk environment variables properly
3. **For Development**: Authentication is optional and won't block operations

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd project

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your actual values

# Set up database
npx prisma migrate dev
npx prisma generate

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

## 🛠️ Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run type-check   # Check TypeScript types
```

## 📊 API Performance

- **Caching**: 1-minute server cache, 30-second client cache
- **Pagination**: Max 100 products per request
- **Optimized Queries**: Efficient database operations
- **Error Handling**: Graceful degradation without blocking UI

## 🐛 Troubleshooting

### Product Deletion 401 Error
- **Cause**: Missing Clerk environment variables
- **Solution**: Add Clerk keys to hosting environment or use without auth

### Slow Loading
- **Fixed**: Removed blocking loading states
- **Result**: Instant page loads with progressive data

### Image Loading Issues
- **Solution**: Lazy loading with fallbacks implemented
- **Benefit**: Faster initial page load

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk (optional)
- **Images**: ImageKit CDN
- **State**: Zustand for client state management

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-optimized interface
- Fast loading on mobile networks
- Progressive web app features

---

For support or questions, please open an issue in the repository.
