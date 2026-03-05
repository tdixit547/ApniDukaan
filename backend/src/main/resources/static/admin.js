// Admin Panel JavaScript
const API_BASE_URL = '/api';

let currentUser = null;
let authToken = null;
let allCategories = [];

// Initialize
document.addEventListener('DOMContentLoaded', async function () {
    // Check if user is logged in and is admin
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
        showNotification('Please login as admin', 'error');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    authToken = localStorage.getItem('authToken');

    currentUser = JSON.parse(savedUser);

    // Check if user is admin
    if (currentUser.role !== 'ADMIN') {
        showNotification('Access denied. Admin only.', 'error');
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    // Update UI with user info
    document.getElementById('adminUserInfo').textContent = `Welcome, ${currentUser.name || currentUser.firstName}`;

    // Load dashboard data
    loadDashboard();
    loadCategories();
});

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));

    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    // Load data for section
    switch (sectionName) {
        case 'dashboard': loadDashboard(); break;
        case 'products': loadProducts(); break;
        case 'categories': loadCategoriesTable(); break;
        case 'orders': loadOrders(); break;
        case 'users': loadUsers(); break;
    }
}

// Load Dashboard Stats
async function loadDashboard() {
    try {
        // Get products count
        const productsRes = await fetch(`${API_BASE_URL}/products?page=0&size=1`);
        const productsData = await productsRes.json();
        document.getElementById('totalProducts').textContent = productsData.totalElements || 0;

        // Get categories count
        const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
        const categoriesData = await categoriesRes.json();
        const catCount = Array.isArray(categoriesData) ? categoriesData.length : (categoriesData.totalElements || 0);
        document.getElementById('totalCategories').textContent = catCount;

        // Get orders count
        try {
            const ordersRes = await fetch(`${API_BASE_URL}/orders?userId=${currentUser.id}&isAdmin=true&page=0&size=1`);
            const ordersData = await ordersRes.json();
            document.getElementById('totalOrders').textContent = ordersData.totalElements || 0;
        } catch (e) {
            document.getElementById('totalOrders').textContent = '—';
        }

        // Get users count
        try {
            const usersRes = await fetch(`${API_BASE_URL}/users`);
            const usersData = await usersRes.json();
            document.getElementById('totalUsers').textContent = Array.isArray(usersData) ? usersData.length : 0;
        } catch (e) {
            document.getElementById('totalUsers').textContent = '—';
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load Categories (for product form)
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        allCategories = Array.isArray(data) ? data : (data.content || []);
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// =========== PRODUCTS ===========
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products?page=0&size=100`);
        const data = await response.json();
        const products = data.content || [];

        const tbody = document.getElementById('productsTableBody');
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.categoryName || 'N/A'}</td>
                <td>₹${(p.finalPrice || p.basePrice || 0).toFixed(2)}</td>
                <td>${p.stock ?? p.stockQuantity ?? 0}</td>
                <td>
                    <button class="action-btn action-btn-edit" onclick="editProduct(${p.id})">Edit</button>
                    <button class="action-btn action-btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function showProductModal(product = null) {
    const isEdit = product !== null;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content admin-modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>${isEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <form class="admin-form" onsubmit="saveProduct(event, ${isEdit ? product.id : 'null'})">
                <div>
                    <label>Product Name *</label>
                    <input type="text" id="productName" value="${isEdit ? product.name : ''}" required>
                </div>
                <div>
                    <label>Description</label>
                    <textarea id="productDesc" rows="3">${isEdit ? (product.description || '') : ''}</textarea>
                </div>
                <div>
                    <label>Category *</label>
                    <select id="productCategory" required>
                        ${allCategories.map(c => `
                            <option value="${c.id}" ${isEdit && product.categoryId == c.id ? 'selected' : ''}>${c.name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-row">
                    <div>
                        <label>Base Price *</label>
                        <input type="number" id="productPrice" step="0.01" value="${isEdit ? product.basePrice : ''}" required>
                    </div>
                    <div>
                        <label>Stock *</label>
                        <input type="number" id="productStock" value="${isEdit ? (product.stock || 0) : '50'}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div>
                        <label>Tax (%)</label>
                        <input type="number" id="productTax" step="0.01" value="${isEdit ? (product.tax || 0) : '0'}">
                    </div>
                    <div>
                        <label>Discount (%)</label>
                        <input type="number" id="productDiscount" step="0.01" value="${isEdit ? (product.discount || 0) : '0'}">
                    </div>
                </div>
                <div>
                    <label>SKU</label>
                    <input type="text" id="productSku" value="${isEdit ? (product.sku || '') : ''}">
                </div>
                <button type="submit" class="btn-primary">${isEdit ? 'Update Product' : 'Create Product'}</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function editProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();
        showProductModal(product);
    } catch (error) {
        showNotification('Error loading product', 'error');
    }
}

async function saveProduct(event, productId) {
    event.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDesc').value,
        categoryId: parseInt(document.getElementById('productCategory').value),
        basePrice: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        tax: parseFloat(document.getElementById('productTax').value) || 0,
        discount: parseFloat(document.getElementById('productDiscount').value) || 0,
        sku: document.getElementById('productSku').value || null
    };

    try {
        const url = productId ? `${API_BASE_URL}/products/${productId}` : `${API_BASE_URL}/products`;
        const method = productId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (response.ok) {
            showNotification(`Product ${productId ? 'updated' : 'created'} successfully!`, 'success');
            closeModal();
            loadProducts();
        } else {
            const error = await response.text();
            showNotification(error || 'Failed to save product', 'error');
        }
    } catch (error) {
        showNotification('Error saving product', 'error');
    }
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Product deleted successfully!', 'success');
            loadProducts();
        } else {
            showNotification('Failed to delete product', 'error');
        }
    } catch (error) {
        showNotification('Error deleting product', 'error');
    }
}

// =========== CATEGORIES ===========
async function loadCategoriesTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();
        const categories = Array.isArray(data) ? data : (data.content || []);

        const tbody = document.getElementById('categoriesTableBody');
        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No categories found</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.slug || 'N/A'}</td>
                <td>${c.description || 'N/A'}</td>
                <td>
                    <button class="action-btn action-btn-edit" onclick="editCategory(${c.id})">Edit</button>
                    <button class="action-btn action-btn-delete" onclick="deleteCategory(${c.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function showCategoryModal(category = null) {
    const isEdit = category !== null;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content admin-modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>${isEdit ? 'Edit Category' : 'Add New Category'}</h2>
            <form class="admin-form" onsubmit="saveCategory(event, ${isEdit ? category.id : 'null'})">
                <div>
                    <label>Category Name *</label>
                    <input type="text" id="categoryName" value="${isEdit ? category.name : ''}" required>
                </div>
                <div>
                    <label>Slug</label>
                    <input type="text" id="categorySlug" value="${isEdit ? (category.slug || '') : ''}" placeholder="auto-generated if empty">
                </div>
                <div>
                    <label>Description</label>
                    <textarea id="categoryDesc" rows="3">${isEdit ? (category.description || '') : ''}</textarea>
                </div>
                <button type="submit" class="btn-primary">${isEdit ? 'Update Category' : 'Create Category'}</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

async function editCategory(categoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
        const category = await response.json();
        showCategoryModal(category);
    } catch (error) {
        showNotification('Error loading category', 'error');
    }
}

async function saveCategory(event, categoryId) {
    event.preventDefault();

    const name = document.getElementById('categoryName').value;
    const categoryData = {
        name: name,
        slug: document.getElementById('categorySlug').value || name.toLowerCase().replace(/\s+/g, '-'),
        description: document.getElementById('categoryDesc').value
    };

    try {
        const url = categoryId ? `${API_BASE_URL}/categories/${categoryId}` : `${API_BASE_URL}/categories`;
        const method = categoryId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });

        if (response.ok) {
            showNotification(`Category ${categoryId ? 'updated' : 'created'} successfully!`, 'success');
            closeModal();
            loadCategoriesTable();
            loadCategories(); // Refresh for product form
        } else {
            const error = await response.text();
            showNotification(error || 'Failed to save category', 'error');
        }
    } catch (error) {
        showNotification('Error saving category', 'error');
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Category deleted successfully!', 'success');
            loadCategoriesTable();
            loadCategories();
        } else {
            showNotification('Failed to delete category', 'error');
        }
    } catch (error) {
        showNotification('Error deleting category', 'error');
    }
}

// =========== ORDERS ===========
async function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

    try {
        // Use isAdmin=true to get all orders
        const response = await fetch(`${API_BASE_URL}/orders?userId=${currentUser.id}&isAdmin=true&page=0&size=100`);
        const data = await response.json();
        const orders = data.content || [];

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(o => `
            <tr>
                <td>${o.orderNumber || o.id}</td>
                <td>${o.customerName || o.userId || 'N/A'}</td>
                <td>₹${(o.totalAmount || 0).toFixed(2)}</td>
                <td>
                    <select class="status-select" onchange="updateOrderStatus(${o.id}, this.value)">
                        <option value="PLACED" ${o.status === 'PLACED' ? 'selected' : ''}>Placed</option>
                        <option value="CONFIRMED" ${o.status === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
                        <option value="SHIPPED" ${o.status === 'SHIPPED' ? 'selected' : ''}>Shipped</option>
                        <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
                        <option value="CANCELLED" ${o.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>${o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="action-btn action-btn-view" onclick="viewOrder(${o.id})">View</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        tbody.innerHTML = '<tr><td colspan="6">Error loading orders</td></tr>';
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            showNotification('Order status updated!', 'success');
            loadOrders();
        } else {
            showNotification('Failed to update status', 'error');
        }
    } catch (error) {
        showNotification('Error updating status', 'error');
    }
}

// =========== USERS ===========
async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const users = await response.json();

        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.firstName || ''} ${u.lastName || ''}</td>
                <td>${u.email}</td>
                <td>${u.phone || u.phoneNumber || 'N/A'}</td>
                <td><span class="role-${u.role ? u.role.toLowerCase() : 'customer'}">${u.role || 'CUSTOMER'}</span></td>
                <td>
                    ${u.role !== 'ADMIN' ? `<button class="action-btn action-btn-edit" onclick="makeUserAdmin(${u.id})">Make Admin</button>` : ''}
                    <button class="action-btn action-btn-delete" onclick="deleteUser(${u.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="6">Error loading users</td></tr>';
    }
}

// Make User Admin
async function makeUserAdmin(userId) {
    if (!confirm('Are you sure you want to promote this user to ADMIN?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/make-admin`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showNotification('User promoted to Admin!', 'success');
            loadUsers();
        } else {
            showNotification('Failed to promote user', 'error');
        }
    } catch (error) {
        console.error('Error promoting user:', error);
        showNotification('Error promoting user', 'error');
    }
}

// Delete User
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to DELETE this user? This cannot be undone.')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.ok) {
            showNotification('User deleted successfully', 'success');
            loadUsers();
        } else {
            showNotification('Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user', 'error');
    }
}

// View Order Details
async function viewOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}?userId=${currentUser.id}`);
        const order = await response.json();

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content admin-modal-content">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <h2>Order #${order.orderNumber || order.id}</h2>
                <div style="margin: 16px 0;">
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Customer:</strong> ${order.customerName || order.userId}</p>
                    <p><strong>Address:</strong> ${order.shippingAddress || 'N/A'}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod || 'N/A'}</p>
                    <p><strong>Total:</strong> ₹${(order.totalAmount || 0).toFixed(2)}</p>
                    <p><strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <h3>Items</h3>
                <div style="max-height: 200px; overflow-y: auto;">
                    ${order.items ? order.items.map(item => `
                        <div style="padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <strong>${item.productName}</strong> x${item.quantity}
                            <span style="float: right;">₹${(item.subtotal || item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('') : '<p>No items</p>'}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    } catch (error) {
        showNotification('Error loading order details', 'error');
    }
}

// =========== UTILITIES ===========
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}
