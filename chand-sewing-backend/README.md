# Chand Sewing Machines — Backend API

Node.js + Express + MongoDB (Mongoose) + JWT auth.

## 1. Prerequisites

- Node.js installed
- A MongoDB database — either:
  - **Local**: install MongoDB Community Server and run it (`mongod`), or
  - **Atlas (free, easiest)**: create a free cluster at https://www.mongodb.com/cloud/atlas, get your connection string

## 2. Setup

```bash
cd chand-sewing-backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your local or Atlas connection string
- `JWT_SECRET` — any long random string (e.g. generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `CLIENT_URL` — your React app's URL (default `http://localhost:3000`)

## 3. Seed the product catalog

This loads your existing 16 sewing-machine products into MongoDB:

```bash
npm run seed
```

Run `npm run seed:destroy` to wipe the products collection if you need to start over.

## 4. Run the server

```bash
npm run dev
```

Runs on `http://localhost:5000` (or whatever `PORT` you set). Check it's alive:

```bash
curl http://localhost:5000/api/health
```

## API Reference

All protected routes need a header: `Authorization: Bearer <token>` (token comes back from register/login).

### Auth — `/api/auth`
| Method | Route | Auth | Body |
|---|---|---|---|
| POST | `/register` | – | `{ name, email, password }` |
| POST | `/login` | – | `{ email, password }` |
| GET | `/me` | ✅ | – |
| PUT | `/profile` | ✅ | `{ name, email }` |
| PUT | `/password` | ✅ | `{ currentPassword, newPassword }` |
| PUT | `/address` | ✅ | `{ fullName, phone, line1, city, state, pincode }` |

### Products — `/api/products` (all public)
| Method | Route |
|---|---|
| GET | `/` — all products |
| GET | `/:id` |
| GET | `/categories` |
| GET | `/category/:category` |

### Cart — `/api/cart` (all protected)
| Method | Route | Body |
|---|---|---|
| GET | `/` | – |
| POST | `/` | `{ productId, qty }` |
| PUT | `/:productId` | `{ qty }` |
| DELETE | `/:productId` | – |
| DELETE | `/` | – (clear cart) |

### Wishlist — `/api/wishlist` (all protected)
| Method | Route |
|---|---|
| GET | `/` |
| POST | `/:productId` — toggles add/remove |

### Orders — `/api/orders` (all protected)
| Method | Route | Body |
|---|---|---|
| POST | `/` | `{ shippingAddress, paymentMethod }` — builds the order from whatever's in your cart, then empties it |
| GET | `/` | – (my orders) |
| GET | `/:id` | – |

## Notes

- Passwords are hashed with bcrypt — never stored in plain text (unlike the old localStorage mock).
- Orders store a **snapshot** of each product (title/image/price at order time), so your order history stays accurate even if you edit or delete a product later.
- `Product.toClientJSON()` in `models/Product.js` reshapes each document into exactly the object shape your React frontend already expects — this is the single place to touch if you ever change what a "product" looks like.
