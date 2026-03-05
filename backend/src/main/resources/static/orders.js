// API Base URL
const API_BASE_URL = '/api';

// Global state
let currentUser = null;
let authToken = null;
let orders = [];

// ── Helper ──────────────────────────────────────────────────────────────────
function getUserDisplayName(user) {
    if (!user) return 'User';
    if (user.name) return user.name;
    const first = user.firstName || '';
    const last  = user.lastName  || '';
    return (first + ' ' + last).trim() || user.email || 'User';
}

// ── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const savedUser  = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');

    if (!savedUser) {
        showNotification('Please login first', 'warning');
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        return;
    }

    currentUser = JSON.parse(savedUser);
    authToken   = savedToken;

    injectNavUserInfo();
    loadOrders();
});

// ── Inject user info + logout into navbar ───────────────────────────────────
function injectNavUserInfo() {
    const navRight = document.getElementById('navRight');
    if (!navRight || !currentUser) return;

    const displayName = getUserDisplayName(currentUser);
    const firstName   = displayName.split(' ')[0];

    navRight.innerHTML = `
        <span style="color: rgba(255,255,255,0.8); font-size:13px; margin-right:8px;">Hello, ${firstName}</span>
        <button class="btn-logout" onclick="logout()">Logout</button>
    `;
}

// ── Logout ──────────────────────────────────────────────────────────────────
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = 'index.html';
}

// ── Load orders ─────────────────────────────────────────────────────────────
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders?userId=${currentUser.id}`);

        if (!response.ok) throw new Error('Failed to load orders');

        const data = await response.json();
        orders = data.content || data || [];

        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Failed to load orders', 'error');
        document.querySelector('.orders-container').innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:rgba(255,255,255,0.4);">
                <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
                <div>Failed to load orders. Please try again.</div>
            </div>`;
    }
}

// ── Display orders ──────────────────────────────────────────────────────────
function displayOrders() {
    const container = document.querySelector('.orders-container');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 20px;">
                <div style="font-size:60px; margin-bottom:16px;">📦</div>
                <h2 style="color:#fff; margin-bottom:12px;">No orders yet</h2>
                <p style="color:rgba(255,255,255,0.5); margin-bottom:24px;">Start shopping to see your orders here!</p>
                <button class="btn-primary" onclick="window.location.href='index.html'">Start Shopping</button>
            </div>`;
        return;
    }

    container.innerHTML = orders.map(order => {
        const subtotal = order.totalAmount - 99;
        return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.orderNumber}</div>
                    <div class="order-date">Placed on: ${order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : 'N/A'}</div>
                </div>
                <div class="order-status ${getStatusClass(order.status)}">${formatStatus(order.status)}</div>
            </div>

            <div class="order-items">
                ${order.items && order.items.length > 0
                    ? order.items.map(item => `
                        <div class="order-item">
                            <div class="item-image">
                                ${item.imageUrl
                                    ? `<img src="${item.imageUrl}" alt="${item.productName}" onerror="this.style.display='none'; this.parentElement.innerText='${item.productName.substring(0,2)}';"/>`
                                    : item.productName.substring(0, 2)}
                            </div>
                            <div class="item-info">
                                <div class="item-name">${item.productName}</div>
                                <div class="item-details">Qty: ${item.quantity}</div>
                            </div>
                            <div class="item-price">₹${(item.unitPrice || item.price || 0).toFixed(2)}</div>
                        </div>`).join('')
                    : '<p style="color:rgba(255,255,255,0.4)">No items found</p>'}
            </div>

            <div class="order-summary">
                <div class="summary-row"><span>Subtotal</span><span>₹${subtotal.toFixed(2)}</span></div>
                <div class="summary-row"><span>Shipping</span><span>₹99.00</span></div>
                <div class="summary-total"><span>Total</span><span>₹${order.totalAmount.toFixed(2)}</span></div>
            </div>

            ${order.status === 'PENDING' ? `
            <div class="order-actions">
                <button class="btn-ghost" onclick="cancelOrder(${order.id})">Cancel Order</button>
            </div>` : ''}
        </div>`;
    }).join('');
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getStatusClass(status) {
    const map = { PENDING:'pending', PROCESSING:'processing', SHIPPED:'processing', DELIVERED:'completed', CANCELLED:'cancelled' };
    return map[status] || 'pending';
}

function formatStatus(status) {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

// ── Cancel order ─────────────────────────────────────────────────────────────
async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    showNotification('Order cancellation is not available yet', 'info');
}

// ── Close modal ───────────────────────────────────────────────────────────────
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

// ── Notification ──────────────────────────────────────────────────────────────
function showNotification(message, type = 'info') {
    const colors = { success:'#10b981', error:'#ef4444', warning:'#f59e0b', info:'#3b82f6' };
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position:fixed; top:20px; right:20px; padding:14px 22px;
        background:${colors[type]||colors.info}; color:#fff;
        border-radius:10px; z-index:10000; font-size:14px; font-weight:600;
        box-shadow:0 8px 24px rgba(0,0,0,0.3); opacity:0; transition:opacity 0.3s;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 10);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
