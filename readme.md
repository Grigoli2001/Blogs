# Blog Platform

A modern, full-stack blog platform built with TypeScript, consisting of three main services:

## 1. Blog App (Frontend)

A Next.js-based public-facing blog application that allows users to:

- View published blog posts
- Browse posts by category
- Read individual blog posts with full content
- Infinite scroll for blog listing
- Responsive design for optimal viewing on all devices

**Tech Stack:**

- Next.js
- TypeScript
- Material-UI
- Axios for API communication

## 2. Admin Panel

A React-based administrative interface that provides:

- Secure admin authentication
- Blog post management (create, edit, publish/unpublish)
- Admin user management (for super admins)
- Rich text editing for blog content
- Image upload functionality
- Category management

**Tech Stack:**

- React with Vite
- TypeScript
- Material-UI
- React Query for state management
- Protected routes with role-based access

## 3. Server (Backend)

A Node.js/Express backend service that handles:

- RESTful API endpoints for blog and admin operations
- Authentication and authorization
- File uploads to Firebase Storage
- MongoDB database integration
- Session management

**Key Features:**

- JWT-based authentication
- Role-based access control (admin/superadmin)
- File upload handling
- Blog post CRUD operations
- Admin user management
- Secure session handling

**Tech Stack:**

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Firebase Storage
- JWT for authentication
- Express-session for session management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Firebase account with Storage enabled
- npm or yarn

### Environment Setup

1. Server Configuration:

```bash
cd server
cp .env.example .env
# Configure your environment variables:
# - MongoDB connection string
# - JWT secrets
# - Firebase configuration
# - Session secret
npm install
npm run dev
```

2. Admin Panel Setup:

```bash
cd admin-panel
npm install
npm run dev
```

3. Blog App Setup:

```bash
cd blog-app
npm install
npm run dev
```

### Environment Variables

#### Server (.env)

```
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_token_secret
SESSION_SECRET=your_session_secret
FIREBASE_STORAGE_BUCKET=your_firebase_bucket
```

#### Admin Panel (.env)

```
VITE_API_URL=http://localhost:8080
```

#### Blog App (.env)

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API Endpoints

### Blog Endpoints

- `GET /api/blogs` - Get all published blogs
- `GET /api/blog/:id` - Get specific blog
- `POST /api/blog/create` - Create new blog (admin only)
- `PUT /api/blog/:id` - Update blog (admin only)
- `PUT /api/blog/toggle/:id` - Toggle blog status (admin only)

### Admin Endpoints

- `POST /api/admin/login` - Admin login
- `POST /api/admin/signup` - Create new admin (super admin only)
- `GET /api/admin/me` - Get current admin details
- `GET /api/admin/admins` - List all admins (super admin only)
- `PUT /api/admin/toggle/:adminId` - Toggle admin status (super admin only)

## Security Features

- CORS protection
- Helmet security headers
- JWT token authentication
- Secure session management
- Role-based access control
- Input validation and sanitization

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
