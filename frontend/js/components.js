// ===== HEADER COMPONENT =====
function renderHeader(activePage = '') {
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  const home = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
  return `
  <header>
    <div class="header-top">
      <a href="${home}" class="logo">
        <div class="logo-icon">🌿</div>
        <div class="logo-text">
          <h1>Drithi Agro</h1>
          <span>Farm to Future</span>
        </div>
      </a>

      <div class="search-bar">
        <input type="text" placeholder="Search seeds, fertilizers, pesticides..." id="searchInput" />
        <button onclick="doSearch()">🔍</button>
      </div>

      <div class="header-actions">
        <a href="${base}vendor-register.html" class="action-btn sell">🤝 Sell With Us</a>
        <a href="${base}contact.html" class="action-btn">
          <span class="icon">❓</span>
          <span>Help</span>
        </a>
        <a href="${base}wishlist.html" class="action-btn">
          <span class="icon">❤️</span>
          <span>Wishlist</span>
        </a>
        <a href="${base}account.html" class="action-btn">
          <span class="icon">👤</span>
          <span>Account</span>
        </a>
        <a href="${base}cart.html" class="action-btn cart-wrap">
          <span class="icon">🛒</span>
          <span>Cart</span>
          <span class="cart-count" id="cartCount">0</span>
        </a>
      </div>
    </div>

    <nav>
      <a href="${home}" class="${activePage === 'home' ? 'active' : ''}">🏠 Home</a>
      <a href="${base}categories.html" class="${activePage === 'categories' ? 'active' : ''}">🌾 Categories</a>
      <a href="${base}categories.html" class="${activePage === 'seeds' ? 'active' : ''}">🌱 Seeds</a>
      <a href="${base}categories.html" class="${activePage === 'fertilizers' ? 'active' : ''}">🧪 Fertilizers</a>
      <a href="${base}categories.html" class="${activePage === 'pesticides' ? 'active' : ''}">🛡️ Pesticides</a>
      <a href="${base}categories.html" class="${activePage === 'tools' ? 'active' : ''}">🔧 Farm Tools</a>
      <a href="${base}categories.html" class="${activePage === 'organic' ? 'active' : ''}">🌿 Organic</a>
      <a href="${base}categories.html" class="${activePage === 'irrigation' ? 'active' : ''}">💧 Irrigation</a>
      <a href="${base}categories.html" class="${activePage === 'offers' ? 'active' : ''}">🏷️ Offers</a>
      <a href="${base}about.html" class="${activePage === 'about' ? 'active' : ''}">ℹ️ About</a>
    </nav>
  </header>`;
}

// ===== FOOTER COMPONENT =====
function renderFooter() {
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
        <p>India's trusted agri-commerce platform connecting farmers with quality seeds, fertilizers, pesticides and farm tools at the best prices.</p>
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
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Press</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Categories</h4>
        <ul>
          <li><a href="#">Seeds</a></li>
          <li><a href="#">Fertilizers</a></li>
          <li><a href="#">Pesticides</a></li>
          <li><a href="#">Farm Tools</a></li>
          <li><a href="#">Irrigation</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Track Order</a></li>
          <li><a href="#">Returns</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
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

// ===== SEARCH =====
function doSearch() {
  const q = document.getElementById('searchInput')?.value;
  if (q) alert('Searching for: ' + q);
}

// ===== WISHLIST TOGGLE =====
function toggleWish(btn) {
  btn.textContent = btn.textContent === '🤍' ? '❤️' : '🤍';
}

// ===== ADD TO CART =====
function addToCart(name) {
  let cart = JSON.parse(localStorage.getItem('cartCount') || '0');
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
      transition:opacity 0.3s;`;
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2500);
}
