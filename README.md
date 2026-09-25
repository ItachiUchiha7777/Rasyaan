# RASYAAN — Full-Stack MERN Pahadi Products E-Commerce Website

> **Tagline**: *Pahad ka swaad, ghar tak.*  
> **Brand Identity**: Authentic Garhwali / Uttarakhandi / Pahadi Products Marketplace combining Himalayan brand heritage with modern D2C e-commerce excellence.

---

## 🏔️ Features Overview

- **Authentic Pahadi Branding & Visual Identity**: Deep forest green, pine green, warm cream, Himalayan brown, and terracotta aesthetic enriched with subtle Garhwali Aipan geometric motifs.
- **Full-Stack MERN Stack**: React (Vite JS), Node.js, Express, MongoDB Mongoose.
- **Authentication**:
  - JWT Authentication stored securely.
  - bcrypt password hashing.
  - Firebase Google OAuth integration (`/api/auth/google`).
- **Product Management & CRUD**:
  - Search, category filter, price slider, and sorting (Featured, Price Low to High, Price High to Low, Newest, Popular).
  - Admin drag-and-drop Image Uploader with server-side Multer handling.
  - Auto-seeding with 12+ authentic Pahadi products (Pahadi Rajma, Mandua Atta, Jhangora, Himalayan Wild Honey, Buransh Squash, Bhang Chutney, Woolen Socks, etc.).
- **Cart & Checkout Flow**:
  - Stock validation and cart persistence.
  - Email OTP verification modal during checkout before order placement.
  - Unique order number generation (e.g. `RYS-2026-001024`).
- **Order Management & Live Tracker**:
  - Step-by-step visual tracker (Order Placed -> Confirmed -> Processing -> Shipped -> Out for Delivery -> Delivered).
  - Automated transactional HTML emails via Nodemailer (OTP, Order Confirmation, Status updates).
- **Admin Dashboard**:
  - Accessible via `/admin` (No public navbar link).
  - Statistics cards (Total Revenue, Orders, Pending, Delivered, Products, Customers).
  - Recharts analytics graph powered by real MongoDB data.
  - Orders management table with status dropdown changer.
  - Customer accounts analytics.

---

## 🛠️ Project Structure

```text
Rasyaan/
├── package.json               # Root scripts runner
├── server/                    # Node.js + Express + MongoDB Backend
│   ├── config/                # MongoDB Database connection
│   ├── controllers/           # Auth, Product, Cart, Order, Admin controllers
│   ├── middleware/            # Auth, Admin protection, Multer upload, Error handlers
│   ├── models/                # User, Product, Category, Order, Cart, OTP, Review models
│   ├── routes/                # REST API routes
│   ├── utils/                 # Email templates & Seeder data
│   ├── uploads/               # Server-side uploaded product images
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   └── server.js              # Server entry point
└── client/                    # React + Vite Frontend
    ├── src/
    │   ├── components/        # Common, Product, Cart, Order, Admin UI components
    │   ├── context/           # AuthContext & CartContext
    │   ├── firebase/          # Firebase Google OAuth setup
    │   ├── layouts/           # MainLayout & AdminLayout
    │   ├── pages/             # Home, Shop, ProductDetail, Cart, Checkout, Account, Admin, etc.
    │   ├── services/          # Axios API service
    │   └── utils/             # Formatters
    ├── vite.config.js
    ├── tailwind.config.js
    └── index.html
```

---

## 🚀 Quick Start Guide

### 1. Installation

Install dependencies for both server and client:

```bash
# Install root, server, and client packages
npm run install:all
```

### 2. Environment Setup

The backend `.env` file is located at `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://rohitgusain792_db_user:5q0KWTzBpBvn6Wnd@cluster0.f1z1pkb.mongodb.net/rasyaan?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=rasyaan_pahadi_secret_key_2026_super_secure_jwt
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=rohitgusain792@gmail.com
ADMIN_PASSWORD=rohitgusain
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Database Seeding & Auto-Initialization

When the server starts, it automatically seeds default categories, 12+ demo products, and creates/updates the initial Admin user if not already present.

To manually seed the database at any time:

```bash
npm run seed
```

### 4. Running the Application

Run the server and client concurrently or in separate terminals:

**Backend Server**:
```bash
npm run server:dev
```
*Server will run at `http://localhost:5000`*

**Frontend Client**:
```bash
npm run client
```
*Frontend will run at `http://localhost:5173`*

---

## 🔐 Credentials & Portals

### Admin Dashboard Access
- **URL Path**: `http://localhost:5173/admin` *(Notice: No link in header navbar)*
- **Admin Email**: `rohitgusain792@gmail.com`
- **Admin Password**: `rohitgusain`

*Passwords are hashed securely using bcrypt before storing in MongoDB.*

---

## 📜 License
Developed for Rasyaan E-Commerce. Made with ❤️ for Uttarakhand and the Himalayas.
