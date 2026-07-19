# Chand Sewing Machines — Complete Project

This is a full, runnable React app (Create React App). Nothing to merge —
install and run.

## Run it

```bash
cd chand-sewing-full
npm install
npm start
```

Opens at http://localhost:3000

## Build for production

```bash
npm run build
```

## What's included

- Header, Navigation, Location selector, Search bar, Login dropdown, Cart
  icon, All Categories dropdown, Home Banner slider, Footer — all built
  fresh here to match your screenshot's navy/purple look, since I don't
  have your original component code, only the screenshot.
- Best Sellers / New Arrivals / Featured Products sections
- Product cards with hover zoom, wishlist heart, quick view, ratings,
  discount badge, add to cart
- Product Details page with gallery, quantity selector, Add to Cart /
  Buy Now, related products
- Full Shop page: category / price / rating / keyword filters, sorting,
  pagination
- Cart page, Wishlist page, About, Contact
- Data comes from https://fakestoreapi.com via a normalized service
  layer (`src/services/productService.js`) so no component depends on
  Fake Store's field names — swap the API later by editing that file
  and `src/api/axiosClient.js` only

## Swapping in your ORIGINAL header/footer/banner (once this runs)

If you'd rather use your own existing Header/Nav/Banner/Footer code
instead of the ones built here:

1. Get this project running first so you know the rest of the app works.
2. Replace `src/components/Header.jsx`, `Header.css`, `Banner.jsx`,
   `Banner.css`, `Footer.jsx`, `Footer.css` with your own files.
3. Make sure your Header calls `useCart()` for the cart badge count and
   `useSearch()` for the search input, as shown in the current
   `Header.jsx` — that's the only wiring your version needs to keep.

## If you're on Vite instead of CRA

This is set up for Create React App (`react-scripts`). If your original
project was Vite-based, tell me and I'll re-package this as a Vite
project instead — the `src/` folder itself doesn't change, just the
build tooling and entry point.
