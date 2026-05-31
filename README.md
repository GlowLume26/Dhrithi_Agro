# 🌾 Drithi Agro Marketplace

**India's Agriculture E-Commerce Platform — PHP + MySQL**

---

## 📁 Project Structure

```
drithi-agro/
├── frontend/                     ← All frontend files
│   ├── index.html                ← Homepage
│   ├── css/
│   │   ├── style.css
│   │   └── auth.css
│   ├── js/
│   │   ├── api.js                ← API client (fetch wrapper)
│   │   └── components.js         ← Header, Footer, Cart, Toast
│   ├── pages/
│   │   ├── login.html
│   │   ├── categories.html
│   │   ├── product.html
│   │   ├── cart.html
│   │   ├── checkout.html
│   │   ├── orders.html
│   │   ├── wishlist.html
│   │   ├── account.html
│   │   ├── about.html
│   │   ├── contact.html
│   │   ├── vendor-register.html
│   │   ├── vendor-dashboard.html
│   │   ├── vendor-products.html
│   │   ├── admin-login.html
│   │   ├── admin-dashboard.html
│   │   └── admin-vendors.html
│   └── images/
│
├── backend/                      ← PHP REST API
│   ├── index.php                 ← Router (entry point)
│   ├── .htaccess                 ← Clean URL rewrite
│   ├── config/
│   │   └── database.php          ← DB config + Database class
│   ├── helpers/
│   │   └── helpers.php           ← JWT, Response, OTP, Validator, FileUpload
│   ├── middleware/
│   │   └── auth.php              ← authMiddleware, adminMiddleware, vendorMiddleware
│   ├── controllers/
│   │   ├── auth.php              ← OTP login, register
│   │   ├── products.php          ← CRUD products
│   │   ├── categories.php        ← List categories
│   │   ├── cart.php              ← Cart management
│   │   ├── orders.php            ← Place & manage orders
│   │   ├── wishlist.php          ← Wishlist
│   │   ├── vendors.php           ← Vendor register & dashboard
│   │   ├── admin.php             ← Admin panel APIs
│   │   └── customer.php          ← Profile & addresses
│   └── uploads/                  ← File uploads (auto-created)
│
└── database/
    └── schema.sql                ← MySQL schema (19 tables) + seed data
```

---

## 🚀 Setup

### 1. Database
```sql
-- Import in phpMyAdmin or MySQL CLI:
mysql -u root -p < database/schema.sql
```

### 2. Backend Config
Edit `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'drithi_agro');
define('APP_URL',  'http://localhost/drithi-agro/backend');
```

### 3. Apache / XAMPP
- Place project in `htdocs/drithi-agro/`
- Enable `mod_rewrite` in Apache
- Ensure `AllowOverride All` in Apache config

### 4. Frontend
- Open `frontend/index.html` in browser
- Or serve via: `http://localhost/drithi-agro/frontend/`

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/backend/index.php?route=auth` | Send OTP / Verify OTP / Register |
| GET/POST/PUT/DELETE | `?route=products` | Product CRUD |
| GET | `?route=categories` | List categories |
| GET/POST/PUT/DELETE | `?route=cart` | Cart management |
| GET/POST/PUT | `?route=orders` | Orders |
| GET/POST/DELETE | `?route=wishlist` | Wishlist |
| GET/POST | `?route=vendors` | Vendor register & dashboard |
| GET/PUT | `?route=admin` | Admin panel |
| GET/POST/PUT/DELETE | `?route=customer` | Profile & addresses |

---

## 🔐 Auth Flow
1. POST `?route=auth` `{ action: "send_otp", mobile: "9XXXXXXXXX" }`
2. POST `?route=auth` `{ action: "verify_otp", mobile, otp }` → returns JWT token
3. All protected routes require: `Authorization: Bearer <token>`

---

## 🗄️ Database — 19 Tables
`users` · `otp_store` · `customers` · `addresses` · `vendors` · `vendor_documents`
`categories` · `brands` · `products` · `product_images` · `cart` · `wishlist`
`orders` · `order_items` · `payments` · `reviews` · `offers` · `banners` · `notifications`

---

*Built with ❤️ for Indian Farmers | Drithi Agro © 2025*
