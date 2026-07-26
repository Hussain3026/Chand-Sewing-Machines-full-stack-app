# Chand Sewing Machines — Full Stack E-Commerce App

A full-stack e-commerce storefront for a sewing machine business — React frontend, Node.js/Express/MongoDB backend, with real authentication, OTP email verification, cart, wishlist, address map picker, and order management.

## Live Links

- **Frontend:** [https://chand-sewing-machines.vercel.app](https://chand-sewing-machines.vercel.app)
- **Backend:** [https://chand-sewing-machines-backend.onrender.com](https://chand-sewing-machines-backend.onrender.com)

## Tech Stack

### Frontend
- React 18 (Create React App)
- React Router DOM
- Context API (Auth, Cart, Wishlist, Orders, Search)
- Axios
- React Slick (banner carousel)
- React Icons
- Leaflet + OpenStreetMap (address map picker)
- Nominatim Geocoding API (free, no key needed)

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT authentication
- bcrypt password hashing
- Nodemailer (Gmail SMTP) for OTP emails
- Ethereal email as fallback

## Features

### Authentication
- User registration and login with JWT
- OTP email verification on signup and login
- Resend OTP with countdown timer
- Protected routes — only logged-in users can access cart, checkout, orders

### Product Catalog
- Product listing with images, ratings, discount pricing
- Product details page with image gallery, quantity selector, related products
- Shop page with category, price, rating, and keyword filters
- Sorting (price low-high, high-low, popularity) and pagination
- Search bar with real-time keyword filtering

### Cart & Wishlist
- Add to cart with quantity control
- Add/remove from wishlist
- Persisted in MongoDB per user

### Checkout & Orders
- Shipping address form with Leaflet/OpenStreetMap picker
- Saved address auto-fills at checkout
- Payment options display (Cash on Delivery active, UPI/Card coming soon)
- Order placement clears cart and saves address
- Order history with expandable item details
- Cancel order option (for orders not yet shipped)
- Order confirmation page

### My Account
- Edit profile (name, email, phone)
- View and update saved address with map picker
- View wishlist and recent orders

### UI/UX
- Fully responsive (desktop / tablet / mobile)
- Skeleton loading states
- Error handling with friendly messages
- Toast notifications for actions

## Project Structure

```
chand-sewing-machines/
├── chand-sewing-frontend/          # React app
│   └── src/
│       ├── api/                    # Axios instance (base URL, auth interceptors)
│       ├── components/             # Header, Footer, ProductCard, MapPicker, AddressForm, etc.
│       ├── context/                # Auth, Cart, Wishlist, Orders, Search context providers
│       ├── hooks/                  # useProducts, useProduct
│       ├── pages/                  # Home, Shop, ProductDetails, Cart, Checkout, Orders, MyAccount, Login, Register
│       ├── services/               # productService — normalizes backend data
│       └── styles/                 # CSS variables and global styles
│
└── chand-sewing-backend/           # Express API
    ├── api/index.js                # Vercel serverless entry point
    ├── config/db.js                # MongoDB Atlas connection
    ├── controllers/                # auth, products, cart, wishlist, orders, otp, users
    ├── middleware/                  # JWT auth guard, admin check, error handler
    ├── models/                     # User, Product, Cart, Wishlist, Order (Mongoose schemas)
    ├── routes/                     # All API routes
    ├── seed/                       # Product catalog seed script
    ├── utils/sendEmail.js          # Gmail SMTP / Ethereal fallback
    └── vercel.json                 # Vercel serverless config
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns OTP prompt if email unverified) |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update name/email |
| POST | `/api/otp/send-email` | Send OTP to email |
| POST | `/api/otp/verify` | Verify OTP and mark email as verified |
| GET | `/api/products` | List products (supports filters, sort, pagination) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/cart` | Add item to cart |
| GET | `/api/cart` | Get cart |
| PUT | `/api/cart/:itemId` | Update cart item quantity |
| DELETE | `/api/cart/:itemId` | Remove item from cart |
| POST | `/api/wishlist/:productId` | Toggle wishlist item |
| GET | `/api/wishlist` | Get wishlist |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Get my orders |
| GET | `/api/orders/:id` | Get order by ID |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| GET | `/api/users/profile` | Get user profile |
| GET | `/api/users/dashboard` | Get dashboard stats |
| PUT | `/api/users/address` | Update saved address |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password (for OTP emails)

### Backend Setup

```bash
cd chand-sewing-backend
cp .env.example .env
```

Edit `.env` with your values:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/chand-sewing
JWT_SECRET=your_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

```bash
npm install
node seed/seed.js        # seed product catalog
npm run dev              # starts on http://localhost:5000
```

### Frontend Setup

```bash
cd chand-sewing-frontend
cp .env.example .env
```

Edit `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

```bash
npm install
npm start                # starts on http://localhost:3000
```

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `any_long_random_string` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `PORT` | Server port (default 5000) | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `EMAIL_USER` | Gmail address for OTP emails | `your@gmail.com` |
| `EMAIL_PASS` | Gmail App Password (16 chars) | `xxxx xxxx xxxx xxxx` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set **Root Directory** to `chand-sewing-frontend`
3. Add env variable: `REACT_APP_API_BASE_URL` = your backend URL + `/api`

### Backend (Render)
1. Connect GitHub repo to Render
2. Set **Root Directory** to `chand-sewing-backend`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `node server.js`
5. Add all backend environment variables in Render dashboard

## License

This project is for educational purposes.
