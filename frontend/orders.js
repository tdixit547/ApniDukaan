// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Global state
let currentUser = null;
let authToken = null;
let orders = [];

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    // Load user from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');

    if (!savedUser) {
        showNotification('Please login first', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    currentUser = JSON.parse(savedUser);
    authToken = savedToken;

    updateUserInfo();
    loadOrders();
    setupNavigation();
});

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const text = this.textContent.trim().toLowerCase();
            if (text === 'shop') {
                window.location.href = 'index.html';
            } else if (text === 'orders') {
                window.location.href = 'orders.html';
            } else if (text === 'profile') {
                window.location.href = 'profile.html';
            }
        });
    });

    // Cart button
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }
}

// Update user info in navbar
function updateUserInfo() {
    const navRight = document.querySelector('.nav-right');
    if (navRight && currentUser) {
        const userInfo = document.createElement('div');
        userInfo.style.marginRight = '10px';
        userInfo.innerHTML = `<span style="color: #ffffff;">Hello, ${currentUser.name}</span>`;
        navRight.insertBefore(userInfo, navRight.firstChild);
    }
}

// Load orders from API
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders?userId=${currentUser.id}`);

        if (!response.ok) {
            throw new Error('Failed to load orders');
        }

        const data = await response.json();
        orders = data.content || data || [];

        displayOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Failed to load orders', 'error');
    }
}

// Display orders
function displayOrders() {
    const ordersContainer = document.getElementById('ordersContainer') || document.querySelector('.orders-container');

    if (!ordersContainer) return;

    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2 style="color: var(--text-muted);">No orders yet</h2>
                <p style="color: var(--text-muted); margin: 20px 0;">Start shopping to see your orders here!</p>
                <button class="btn-primary" onclick="window.location.href='index.html'">Start Shopping</button>
            </div>
        `;
        return;
    }

    ordersContainer.innerHTML = orders.map(order => `
        <div class="order-card glass">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.orderNumber}</div>
                    <div class="order-date">Placed on: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                </div>
                <div class="order-status ${getStatusClass(order.status)}">${formatStatus(order.status)}</div>
            </div>
            
            <div class="order-items">
                ${order.items ? order.items.map(item => `
                    <div class="order-item">
                        <div class="item-image">${item.productName.substring(0, 3)}</div>
                        <div class="item-info">
                            <div class="item-name">${item.productName}</div>
                            <div class="item-details">Qty ${item.quantity}</div>
                        </div>
                        <div class="item-price">₹${(item.unitPrice || item.price || 0).toFixed(2)}</div>
                    </div>
                `).join('') : '<p>No items</p>'}
            </div>
            
            <div class="order-summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>₹${(order.totalAmount - 99).toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>₹99.00</span>
                </div>
                <div class="summary-total">
                    <span>Total:</span>
                    <span>₹${order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="order-actions">
                ${order.status === 'PENDING' ? `<button class="btn-ghost" onclick="cancelOrder(${order.id})">Cancel Order</button>` : ''}
            </div>
        </div>
    `).join('');
}

// Get status class for styling
function getStatusClass(status) {
    const statusMap = {
        'PENDING': 'pending',
        'PROCESSING': 'processing',
        'SHIPPED': 'processing',
        'DELIVERED': 'completed',
        'CANCELLED': 'cancelled'
    };
    return statusMap[status] || 'pending';
}

// Format status for display
function formatStatus(status) {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}?userId=${currentUser.id}`);

        if (!response.ok) {
            throw new Error('Failed to load order details');
        }

        const order = await response.json();

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content order-details-modal">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <h2>Order Details - #${order.orderNumber}</h2>
                
                <div class="order-info-section">
                    <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString('en-IN')}</p>
                    <p><strong>Status:</strong> <span class="order-status ${getStatusClass(order.status)}">${formatStatus(order.status)}</span></p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                    <p><strong>Shipping Address:</strong><br>${order.shippingAddress}</p>
                </div>
                
                <h3>Order Items</h3>
                <div class="order-items-list">
                    ${order.items.map(item => `
                        <div class="order-item-detail">
                            <span>${item.productName}</span>
                            <span>Qty: ${item.quantity}</span>
                            <span>₹${item.price.toFixed(2)} each</span>
                            <span><strong>₹${(item.price * item.quantity).toFixed(2)}</strong></span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-total-section">
                    <p>Subtotal: ₹${(order.totalAmount - 99).toFixed(2)}</p>
                    <p>Shipping: ₹99.00</p>
                    <h3>Total: ₹${order.totalAmount.toFixed(2)}</h3>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error loading order details:', error);
        showNotification('Failed to load order details', 'error');
    }
}

// Cancel order (not implemented in backend, but prepared)
async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }

    showNotification('Order cancellation is not available yet', 'info');
    // This would require a backend endpoint like:
    // PUT /api/orders/{id}/cancel?userId={userId}
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        opacity: 0;
        transition: opacity 0.3s;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

