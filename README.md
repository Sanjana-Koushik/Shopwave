# 🛍️ ShopWave — Fashion, Crochet & Books E-Commerce

A full-stack e-commerce application built with **React + Tailwind CSS**, **Node.js + Express**, and **MongoDB**.

![ShopWave Banner](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop&q=80)

---

## ✨ Features

- **Home Page** — Hero section, featured products grid, category navigation
- **Product Listing** — Search, filter by category/price, pagination
- **Product Detail** — Images, description, quantity selector, Add to Cart
- **Shopping Cart** — Slide-out drawer with quantity controls and order summary
- **Checkout Flow** — 2-step form: shipping info → order review → place order
- **Order Success** — Confirmation with order ID and summary
- **Admin Dashboard** — Stats, product CRUD, order management
- **JWT Authentication** — Secure admin login with protected routes

---

## 🗂️ Project Structure

```
shopwave/
├── client/          # React + Vite + Tailwind frontend
│   └── src/
│       ├── components/   # Navbar, Footer, ProductCard, CartDrawer, FilterPanel...
│       ├── context/      # CartContext, AuthContext
│       ├── hooks/        # useProducts
│       ├── pages/        # Home, Products, ProductDetail, Checkout, Admin...
│       └── services/     # api.js (Axios)
└── server/          # Node.js + Express backend
    ├── config/       # db.js (Mongoose)
    ├── controllers/  # productController, orderController, authController
    ├── middleware/   # auth.js (JWT), errorHandler.js
    ├── models/       # Product, Order, User
    ├── routes/       # products, orders, auth
    └── seed/         # seedProducts.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org))
- **MongoDB** running locally on `mongodb://localhost:27017`
  - Start with: `mongod` or the MongoDB service on Windows

### 1. Clone / Navigate to the project

```bash
cd shopwave
```

### 2. Setup & Start the Backend

```bash
cd server
npm install          # Already done if following along
npm run seed         # Seeds 12 products + creates admin user
npm run dev          # Starts Express on http://localhost:5000
```

### 3. Setup & Start the Frontend

Open a **new terminal** window:

```bash
cd client
npm install          # Already done if following along
npm run dev          # Starts Vite on http://localhost:5173
```

### 4. Open in Browser

Visit: **http://localhost:5173**

---

## 🔑 Admin Access

| Field | Value |
|-------|-------|
| URL | http://localhost:5173/login |
| Email | `admin@shopwave.com` |
| Password | `admin123` |

After login, visit `/admin` for the dashboard.

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | — | List products (search, filter, paginate) |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/orders` | — | Place an order |
| GET | `/api/orders` | Admin | List all orders |
| GET | `/api/orders/:id` | — | Get order by ID |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| POST | `/api/auth/login` | — | Login, returns JWT |
| POST | `/api/auth/register` | — | Register user |
| GET | `/api/auth/me` | User | Get current user |
| GET | `/api/health` | — | Health check |

### Query Parameters for `GET /api/products`
| Param | Example | Description |
|-------|---------|-------------|
| `search` | `?search=yarn` | Text search |
| `category` | `?category=Crochet` | Filter by category |
| `minPrice` | `?minPrice=500` | Min price filter |
| `maxPrice` | `?maxPrice=2000` | Max price filter |
| `featured` | `?featured=true` | Featured products only |
| `page` | `?page=2` | Pagination |
| `limit` | `?limit=12` | Items per page |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 + custom design system |
| Icons | Lucide React |
| HTTP | Axios |
| Routing | React Router v6 |
| State | React Context API |
| Backend | Node.js + Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT + bcryptjs |
| Dev | nodemon |

---

## 📦 Product Categories

ShopWave stocks 12 seeded demo products across 3 categories:

- **Fashion** — Boho Dress, Leather Tote Bag, Silk Scarf, Gold Hoops
- **Crochet** — Merino Yarn Bundle, Hook Set, Baby Blanket, Wall Hanging
- **Books** — Thread & Stitch Compendium, Fashion Memoir, Novel, Craft Journal

---

## 🧪 Development Notes

- **Mock Checkout**: No real payment gateway. Orders are saved to MongoDB directly.
- **Free Shipping**: Automatically applied on orders over ₹2,000.
- **Cart Persistence**: Cart is saved to `localStorage` and survives page refreshes.
- **JWT Expiry**: Tokens expire after 7 days.

---

## 📝 Environment Variables

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopwave
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

*Built with ❤️ in India*
