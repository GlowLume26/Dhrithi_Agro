// ============================================================
// DRITHI AGRO — API CLIENT
// Backend: /backend/index.php?route=<controller>
// ============================================================

const API_BASE = 'http://localhost/drithi-agro/backend/index.php?route=';

const Api = {
    token: () => localStorage.getItem('da_token'),

    headers() {
        const h = { 'Content-Type': 'application/json' };
        if (this.token()) h['Authorization'] = 'Bearer ' + this.token();
        return h;
    },

    async get(route, params = {}) {
        const qs  = new URLSearchParams(params).toString();
        const url = API_BASE + route + (qs ? '&' + qs : '');
        const res = await fetch(url, { headers: this.headers() });
        return res.json();
    },

    async post(route, body = {}, params = {}) {
        const qs  = new URLSearchParams(params).toString();
        const url = API_BASE + route + (qs ? '&' + qs : '');
        const res = await fetch(url, { method: 'POST', headers: this.headers(), body: JSON.stringify(body) });
        return res.json();
    },

    async put(route, body = {}, params = {}) {
        const qs  = new URLSearchParams(params).toString();
        const url = API_BASE + route + (qs ? '&' + qs : '');
        const res = await fetch(url, { method: 'PUT', headers: this.headers(), body: JSON.stringify(body) });
        return res.json();
    },

    async delete(route, params = {}) {
        const qs  = new URLSearchParams(params).toString();
        const url = API_BASE + route + (qs ? '&' + qs : '');
        const res = await fetch(url, { method: 'DELETE', headers: this.headers() });
        return res.json();
    },

    isLoggedIn: () => !!localStorage.getItem('da_token'),
    getUser:    () => JSON.parse(localStorage.getItem('da_user') || 'null'),
    logout() {
        localStorage.removeItem('da_token');
        localStorage.removeItem('da_user');
        location.href = '/frontend/pages/login.html';
    },
    saveAuth(token, user) {
        localStorage.setItem('da_token', token);
        localStorage.setItem('da_user', JSON.stringify(user));
    }
};

// Auth
async function apiSendOtp(mobile, purpose = 'LOGIN') {
    return Api.post('auth', { action: 'send_otp', mobile, purpose });
}
async function apiVerifyOtp(mobile, otp) {
    const res = await Api.post('auth', { action: 'verify_otp', mobile, otp });
    if (res.success) Api.saveAuth(res.data.token, res.data.user);
    return res;
}
async function apiRegister(data) {
    const res = await Api.post('auth', { action: 'register', ...data });
    if (res.success) Api.saveAuth(res.data.token, { mobile: data.mobile });
    return res;
}

// Cart
async function apiGetCart()                          { return Api.get('cart'); }
async function apiAddToCart(productId, quantity = 1) { return Api.post('cart', { product_id: productId, quantity }); }
async function apiUpdateCart(cartId, quantity)        { return Api.put('cart', { quantity }, { id: cartId }); }
async function apiRemoveFromCart(cartId)              { return Api.delete('cart', { id: cartId }); }

// Products
async function apiGetProducts(filters = {}) { return Api.get('products', filters); }
async function apiGetProduct(id)            { return Api.get('products', { id }); }

// Orders
async function apiPlaceOrder(data)          { return Api.post('orders', data); }
async function apiGetOrders(params = {})    { return Api.get('orders', params); }
async function apiCancelOrder(id)           { return Api.put('orders', {}, { id }); }

// Wishlist
async function apiGetWishlist()                    { return Api.get('wishlist'); }
async function apiAddToWishlist(productId)          { return Api.post('wishlist', { product_id: productId }); }
async function apiRemoveFromWishlist(productId)     { return Api.delete('wishlist', { product_id: productId }); }

// Customer
async function apiGetProfile()              { return Api.get('customer', { section: 'profile' }); }
async function apiUpdateProfile(data)       { return Api.put('customer', data, { section: 'profile' }); }
async function apiGetAddresses()            { return Api.get('customer', { section: 'addresses' }); }
async function apiAddAddress(data)          { return Api.post('customer', data, { section: 'addresses' }); }

// Vendor
async function apiGetVendorDashboard()      { return Api.get('vendors', { action: 'dashboard' }); }

// Admin
async function apiAdminDashboard()          { return Api.get('admin', { section: 'dashboard' }); }
async function apiGetPendingVendors()       { return Api.get('admin', { section: 'vendors', status: 'PENDING' }); }
async function apiApproveVendor(id)         { return Api.put('admin', {}, { action: 'approve', id }); }
async function apiRejectVendor(id, reason)  { return Api.put('admin', { reason }, { action: 'reject', id }); }
async function apiGetAdminOrders(params={}) { return Api.get('admin', { section: 'orders', ...params }); }
