
#Chand Sewing Machines — Full Stack E-Commerce App

A full-stack e-commerce storefront for a sewing machine business — React frontend, Node.js/Express/MongoDB backend, with real authentication, cart, wishlist, and order management.

Tech Stack

Frontend


React.js (Create React App)
React Router DOM
Context API (Auth, Cart, Wishlist, Search)
Axios
React Slick (banner carousel)
React Icons
Material UI (location picker modal)


Backend


Node.js + Express
MongoDB + Mongoose
JWT authentication
bcrypt password hashing


Features


Product catalog with categories, ratings, discount pricing
Product details page with image gallery, quantity selector, related products
Shop page with category / price / rating / keyword filters, sorting, pagination
User registration & login (JWT-based)
Per-user cart and wishlist (persisted in MongoDB)
Full checkout flow — shipping address (auto-fills from last order), payment method selection, order placement
Order history ("My Orders") and order confirmation page
My Account — edit profile, change password, saved address, wishlist, recent orders
Fully responsive (desktop / tablet / mobile)


Project Structure

chand-sewing-machines/
├── chand-sewing-frontend/     # React app
│   ├── src/
│   │   ├── api/               # axios instance + raw API calls
│   │   ├── components/        # Header, ProductCard, CountryDropdown, etc.
│   │   ├── context/           # Auth, Cart, Wishlist, Search state
│   │   ├── hooks/             # useProducts, useProduct
│   │   ├── pages/             # Home, Shop, ProductDetails, Cart, Checkout, Orders, MyAccount, etc.
│   │   ├── services/          # productService — normalizes backend data for the UI
│   │   └── styles/            # shared design tokens
│   └── .env.example
│
└── chand-sewing-backend/      # Express API
    ├── config/                # MongoDB connection
    ├── controllers/           # auth, products, cart, wishlist, orders
    ├── middleware/            # JWT auth guard, error handler
    ├── models/                # User, Product, Cart, Wishlist, Order (Mongoose schemas)
    ├── routes/
    ├── seed/                  # product catalog seed script
    └── .env.example

Getting Started
