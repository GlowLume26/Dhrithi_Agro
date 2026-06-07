-- ============================================================
-- DRITHI AGRO MARKETPLACE - COMPLETE MySQL DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS drithi_agro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE drithi_agro;

-- 1. USERS
CREATE TABLE users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile     VARCHAR(15) NOT NULL UNIQUE,
    email      VARCHAR(100) UNIQUE,
    role       ENUM('CUSTOMER','VENDOR','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    is_active  BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. OTP STORE
CREATE TABLE otp_store (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile     VARCHAR(15) NOT NULL,
    otp_code   VARCHAR(6) NOT NULL,
    purpose    ENUM('LOGIN','REGISTER','RESET') DEFAULT 'LOGIN',
    expires_at TIMESTAMP NOT NULL,
    is_used    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mobile_otp (mobile, otp_code)
);

-- 3. CUSTOMERS
CREATE TABLE customers (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT NOT NULL UNIQUE,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(100),
    mobile       VARCHAR(15) NOT NULL,
    dob          DATE,
    gender       ENUM('MALE','FEMALE','OTHER'),
    occupation   VARCHAR(50),
    farm_size    DECIMAL(10,2),
    primary_crop VARCHAR(200),
    profile_pic  VARCHAR(500),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. ADDRESSES
CREATE TABLE addresses (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id   BIGINT NOT NULL,
    full_name     VARCHAR(100) NOT NULL,
    mobile        VARCHAR(15) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city          VARCHAR(100) NOT NULL,
    state         VARCHAR(100) NOT NULL,
    pincode       VARCHAR(10) NOT NULL,
    address_type  ENUM('HOME','FARM','OFFICE','OTHER') DEFAULT 'HOME',
    is_default    BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 5. VENDORS
CREATE TABLE vendors (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL UNIQUE,
    vendor_id_code    VARCHAR(20) UNIQUE,
    business_name     VARCHAR(200) NOT NULL,
    owner_name        VARCHAR(100) NOT NULL,
    mobile            VARCHAR(15) NOT NULL,
    email             VARCHAR(100) NOT NULL,
    gst_number        VARCHAR(20) UNIQUE,
    pan_number        VARCHAR(15) UNIQUE,
    business_type     ENUM('SOLE_PROPRIETORSHIP','PARTNERSHIP','PRIVATE_LIMITED','LLP','OTHER'),
    address           TEXT,
    city              VARCHAR(100),
    state             VARCHAR(100),
    pincode           VARCHAR(10),
    store_name        VARCHAR(200),
    store_description TEXT,
    store_banner_url  VARCHAR(500),
    business_logo_url VARCHAR(500),
    bank_account      VARCHAR(30),
    ifsc_code         VARCHAR(15),
    account_holder    VARCHAR(100),
    bank_name         VARCHAR(100),
    status            ENUM('PENDING','APPROVED','REJECTED','SUSPENDED') DEFAULT 'PENDING',
    rejection_reason  TEXT,
    approved_at       TIMESTAMP NULL,
    approved_by       BIGINT NULL,
    temp_password     VARCHAR(100),
    is_verified       BOOLEAN DEFAULT FALSE,
    total_products    INT DEFAULT 0,
    total_orders      INT DEFAULT 0,
    total_revenue     DECIMAL(15,2) DEFAULT 0.00,
    rating            DECIMAL(3,2) DEFAULT 0.00,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. VENDOR DOCUMENTS
CREATE TABLE vendor_documents (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id   BIGINT NOT NULL,
    doc_type    ENUM('AADHAAR','PAN','GST_CERTIFICATE','BUSINESS_REGISTRATION','BANK_PASSBOOK','BUSINESS_LOGO','OTHER') NOT NULL,
    file_url    VARCHAR(500) NOT NULL,
    file_name   VARCHAR(200),
    file_size   BIGINT,
    is_verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- 7. CATEGORIES
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon        VARCHAR(10),
    image_url   VARCHAR(500),
    parent_id   BIGINT NULL,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 8. BRANDS
CREATE TABLE brands (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_url    VARCHAR(500),
    website     VARCHAR(200),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. PRODUCTS
CREATE TABLE products (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id     BIGINT NOT NULL,
    category_id   BIGINT NOT NULL,
    brand_id      BIGINT,
    name          VARCHAR(300) NOT NULL,
    slug          VARCHAR(300) NOT NULL UNIQUE,
    description   TEXT,
    sku           VARCHAR(100) UNIQUE,
    mrp           DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    stock_qty     INT NOT NULL DEFAULT 0,
    unit          VARCHAR(20) DEFAULT 'Piece',
    hsn_code      VARCHAR(20),
    gst_rate      DECIMAL(5,2) DEFAULT 5.00,
    avg_rating    DECIMAL(3,2) DEFAULT 0.00,
    review_count  INT DEFAULT 0,
    sold_count    INT DEFAULT 0,
    is_active     BOOLEAN DEFAULT TRUE,
    is_featured   BOOLEAN DEFAULT FALSE,
    tags          JSON,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    INDEX idx_category (category_id),
    INDEX idx_vendor (vendor_id),
    INDEX idx_price (selling_price),
    FULLTEXT INDEX ft_search (name, description)
);

-- 10. PRODUCT IMAGES
CREATE TABLE product_images (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url  VARCHAR(500) NOT NULL,
    alt_text   VARCHAR(200),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 11. CART
CREATE TABLE cart (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    product_id  BIGINT NOT NULL,
    quantity    INT NOT NULL DEFAULT 1,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_cart (customer_id, product_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 12. WISHLIST
CREATE TABLE wishlist (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    product_id  BIGINT NOT NULL,
    added_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_wishlist (customer_id, product_id),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 13. ORDERS
CREATE TABLE orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number    VARCHAR(30) NOT NULL UNIQUE,
    customer_id     BIGINT NOT NULL,
    address_id      BIGINT NOT NULL,
    subtotal        DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    delivery_charge DECIMAL(10,2) DEFAULT 0.00,
    total_amount    DECIMAL(12,2) NOT NULL,
    coupon_code     VARCHAR(30),
    payment_method  ENUM('UPI','CARD','NET_BANKING','COD','WALLET') NOT NULL,
    payment_status  ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    order_status    ENUM('PLACED','CONFIRMED','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED') DEFAULT 'PLACED',
    notes           TEXT,
    placed_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at    TIMESTAMP NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id),
    INDEX idx_customer_orders (customer_id),
    INDEX idx_order_status (order_status)
);

-- 14. ORDER ITEMS
CREATE TABLE order_items (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id      BIGINT NOT NULL,
    product_id    BIGINT NOT NULL,
    vendor_id     BIGINT NOT NULL,
    product_name  VARCHAR(300) NOT NULL,
    product_image VARCHAR(500),
    quantity      INT NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    total_price   DECIMAL(12,2) NOT NULL,
    item_status   ENUM('PROCESSING','PACKED','SHIPPED','DELIVERED','CANCELLED','RETURNED') DEFAULT 'PROCESSING',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- 15. PAYMENTS
CREATE TABLE payments (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id             BIGINT NOT NULL UNIQUE,
    razorpay_order_id    VARCHAR(100),
    razorpay_payment_id  VARCHAR(100),
    razorpay_signature   VARCHAR(500),
    amount               DECIMAL(12,2) NOT NULL,
    currency             VARCHAR(5) DEFAULT 'INR',
    method               VARCHAR(50),
    status               ENUM('CREATED','AUTHORIZED','CAPTURED','FAILED','REFUNDED') DEFAULT 'CREATED',
    paid_at              TIMESTAMP NULL,
    refund_id            VARCHAR(100),
    refund_amount        DECIMAL(12,2),
    refunded_at          TIMESTAMP NULL,
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 16. REVIEWS
CREATE TABLE reviews (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id    BIGINT NOT NULL,
    customer_id   BIGINT NOT NULL,
    order_id      BIGINT NOT NULL,
    rating        TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title         VARCHAR(200),
    review_text   TEXT,
    images        JSON,
    is_verified   BOOLEAN DEFAULT TRUE,
    is_approved   BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_review (product_id, customer_id, order_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 17. OFFERS & COUPONS
CREATE TABLE offers (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(30) NOT NULL UNIQUE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    discount_type   ENUM('PERCENTAGE','FLAT') NOT NULL,
    discount_value  DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0.00,
    max_discount    DECIMAL(10,2),
    usage_limit     INT,
    used_count      INT DEFAULT 0,
    valid_from      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_until     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. BANNERS
CREATE TABLE banners (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200),
    image_url   VARCHAR(500) NOT NULL,
    link_url    VARCHAR(500),
    position    ENUM('HERO','PROMO','CATEGORY','SIDEBAR') DEFAULT 'HERO',
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    valid_from  TIMESTAMP NULL,
    valid_until TIMESTAMP NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. NOTIFICATIONS
CREATE TABLE notifications (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    title      VARCHAR(200) NOT NULL,
    message    TEXT NOT NULL,
    type       ENUM('ORDER','PAYMENT','OFFER','SYSTEM','VENDOR') DEFAULT 'SYSTEM',
    is_read    BOOLEAN DEFAULT FALSE,
    link_url   VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_notif (user_id, is_read)
);

-- ============================================================
-- SAMPLE DATA
-- ============================================================
INSERT INTO categories (id, name, slug, icon, parent_id, sort_order) VALUES
(1, 'Irrigation',         'irrigation',       '💧', NULL, 1),
(2, 'Gardening',          'gardening',        '🌿', NULL, 2),
(3, 'Cattle & Bird Care', 'cattle-bird-care', '🐄', NULL, 3);

INSERT INTO categories (name, slug, icon, parent_id, sort_order) VALUES
('Sprinkler','sprinkler','🌧️',1,1),
('Drip Irrigation Accessories','drip-irrigation-accessories','💦',1,2),
('Pipe & Fitting','pipe-fitting','🔩',1,3),
('Drip Irrigation Kit','drip-irrigation-kit','🪣',1,4),
('Rain Pipe','rain-pipe','🌂',1,5),
('Tools','gardening-tools','🔧',2,1),
('Spray Pumps','spray-pumps','🧴',2,2),
('Lawn Mowers','lawn-mowers','🌱',2,3),
('Pebbles','pebbles','🪨',2,4),
('Accessories','gardening-accessories','🎒',2,5),
('Seeds','gardening-seeds','🌰',2,6),
('Fertilizer','gardening-fertilizer','🧪',2,7),
('Pesticides','gardening-pesticides','🛡️',2,8),
('Garden Shade Net','garden-shade-net','🕸️',2,9),
('Coco Peat','coco-peat','🥥',2,10),
('Water Compost Management','water-compost-management','♻️',2,11),
('Gardening Kit','gardening-kit','🧰',2,12),
('Grow Bag','grow-bag','🛍️',2,13),
('De Oiled Cake','de-oiled-cake','🌾',2,14),
('Flower Seeds','flower-seeds','🌸',2,15),
('Fertilizer Blend','fertilizer-blend','⚗️',2,16),
('Transplanting / Repotting Mat','transplanting-repotting-mat','🪴',2,17),
('Fodder Seed','fodder-seed','🌿',3,1),
('Mineral Mixture','mineral-mixture','💊',3,2),
('Bird Food','bird-food','🐦',3,3),
('Mosquito Net','mosquito-net','🦟',3,4),
('Aqua Care','aqua-care','🐟',3,5),
('Aquaculture Feed Additives','aquaculture-feed-additives','🦐',3,6),
('Goat and Sheep Care','goat-sheep-care','🐑',3,7),
('Poultry Feed Supplements','poultry-feed-supplements','🐔',3,8),
('Swine Supplement','swine-supplement','🐷',3,9),
('Silage Bag (Murghas Bag)','silage-bag','🎒',3,10),
('Animal Health Supplements','animal-health-supplements','💉',3,11);

INSERT INTO brands (name, slug) VALUES
('Syngenta India', 'syngenta'),
('Bayer CropScience', 'bayer'),
('IFFCO', 'iffco'),
('UPL Limited', 'upl'),
('PI Industries', 'pi-industries'),
('Mahyco Seeds', 'mahyco'),
('Jain Irrigation', 'jain-irrigation'),
('Anand Agro', 'anand-agro'),
('Noble Crop Science', 'noble-crop'),
('Coromandel International', 'coromandel');

INSERT INTO users (mobile, email, role) VALUES ('+919999999999', 'admin@drithiagro.com', 'ADMIN');

INSERT INTO offers (code, title, discount_type, discount_value, min_order_value, valid_from, valid_until) VALUES
('AGRO10', '10% off on all orders', 'PERCENTAGE', 10.00, 299.00, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('FIRST50', 'Flat ₹50 off on first order', 'FLAT', 50.00, 199.00, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY)),
('KHARIF25', '25% off on Kharif season seeds', 'PERCENTAGE', 25.00, 499.00, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY));
