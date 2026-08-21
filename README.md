# RentAttire Frontend Project

This is the frontend prototype for the RentAttire **multi-vendor marketplace**, built as a university Web Application Development project.

## Project Description

RentAttire is evolving from a single-shop rental site into a **multi-vendor rental marketplace** — connecting local attire shops (vendors) with customers looking to rent clothing for weddings, parties, and formal events. Think Uber Eats or Airbnb, but for clothing rental in Sri Lanka.

---

## Three User Types

| User Type | Role |
|---|---|
| **Customer** | Browse all shops, filter attire, rent items, track orders |
| **Vendor (Shop Owner)** | Register shop, list products, manage orders, view earnings |
| **Admin** | Approve shops, oversee all orders, manage the platform |

---

## Technologies Used

- **HTML5** — Semantic structure
- **CSS3** — Custom styling, CSS Variables, Responsive Design via Media Queries, Glassmorphism, Google Fonts (Inter + Playfair Display)
- **Vanilla JavaScript** — DOM manipulation, form validation, `localStorage` for cart, dynamic rendering of shops/products/orders
- **SVG** — Icons and placeholders
- *Built entirely without external frameworks (no Bootstrap, Tailwind, React, jQuery, etc.)*

---

## File Structure

### Customer-Facing Pages
- `index.html` — Home page
- `products.html` — Full product catalog with category/price filtering
- `product-details.html` — Single product view with rental date calculator
- `shops.html` — **NEW** Directory of all registered vendor shops
- `shop-profile.html` — **NEW** Individual shop profile with their product listing
- `cart.html` — Shopping cart (uses localStorage)
- `login.html` & `register.html` — Customer authentication mockups
- `account.html`, `history.html`, `tracking.html` — Customer dashboard
- `contact.html`, `about.html`, `privacy.html`, `terms.html` — Informational

### Vendor Pages
- `vendor-register.html` — **NEW** Vendor shop registration
- `vendor-login.html` — **NEW** Vendor login
- `vendor-dashboard.html` — **NEW** Shop overview (earnings, active orders, product count)
- `vendor-products.html` — **NEW** Manage product listings
- `vendor-add-product.html` — **NEW** Add a new product
- `vendor-orders.html` — **NEW** View and update order statuses
- `vendor-profile.html` — **NEW** Edit shop profile and details

### Admin Panel
- `admin/login.html` — **NEW** Admin secure login
- `admin/dashboard.html` — **NEW** Platform-wide overview (total shops, earnings, active orders)
- `admin/shops.html` — **NEW** Approve/disable registered vendor shops
- `admin/orders.html` — **NEW** View all platform orders with platform fee breakdown

### Assets
- `css/style.css` — All styling (design system with CSS variables, animations, glassmorphism)
- `js/script.js` — All client-side logic including mock shops/products data, vendor render functions
- `images/` — Model images and icons

---

## How to Run

Simply open `index.html` in any modern web browser. No server setup is required for this frontend prototype.

To explore the vendor portal: open `vendor-login.html` and click **Sign In** (demo credentials pre-filled).

To explore the admin panel: open `admin/login.html` and click **Secure Login**.

---

## Future Enhancements

- PHP + MySQL backend integration
- Real authentication with session management
- Image upload for vendor products
- Payment gateway integration
- Admin approval workflow with email notifications
- Shop ratings and customer reviews
