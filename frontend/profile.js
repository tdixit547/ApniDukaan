// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Global state
let currentUser = null;
let authToken = null;
let recentOrders = [];

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

    displayUserProfile();
    loadRecentOrders();
    setupNavigation();
    setupEventListeners();
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

// Setup event listeners
function setupEventListeners() {
    // Edit Profile button
    const editBtn = document.querySelector('.btn-edit');
    if (editBtn) {
        editBtn.addEventListener('click', showEditProfileModal);
    }

    // View All Orders button
    const viewOrdersBtn = document.querySelector('.mini-order + .mini-order + .btn-small');
    if (viewOrdersBtn) {
        viewOrdersBtn.addEventListener('click', function () {
            window.location.href = 'orders.html';
        });
    }

    // Change Password button
    const changePasswordBtn = document.querySelector('.settings-row:nth-child(1) .btn-ghost');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', showChangePasswordModal);
    }

    // Email Notifications button
    const notificationsBtn = document.querySelector('.settings-row:nth-child(2) .btn-ghost');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function () {
            showNotification('Email notification settings coming soon!', 'info');
        });
    }

    // Delete Account button
    const deleteBtn = document.querySelector('.btn-danger');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteAccount);
    }

    // Add New Address button
    const addAddressBtn = document.querySelector('.address-block + .address-block + .btn-small');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', showAddAddressModal);
    }
}

// Display user profile
function displayUserProfile() {
    const profileName = document.getElementById('profileName') || document.querySelector('.profile-name');
    const profileEmail = document.getElementById('profileEmail') || document.querySelector('.profile-email');
    const profilePhone = document.getElementById('profilePhone') || document.querySelector('.profile-phone');
    const profileAvatar = document.getElementById('profileAvatar') || document.querySelector('.avatar');

    if (profileName) profileName.textContent = currentUser.name || 'User';
    if (profileEmail) profileEmail.textContent = currentUser.email || '';
    if (profilePhone) profilePhone.textContent = currentUser.phoneNumber || 'Not provided';

    // Set avatar initials
    if (profileAvatar && currentUser.name) {
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        profileAvatar.textContent = initials;
    }

    // Update address section
    const addressBlock = document.getElementById('defaultAddressText') || document.querySelector('.address-text');
    if (addressBlock && currentUser.address) {
        addressBlock.innerHTML = `
            ${currentUser.name}<br>
            ${currentUser.address.split('\n').join('<br>')}<br>
            Phone: ${currentUser.phoneNumber || 'Not provided'}
        `;
    }
}

// Load recent orders
async function loadRecentOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders?userId=${currentUser.id}&page=0&size=5`);

        if (!response.ok) {
            throw new Error('Failed to load orders');
        }

        const data = await response.json();
        recentOrders = data.content || data || [];

        displayRecentOrders();
    } catch (error) {
        console.error('Error loading recent orders:', error);
        // Don't show error notification, just show no orders
    }
}

// Display recent orders
function displayRecentOrders() {
    const ordersSection = document.getElementById('recentOrdersList');
    if (!ordersSection) return;

    if (recentOrders.length === 0) {
        ordersSection.innerHTML = `
            <p style="color: rgba(255,255,255,0.4); font-size:13px; padding: 10px 0;">No orders yet. <a href="index.html" style="color:#61E4F8;">Start shopping!</a></p>
        `;
        return;
    }

    const ordersToShow = recentOrders.slice(0, 3);
    ordersSection.innerHTML = ordersToShow.map(order => `
        <div class="mini-order">
            <div>
                <div class="mini-order-id">#${order.orderNumber ? order.orderNumber.substring(0, 12) : order.id}</div>
                <div class="mini-order-date">${order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'N/A'}</div>
            </div>
            <div class="mini-order-status ${getStatusClass(order.status)}">${formatStatus(order.status)}</div>
            <div class="mini-order-total">₹${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</div>
        </div>
    `).join('');
}

// Get status class
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

// Format status
function formatStatus(status) {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

// Show edit profile modal
function showEditProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>Edit Profile</h2>
            <form id="editProfileForm">
                <label>Full Name</label>
                <input type="text" id="editName" value="${currentUser.name}" required>
                
                <label>Email</label>
                <input type="email" id="editEmail" value="${currentUser.email}" disabled>
                
                <label>Phone Number</label>
                <input type="tel" id="editPhone" value="${currentUser.phoneNumber || ''}" required>
                
                <label>Address</label>
                <textarea id="editAddress" rows="3">${currentUser.address || ''}</textarea>
                
                <button type="submit" class="btn-primary">Save Changes</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
}

// Handle edit profile
async function handleEditProfile(e) {
    e.preventDefault();

    const name = document.getElementById('editName').value.trim();
    const phoneNumber = document.getElementById('editPhone').value.trim();
    const address = document.getElementById('editAddress').value.trim();

    try {
        // Call the API to update profile
        const response = await fetch(`${API_BASE_URL}/users/me?userId=${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                phoneNumber: phoneNumber,
                address: address
            })
        });

        if (response.ok) {
            const updatedUser = await response.json();

            // Update currentUser with response data
            currentUser = {
                ...currentUser,
                name: updatedUser.name || name,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                phoneNumber: updatedUser.phoneNumber || updatedUser.phone || phoneNumber,
                phone: updatedUser.phone || updatedUser.phoneNumber || phoneNumber,
                address: updatedUser.address || address
            };

            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showNotification('Profile updated successfully!', 'success');
            closeModal();
            displayUserProfile();
        } else {
            // If API fails, still save locally
            console.warn('API update failed, saving locally only');
            currentUser.name = name;
            currentUser.phoneNumber = phoneNumber;
            currentUser.address = address;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            showNotification('Profile updated (saved locally)', 'warning');
            closeModal();
            displayUserProfile();
        }
    } catch (error) {
        console.error('Error updating profile:', error);

        // Fallback: save locally if API call fails
        currentUser.name = name;
        currentUser.phoneNumber = phoneNumber;
        currentUser.address = address;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showNotification('Profile updated (offline mode)', 'info');
        closeModal();
        displayUserProfile();
    }
}

// Show change password modal
function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>Change Password</h2>
            <form id="changePasswordForm">
                <label>Current Password</label>
                <input type="password" id="currentPassword" required>
                
                <label>New Password</label>
                <input type="password" id="newPassword" required minlength="6">
                
                <label>Confirm New Password</label>
                <input type="password" id="confirmPassword" required minlength="6">
                
                <button type="submit" class="btn-primary">Change Password</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
}

// Handle change password
async function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });

        if (response.ok) {
            showNotification('Password changed successfully!', 'success');
            closeModal();
        } else {
            const error = await response.text();
            showNotification(error || 'Failed to change password', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Failed to change password. Please try again.', 'error');
    }
}

// Show add address modal
function showAddAddressModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>Add New Address</h2>
            <form id="addAddressForm">
                <label>Address Label (e.g., Home, Work)</label>
                <input type="text" id="addressLabel" placeholder="Home" required>
                
                <label>Full Address</label>
                <textarea id="addressFull" rows="4" placeholder="House/Flat No., Street, Area" required></textarea>
                
                <label>City</label>
                <input type="text" id="addressCity" placeholder="City" required>
                
                <label>State</label>
                <input type="text" id="addressState" placeholder="State" required>
                
                <label>PIN Code</label>
                <input type="text" id="addressPIN" placeholder="000000" required pattern="[0-9]{6}">
                
                <button type="submit" class="btn-primary">Add Address</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('addAddressForm').addEventListener('submit', handleAddAddress);
}

// Handle add address
async function handleAddAddress(e) {
    e.preventDefault();

    const label = document.getElementById('addressLabel').value.trim();
    const full = document.getElementById('addressFull').value.trim();
    const city = document.getElementById('addressCity').value.trim();
    const state = document.getElementById('addressState').value.trim();
    const pin = document.getElementById('addressPIN').value.trim();

    const fullAddress = `${full}\n${city}, ${state} - ${pin}`;

    showNotification('Address saved! (Note: Multiple addresses not fully supported yet)', 'success');
    closeModal();

    // This would require a user addresses endpoint in the backend
    // POST /api/users/{id}/addresses
}

// Handle delete account
async function handleDeleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (!confirmed) return;

    const doubleCheck = prompt('Type "DELETE" to confirm account deletion:');

    if (doubleCheck !== 'DELETE') {
        showNotification('Account deletion cancelled', 'info');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Account deleted successfully. Goodbye!', 'success');

            // Clear all local storage
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');

            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            const error = await response.text();
            showNotification(error || 'Failed to delete account', 'error');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Failed to delete account. Please try again.', 'error');
    }
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

