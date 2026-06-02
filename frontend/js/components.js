// ============================================================
// DRITHI AGRO — COMPONENTS
// ============================================================

// ===== HEADER =====
function renderHeader(activePage = '') {
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  const home = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
  const isLoggedIn = !!localStorage.getItem('da_token');
  const user = JSON.parse(localStorage.getItem('da_user') || 'null');
  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : (user?.mobile ? '👤' : '👤');

  return `
  <header>
    <!-- TOP BAR -->
    <div class="header-top">

      <!-- HAMBURGER (mobile) -->
      <button class="hamburger" onclick="toggleMobileMenu()" aria-label="Menu">☰</button>

      <!-- LOGO -->
      <a href="${home}" class="logo">
        <div class="logo-icon">🌿</div>
        <div class="logo-text">
          <h1>Drithi Agro</h1>
          <span>Farm to Future</span>
        </div>
      </a>

      <!-- CATEGORIES MENU BUTTON (beside search) -->
      <div class="cat-menu-wrap">
        <button class="cat-menu-btn" onclick="toggleCatMenu()" id="catMenuBtn">
          <span>☰</span> Categories
        </button>
        <!-- MEGA DROPDOWN -->
        <div class="cat-dropdown" id="catDropdown">
          <div class="cat-dropdown-grid">
            <div class="cat-col">
              <div class="cat-col-title">💧 Irrigation</div>
              <a href="${base}categories.html?category_id=4">Sprinkler</a>
              <a href="${base}categories.html?category_id=5">Drip Irrigation Accessories</a>
              <a href="${base}categories.html?category_id=6">Pipe & Fitting</a>
              <a href="${base}categories.html?category_id=7">Drip Irrigation Kit</a>
              <a href="${base}categories.html?category_id=8">Rain Pipe</a>
              <a href="${base}categories.html?category_id=1" class="view-all-link">View All →</a>
            </div>
            <div class="cat-col">
              <div class="cat-col-title">🌿 Gardening</div>
              <a href="${base}categories.html?category_id=9">Tools</a>
              <a href="${base}categories.html?category_id=10">Spray Pumps</a>
              <a href="${base}categories.html?category_id=11">Lawn Mowers</a>
              <a href="${base}categories.html?category_id=14">Seeds</a>
              <a href="${base}categories.html?category_id=15">Fertilizer</a>
              <a href="${base}categories.html?category_id=18">Coco Peat</a>
              <a href="${base}categories.html?category_id=21">Grow Bag</a>
              <a href="${base}categories.html?category_id=23">Flower Seeds</a>
              <a href="${base}categories.html?category_id=2" class="view-all-link">View All →</a>
            </div>
            <div class="cat-col">
              <div class="cat-col-title">🐄 Cattle & Bird Care</div>
              <a href="${base}categories.html?category_id=26">Fodder Seed</a>
              <a href="${base}categories.html?category_id=27">Mineral Mixture</a>
              <a href="${base}categories.html?category_id=28">Bird Food</a>
              <a href="${base}categories.html?category_id=30">Aqua Care</a>
              <a href="${base}categories.html?category_id=32">Goat & Sheep Care</a>
              <a href="${base}categories.html?category_id=33">Poultry Feed Supplements</a>
              <a href="${base}categories.html?category_id=36">Animal Health Supplements</a>
              <a href="${base}categories.html?category_id=3" class="view-all-link">View All →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- SEARCH -->
      <div class="search-bar">
        <input type="text" placeholder="Search products..." id="searchInput"/>
        <button onclick="doSearch()">🔍</button>
      </div>

      <!-- ACTIONS -->
      <div class="header-actions">
        <a href="${base}vendor-register.html" class="action-btn sell">🤝 Sell</a>

        <!-- NOTIFICATION BELL -->
        <div class="action-btn notif-wrap" onclick="toggleNotifPanel()">
          <span class="icon">🔔</span>
          <span>Alerts</span>
          <span class="notif-dot" id="notifDot" style="display:none;"></span>
        </div>

        <!-- ORDER TRACKER -->
        <a href="${base}orders.html" class="action-btn">
          <span class="icon">📦</span>
          <span>Orders</span>
        </a>

        <a href="${base}wishlist.html" class="action-btn">
          <span class="icon">❤️</span>
          <span>Wishlist</span>
        </a>

        <!-- ACCOUNT (shows initial if logged in) -->
        <a href="${base}account.html" class="action-btn">
          <span class="icon">${isLoggedIn ? `<span style="background:#f9a825;color:#1b5e20;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;">${initial}</span>` : '👤'}</span>
          <span>${isLoggedIn ? (user?.full_name?.split(' ')[0] || 'Account') : 'Login'}</span>
        </a>

        <a href="${base}cart.html" class="action-btn cart-wrap">
          <span class="icon">🛒</span>
          <span>Cart</span>
          <span class="cart-count" id="cartCount">0</span>
        </a>
      </div>
    </div>

    <!-- NOTIFICATION PANEL -->
    <div class="notif-panel" id="notifPanel">
      <div class="notif-header">
        <span>🔔 Notifications</span>
        <button onclick="toggleNotifPanel()" style="background:none;border:none;cursor:pointer;font-size:18px;color:#666;">✕</button>
      </div>
      <div class="notif-body" id="notifBody">
        <div class="notif-empty">No new notifications</div>
      </div>
    </div>
    <div class="notif-overlay" id="notifOverlay" onclick="toggleNotifPanel()"></div>

    <!-- NAV -->
    <nav id="mainNav">
      <a href="${home}" class="${activePage === 'home' ? 'active' : ''}">🏠 Home</a>
      <a href="${base}categories.html" class="${activePage === 'categories' ? 'active' : ''}">🌾 All Products</a>
      <a href="${base}categories.html?category_id=1" class="${activePage === 'irrigation' ? 'active' : ''}">💧 Irrigation</a>
      <a href="${base}categories.html?category_id=2" class="${activePage === 'gardening' ? 'active' : ''}">🌿 Gardening</a>
      <a href="${base}categories.html?category_id=3" class="${activePage === 'cattle' ? 'active' : ''}">🐄 Cattle & Birds</a>
      <a href="${base}orders.html" class="${activePage === 'orders' ? 'active' : ''}">📦 My Orders</a>
      <a href="${base}categories.html?offers=1" class="${activePage === 'offers' ? 'active' : ''}">🏷️ Best Offers</a>
      <a href="${base}about.html" class="${activePage === 'about' ? 'active' : ''}">ℹ️ About</a>
      <a href="${base}contact.html" class="${activePage === 'contact' ? 'active' : ''}">📞 Contact</a>
    </nav>

    <!-- MOBILE MENU -->
    <div class="mobile-menu" id="mobileMenu">
      <a href="${home}" onclick="toggleMobileMenu()">🏠 Home</a>
      <a href="${base}categories.html" onclick="toggleMobileMenu()">🌾 All Products</a>
      <a href="${base}categories.html?category_id=1" onclick="toggleMobileMenu()">💧 Irrigation</a>
      <a href="${base}categories.html?category_id=2" onclick="toggleMobileMenu()">🌿 Gardening</a>
      <a href="${base}categories.html?category_id=3" onclick="toggleMobileMenu()">🐄 Cattle & Birds</a>
      <a href="${base}orders.html" onclick="toggleMobileMenu()">📦 My Orders</a>
      <a href="${base}categories.html?offers=1" onclick="toggleMobileMenu()">🏷️ Best Offers</a>
      <a href="${base}account.html" onclick="toggleMobileMenu()">👤 Account</a>
      <a href="${base}cart.html" onclick="toggleMobileMenu()">🛒 Cart</a>
      <a href="${base}contact.html" onclick="toggleMobileMenu()">📞 Contact</a>
    </div>
  </header>`;
}

// ===== FOOTER =====
function renderFooter() {
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  return `
  <footer>
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="logo">
          <div class="logo-icon" style="background:#f9a825;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;">🌿</div>
          <div class="logo-text">
            <h1 style="font-size:20px;">Drithi Agro</h1>
            <span style="font-size:11px;color:#a5d6a7;">Farm to Future</span>
          </div>
        </div>
        <p>India's trusted agri-commerce platform connecting farmers with quality products at the best prices.</p>
        <div class="footer-social">
          <div class="social-btn">📘</div>
          <div class="social-btn">📸</div>
          <div class="social-btn">🐦</div>
          <div class="social-btn">▶️</div>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="${base}about.html">About Us</a></li>
          <li><a href="${base}contact.html">Contact Us</a></li>
          <li><a href="${base}vendor-register.html">Sell With Us</a></li>
          <li><a href="${base}orders.html">Track Order</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Categories</h4>
        <ul>
          <li><a href="${base}categories.html?category_id=1">💧 Irrigation</a></li>
          <li><a href="${base}categories.html?category_id=2">🌿 Gardening</a></li>
          <li><a href="${base}categories.html?category_id=3">🐄 Cattle & Bird Care</a></li>
          <li><a href="${base}categories.html?offers=1">🏷️ Best Offers</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <ul>
          <li><a href="${base}contact.html">Help Center</a></li>
          <li><a href="${base}orders.html">Track Order</a></li>
          <li><a href="#">Returns Policy</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Drithi Agro. All rights reserved. | Made with 💚 for Indian Farmers</p>
    </div>
  </footer>
  <button class="scroll-top" id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>`;
}

// ===== SCROLL TO TOP =====
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 300);
});

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const m = document.getElementById('mobileMenu');
  if (m) m.classList.toggle('open');
}

// ===== CATEGORIES MEGA MENU =====
function toggleCatMenu() {
  const d = document.getElementById('catDropdown');
  if (d) d.classList.toggle('open');
}
document.addEventListener('click', function(e) {
  const wrap = document.querySelector('.cat-menu-wrap');
  if (wrap && !wrap.contains(e.target)) {
    const d = document.getElementById('catDropdown');
    if (d) d.classList.remove('open');
  }
});

// ===== NOTIFICATION PANEL =====
function toggleNotifPanel() {
  const panel   = document.getElementById('notifPanel');
  const overlay = document.getElementById('notifOverlay');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open', isOpen);
  if (isOpen) loadNotifications();
}

async function loadNotifications() {
  const token = localStorage.getItem('da_token');
  const body  = document.getElementById('notifBody');
  if (!body) return;
  if (!token) {
    body.innerHTML = '<div class="notif-empty">Please <a href="login.html" style="color:#2e7d32;">login</a> to see notifications.</div>';
    return;
  }
  body.innerHTML = '<div class="notif-empty">Loading...</div>';
  try {
    const res = await fetch('http://localhost/drithi-agro/backend/index.php?route=customer&section=profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(r => r.json());
    if (!res.success) { body.innerHTML = '<div class="notif-empty">No notifications.</div>'; return; }
    // Show recent order status as notification
    const ordersRes = await fetch('http://localhost/drithi-agro/backend/index.php?route=orders', {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(r => r.json());
    if (ordersRes.success && ordersRes.data.length) {
      const dot = document.getElementById('notifDot');
      if (dot) dot.style.display = 'block';
      body.innerHTML = ordersRes.data.slice(0, 5).map(o => `
        <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}orders.html" class="notif-item">
          <div class="notif-icon">📦</div>
          <div>
            <div class="notif-title">Order #${o.order_number}</div>
            <div class="notif-sub">Status: <b>${o.order_status}</b> • ₹${Number(o.total_amount).toLocaleString('en-IN')}</div>
            <div class="notif-time">${new Date(o.placed_at).toLocaleDateString('en-IN')}</div>
          </div>
        </a>`).join('');
    } else {
      body.innerHTML = '<div class="notif-empty">No orders yet.</div>';
    }
  } catch(e) {
    body.innerHTML = '<div class="notif-empty">Could not load notifications.</div>';
  }
}

// ===== SEARCH =====
function doSearch() {
  const q = document.getElementById('searchInput')?.value?.trim();
  if (!q) return;
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = base + 'categories.html?search=' + encodeURIComponent(q);
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.activeElement?.id === 'searchInput') doSearch();
});

// ===== WISHLIST TOGGLE =====
function toggleWish(btn) {
  btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
}

// ===== ADD TO CART =====
function addToCart(name) {
  let cart = parseInt(localStorage.getItem('cartCount') || '0');
  cart++;
  localStorage.setItem('cartCount', cart);
  const count = document.getElementById('cartCount');
  if (count) count.textContent = cart;
  showToast('✅ ' + name + ' added to cart!');
}

// Load cart count on page load
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('cartCount');
  if (saved) {
    const el = document.getElementById('cartCount');
    if (el) el.textContent = saved;
  }
  // Check unread notifications
  if (localStorage.getItem('da_token')) {
    setTimeout(() => {
      const dot = document.getElementById('notifDot');
      if (dot) dot.style.display = 'block';
    }, 1000);
  }
});

// ===== TOAST =====
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = `position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
      background:#1b5e20;color:white;padding:12px 24px;border-radius:30px;
      font-size:14px;font-weight:600;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.2);
      transition:opacity 0.3s;pointer-events:none;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2500);
}
