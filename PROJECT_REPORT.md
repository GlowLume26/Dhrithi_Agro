# DRITHI AGRO MARKETPLACE
## Project Completion Report

---

**Project Name:** Drithi Agro — Agriculture E-Commerce Platform
**Client:** Drithi Agro
**Technology Stack:** PHP 8.2 | MySQL (MariaDB 10.4) | HTML5 | CSS3 | JavaScript (Vanilla)
**Project Type:** Full-Stack Web Application
**Delivery Date:** May 31, 2026
**GitHub Repository:** https://github.com/GlowLume26/Dhrithi_Agro
**Local URL:** http://localhost/drithi-agro/frontend/

---

## 1. PROJECT OVERVIEW

Drithi Agro is a full-featured agriculture e-commerce marketplace built for Indian farmers. The platform connects farmers (customers) with agricultural product vendors, enabling them to browse, purchase, and track orders for seeds, fertilizers, pesticides, farm tools, and more — all from a single platform.

The system supports three types of users:
- **Customers (Farmers)** — Browse products, place orders, manage cart & wishlist
- **Vendors (Sellers)** — Register, list products, manage inventory & view sales dashboard
- **Admin** — Approve vendors, manage orders, monitor platform analytics

---

## 2. FINAL PROJECT STRUCTURE

```
drithi-agro/
├── frontend/                     ← All UI files (HTML, CSS, JS)
│   ├── index.html                ← Homepage
│   ├── css/
│   │   ├── style.css             ← Main stylesheet
│   │   └── auth.css              ← Login/Register styles
│   ├── js/
│   │   ├── api.js                ← API client (fetch wrapper + auth helpers)
│   │   └── components.js         ← Header, Footer, Cart, Toast (reusable)
│   ├── pages/
│   │   ├── login.html            ← OTP-based login & registration
│   │   ├── categories.html       ← Product listing with filters
│   │   ├── product.html          ← Product detail page
│   │   ├── cart.html             ← Shopping cart
│   │   ├── checkout.html         ← Order placement
│   │   ├── orders.html           ← Order history & tracking
│   │   ├── wishlist.html         ← Saved products
│   │   ├── account.html          ← Customer profile & addresses
│   │   ├── about.html            ← About Drithi Agro
│   │   ├── contact.html          ← Contact & support
│   │   ├── vendor-register.html  ← Vendor onboarding form
│   │   ├── vendor-dashboard.html ← Vendor analytics & stats
│   │   ├── vendor-products.html  ← Vendor product management
│   │   ├── admin-login.html      ← Admin secure login
│   │   ├── admin-dashboard.html  ← Admin analytics panel
│   │   └── admin-vendors.html    ← Vendor approval management
│   └── images/
│
├── backend/                      ← PHP REST API
│   ├── index.php                 ← Central router (?route=controller)
│   ├── .htaccess                 ← Apache mod_rewrite rules
│   ├── config/
│   │   └── database.php          ← DB config + Database singleton class
│   ├── helpers/
│   │   └── helpers.php           ← JWT, Response, OtpHelper, Validator, FileUpload
│   ├── middleware/
│   │   └── auth.php              ← authMiddleware, adminMiddleware, vendorMiddleware
│   ├── controllers/
│   │   ├── auth.php              ← OTP send, verify, register
│   │   ├── products.php          ← Full CRUD with filters & pagination
│   │   ├── categories.php        ← Category listing
│   │   ├── cart.php              ← Cart add/update/remove
│   │   ├── orders.php            ← Place order, list, cancel
│   │   ├── wishlist.php          ← Add/remove/list wishlist
│   │   ├── vendors.php           ← Vendor register & dashboard
│   │   ├── admin.php             ← Admin panel APIs
│   │   └── customer.php          ← Profile & address management
│   └── uploads/                  ← Product & vendor document uploads
│
└── database/
    └── schema.sql                ← Complete MySQL schema (19 tables + seed data)
```

---

## 3. TECHNOLOGY STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | HTML5, CSS3, Vanilla JavaScript | — |
| Backend | PHP | 8.2.12 |
| Database | MySQL (MariaDB) | 10.4.32 |
| Web Server | Apache (XAMPP) | 2.4.x |
| Auth | JWT (HS256, custom PHP implementation) | — |
| OTP | Mobile OTP (dev: returned in response, prod: Twilio) | — |
| File Upload | PHP native move_uploaded_file | — |
| Payment | Razorpay (integration-ready, keys configurable) | — |
| Version Control | Git | 2.54.0 |
| Repository | GitHub | — |

---

## 4. DATABASE DESIGN — 19 TABLES

| # | Table | Purpose |
|---|-------|---------|
| 1 | users | All user accounts (Customer, Vendor, Admin) |
| 2 | otp_store | OTP codes with expiry & usage tracking |
| 3 | customers | Customer profile (name, farm size, crop info) |
| 4 | addresses | Delivery addresses (HOME, FARM, OFFICE, OTHER) |
| 5 | vendors | Vendor business details & approval status |
| 6 | vendor_documents | KYC documents (Aadhaar, PAN, GST, etc.) |
| 7 | categories | Product categories with parent-child hierarchy |
| 8 | brands | Brand master (Syngenta, Bayer, IFFCO, etc.) |
| 9 | products | Product catalog with pricing, stock, GST |
| 10 | product_images | Multiple images per product with primary flag |
| 11 | cart | Customer shopping cart |
| 12 | wishlist | Saved/favourite products |
| 13 | orders | Order header with status & payment tracking |
| 14 | order_items | Line items per order with vendor mapping |
| 15 | payments | Razorpay payment records & refund tracking |
| 16 | reviews | Product ratings & reviews (1–5 stars) |
| 17 | offers | Coupon codes (PERCENTAGE / FLAT discount) |
| 18 | banners | Homepage promotional banners |
| 19 | notifications | In-app notifications for users |

**Seed Data Included:**
- 12 product categories (Seeds, Fertilizers, Pesticides, Herbicides, etc.)
- 10 brands (Syngenta, Bayer, IFFCO, UPL, PI Industries, Mahyco, etc.)
- 1 Admin user (mobile: +919999999999)
- 3 active coupon codes (AGRO10, FIRST50, KHARIF25)

---

## 5. API ENDPOINTS

### Authentication
| Method | Route | Action | Auth |
|--------|-------|--------|------|
| POST | ?route=auth | send_otp — Send OTP to mobile | Public |
| POST | ?route=auth | verify_otp — Login with OTP, returns JWT | Public |
| POST | ?route=auth | register — New customer registration | Public |

### Products
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | ?route=products | List products (filters: category, brand, price, search, sort, pagination) | Public |
| GET | ?route=products&id=X | Single product with images & reviews | Public |
| POST | ?route=products | Create product with image upload | Vendor |
| PUT | ?route=products&id=X | Update product details | Vendor |
| DELETE | ?route=products&id=X | Soft delete product | Vendor |

### Cart
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | ?route=cart | Get cart with totals, savings, delivery charge | Customer |
| POST | ?route=cart | Add item to cart | Customer |
| PUT | ?route=cart&id=X | Update item quantity | Customer |
| DELETE | ?route=cart&id=X | Remove item (or clear all) | Customer |

### Orders
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | ?route=orders | List orders with pagination & status filter | Customer |
| GET | ?route=orders&id=X | Order detail with items, payment, address | Customer |
| POST | ?route=orders | Place order (validates stock, applies coupon) | Customer |
| PUT | ?route=orders&id=X | Cancel order (restores stock) | Customer |

### Wishlist
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | ?route=wishlist | Get wishlist items | Customer |
| POST | ?route=wishlist | Add product to wishlist | Customer |
| DELETE | ?route=wishlist&product_id=X | Remove from wishlist | Customer |

### Customer
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | ?route=customer&section=profile | Get profile + stats | Customer |
| PUT | ?route=customer&section=profile | Update profile | Customer |
| GET | ?route=customer&section=addresses | List addresses | Customer |
| POST | ?route=customer&section=addresses | Add address | Customer |
| DELETE | ?route=customer&section=addresses&id=X | Delete address | Customer |

### Vendors
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | ?route=vendors | List approved vendors | Public |
| POST | ?route=vendors&action=register | Vendor registration with document upload | Public |
| GET | ?route=vendors&action=dashboard | Vendor stats, orders, top products | Vendor |

### Admin
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | ?route=admin&section=dashboard | Platform stats & revenue | Admin |
| GET | ?route=admin&section=vendors&status=PENDING | Vendor applications | Admin |
| PUT | ?route=admin&action=approve&id=X | Approve vendor | Admin |
| PUT | ?route=admin&action=reject&id=X | Reject vendor with reason | Admin |
| GET | ?route=admin&section=orders | All orders with filters | Admin |
| PUT | ?route=admin&section=orders&id=X | Update order status | Admin |
| GET | ?route=admin&section=customers | All customers list | Admin |

---

## 6. KEY FEATURES DELIVERED

### Customer Features
- Mobile OTP-based login (no password required)
- Product browsing with category, brand, price, search filters
- Sorting by price, rating, sold count
- Pagination (up to 50 products per page)
- Add to cart / wishlist
- Coupon code application at checkout
- Free delivery on orders above ₹499
- Order placement with address selection
- Order history & cancellation
- Profile management with farm details
- Multiple delivery addresses (Home, Farm, Office)

### Vendor Features
- Vendor registration with KYC document upload (Aadhaar, PAN, GST, etc.)
- Admin approval workflow
- Product listing with up to 5 images per product
- Stock management
- Sales dashboard with:
  - Total revenue, orders, products, average rating
  - Pending orders & low stock alerts
  - Recent orders list
  - Top 5 selling products
  - 6-month monthly revenue chart data

### Admin Features
- Platform-wide dashboard:
  - Total customers, vendors, products, orders, revenue
  - Pending vendor count
  - Recent orders
  - 6-month revenue trend
- Vendor approval / rejection with reason
- Auto-generates Vendor ID code (DA-VND-XXXXX)
- Auto-generates temporary password on approval
- In-app notification sent to vendor on approval/rejection
- Order status management (CONFIRMED → PACKED → SHIPPED → DELIVERED)
- Customer list with order count & total spend

### Security Features
- JWT authentication (HS256, 24-hour expiry)
- Role-based access control (CUSTOMER / VENDOR / ADMIN)
- OTP expiry (10 minutes), single-use enforcement
- Prepared statements (SQL injection prevention)
- File upload validation (type + size limits)
- CORS headers configured

---

## 7. FRONTEND PAGES (16 Pages)

| Page | File | Description |
|------|------|-------------|
| Homepage | index.html | Hero slider, categories, best sellers, brands, testimonials |
| Login | login.html | OTP-based login & new registration |
| Categories | categories.html | Product listing with filters & sorting |
| Product Detail | product.html | Images, description, reviews, add to cart |
| Cart | cart.html | Cart items, totals, coupon, checkout |
| Checkout | checkout.html | Address selection, payment method, order placement |
| Orders | orders.html | Order history with status tracking |
| Wishlist | wishlist.html | Saved products |
| Account | account.html | Profile, addresses, stats |
| About | about.html | Company info |
| Contact | contact.html | Support & helpline |
| Vendor Register | vendor-register.html | Multi-step vendor onboarding |
| Vendor Dashboard | vendor-dashboard.html | Sales analytics & stats |
| Vendor Products | vendor-products.html | Product management |
| Admin Login | admin-login.html | Secure admin access |
| Admin Dashboard | admin-dashboard.html | Platform analytics |
| Admin Vendors | admin-vendors.html | Vendor approval panel |

---

## 8. BUSINESS LOGIC HIGHLIGHTS

- **Delivery Charge:** Free above ₹499, else ₹49
- **Coupon System:** Supports PERCENTAGE and FLAT discount types with min order value and max discount cap
- **Stock Management:** Auto-decrements on order placement, auto-restores on cancellation
- **Order Cancellation:** Only allowed in PLACED or CONFIRMED status
- **Vendor Approval:** Vendors are inactive until admin approves; activation is automatic on approval
- **Product Soft Delete:** Products are deactivated (is_active=0), not permanently deleted
- **GST Support:** Per-product GST rate field (default 5%)
- **HSN Code:** Supported per product for compliance

---

## 9. SETUP & DEPLOYMENT

### Requirements
- XAMPP (Apache 2.4 + PHP 8.2 + MariaDB 10.4)
- mod_rewrite enabled in Apache
- AllowOverride All in Apache config

### Steps
```
1. Place project in: C:\xampp\htdocs\drithi-agro\

2. Import database:
   mysql -u root drithi_agro < database/schema.sql

3. Edit backend/config/database.php:
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'drithi_agro');
   define('APP_URL',  'http://localhost/drithi-agro/backend');

4. Start Apache & MySQL from XAMPP

5. Open: http://localhost/drithi-agro/frontend/
```

### URLs
| Page | URL |
|------|-----|
| Frontend | http://localhost/drithi-agro/frontend/ |
| Admin Login | http://localhost/drithi-agro/frontend/pages/admin-login.html |
| Vendor Register | http://localhost/drithi-agro/frontend/pages/vendor-register.html |
| API Base | http://localhost/drithi-agro/backend/index.php?route= |
| API Test | http://localhost/drithi-agro/backend/index.php?route=categories |

---

## 10. PRODUCTION CHECKLIST

Before going live, the following must be configured:

| Item | Action Required |
|------|----------------|
| JWT Secret | Change `JWT_SECRET` in `backend/config/database.php` |
| DB Password | Set strong MySQL password |
| OTP SMS | Integrate Twilio API in `backend/controllers/auth.php` |
| Razorpay | Set live `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` |
| SMTP Email | Configure Gmail App Password for notifications |
| HTTPS | Enable SSL certificate on production server |
| APP_URL | Update to production domain |
| uploads/ | Ensure folder has write permissions (chmod 755) |

---

## 11. GITHUB REPOSITORY

- **URL:** https://github.com/GlowLume26/Dhrithi_Agro
- **Branch:** main
- **Total Files:** 40
- **Total Lines of Code:** 6,412+
- **Commit:** Initial commit — Drithi Agro Marketplace (PHP + MySQL)

---

## 12. PROJECT SUMMARY

| Metric | Count |
|--------|-------|
| Frontend Pages | 17 (index + 16 pages) |
| Backend Controllers | 9 |
| API Endpoints | 30+ |
| Database Tables | 19 |
| Total Files Delivered | 40 |
| Lines of Code | 6,412+ |
| User Roles | 3 (Customer, Vendor, Admin) |
| Product Categories | 12 |
| Brands (Seed Data) | 10 |

---

*Drithi Agro Marketplace — Delivered & Deployed*
*Built with ❤️ for Indian Farmers | © 2025 Drithi Agro*
