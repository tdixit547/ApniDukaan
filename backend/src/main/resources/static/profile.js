// API Base URL
const API_BASE_URL = '/api';

// Global state
let currentUser = null;
let authToken = null;
let recentOrders = [];

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
    const savedUser  = localStorage.getItem('user');   // ← consistent key
    const savedToken = localStorage.getItem('authToken');

    if (!savedUser) {
        showNotification('Please login first', 'warning');
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        return;
    }

    currentUser = JSON.parse(savedUser);
    authToken   = savedToken;

    injectNavUserInfo();
    displayUserProfile();
    loadRecentOrders();
    setupEventListeners();
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

// ── Setup event listeners ────────────────────────────────────────────────────
function setupEventListeners() {
    const editBtn = document.querySelector('.btn-edit');
    if (editBtn) editBtn.addEventListener('click', showEditProfileModal);

    const changePasswordBtn = document.querySelector('.settings-row:nth-child(1) .btn-ghost');
    if (changePasswordBtn) changePasswordBtn.addEventListener('click', showChangePasswordModal);

    const notificationsBtn = document.querySelector('.settings-row:nth-child(2) .btn-ghost');
    if (notificationsBtn) notificationsBtn.addEventListener('click', () => {
        showNotification('Email notification settings coming soon!', 'info');
    });

    const deleteBtn = document.querySelector('.btn-danger');
    if (deleteBtn) deleteBtn.addEventListener('click', handleDeleteAccount);

    const addAddressBtn = document.querySelector('.btn-small');
    if (addAddressBtn) addAddressBtn.addEventListener('click', showAddAddressModal);
}

// ── Display user profile ─────────────────────────────────────────────────────
function displayUserProfile() {
    const displayName = getUserDisplayName(currentUser);

    const nameEl   = document.getElementById('profileName');
    const emailEl  = document.getElementById('profileEmail');
    const phoneEl  = document.getElementById('profilePhone');
    const avatarEl = document.getElementById('userAvatar');
    const addrEl   = document.getElementById('addressText');

    if (nameEl)   nameEl.textContent  = displayName;
    if (emailEl)  emailEl.textContent = currentUser.email || '';
    if (phoneEl)  phoneEl.textContent = currentUser.phoneNumber || currentUser.phone || 'Not provided';
    if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();

    if (addrEl) {
        const addr = currentUser.address;
        addrEl.innerHTML = addr
            ? addr.split('\n').join('<br>')
            : '<span style="color:rgba(255,255,255,0.3)">No address saved yet.</span>';
    }
}

// ── Load recent orders ────────────────────────────────────────────────────────
async function loadRecentOrders() {
    const card = document.getElementById('recentOrdersCard');
    try {
        const response = await fetch(`${API_BASE_URL}/orders?userId=${currentUser.id}&page=0&size=5`);
        if (!response.ok) throw new Error('Failed');

        const data = await response.json();
        recentOrders = data.content || data || [];
        displayRecentOrders();
    } catch (error) {
        console.error('Error loading recent orders:', error);
        if (card) {
            const placeholder = card.querySelector('div');
            if (placeholder) placeholder.textContent = 'Could not load orders.';
        }
    }
}

// ── Display recent orders ─────────────────────────────────────────────────────
function displayRecentOrders() {
    const card = document.getElementById('recentOrdersCard');
    if (!card) return;

    // Remove loading placeholder
    const placeholder = card.querySelector('div[style]');
    if (placeholder) placeholder.remove();

    // Remove old mini-orders
    card.querySelectorAll('.mini-order').forEach(el => el.remove());

    const viewAllBtn = card.querySelector('.btn-small');

    if (recentOrders.length === 0) {
        const empty = document.createElement('p');
        empty.style.cssText = 'color:rgba(255,255,255,0.4); font-size:13px; padding:8px 0;';
        empty.textContent = 'No orders yet.';
        card.insertBefore(empty, viewAllBtn);
        return;
    }

    recentOrders.slice(0, 3).forEach(order => {
        const el = document.createElement('div');
        el.className = 'mini-order';
        el.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <div class="mini-order-id">#${order.orderNumber.substring(0, 14)}…</div>
                <div class="mini-order-total">₹${order.totalAmount.toFixed(2)}</div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div class="mini-order-date">${order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                    : 'N/A'}</div>
                <div class="mini-order-status ${getStatusClass(order.status)}">${formatStatus(order.status)}</div>
            </div>
        `;
        card.insertBefore(el, viewAllBtn);
    });
}

// ── Status helpers ────────────────────────────────────────────────────────────
function getStatusClass(status) {
    const map = { PENDING:'pending', PROCESSING:'processing', SHIPPED:'processing', DELIVERED:'completed', CANCELLED:'cancelled' };
    return map[status] || 'pending';
}
function formatStatus(status) {
    return status.charAt(0) + status.slice(1).toLowerCase();
}

// ── Edit profile modal ────────────────────────────────────────────────────────
function showEditProfileModal() {
    const displayName = getUserDisplayName(currentUser);
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>Edit Profile</h2>
            <form id="editProfileForm">
                <label>Full Name</label>
                <input type="text" id="editName" value="${displayName}" required>
                <label>Email (cannot change)</label>
                <input type="email" id="editEmail" value="${currentUser.email}" disabled>
                <label>Phone Number</label>
                <input type="tel" id="editPhone" value="${currentUser.phoneNumber || currentUser.phone || ''}">
                <label>Address</label>
                <textarea id="editAddress" rows="3">${currentUser.address || ''}</textarea>
                <button type="submit" class="btn-primary" style="width:100%; margin-top:8px;">Save Changes</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('editProfileForm').addEventListener('submit', handleEditProfile);
}

// ── Handle edit profile ───────────────────────────────────────────────────────
async function handleEditProfile(e) {
    e.preventDefault();
    const name        = document.getElementById('editName').value.trim();
    const phoneNumber = document.getElementById('editPhone').value.trim();
    const address     = document.getElementById('editAddress').value.trim();

    try {
        const response = await fetch(`${API_BASE_URL}/users/me?userId=${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phoneNumber, address })
        });

        if (response.ok) {
            const updatedUser = await response.json();
            currentUser = {
                ...currentUser,
                name: updatedUser.name || name,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                phoneNumber: updatedUser.phoneNumber || updatedUser.phone || phoneNumber,
                phone: updatedUser.phone || updatedUser.phoneNumber || phoneNumber,
                address: updatedUser.address || address
            };
        } else {
            // fallback: save locally
            currentUser.name        = name;
            currentUser.phoneNumber = phoneNumber;
            currentUser.phone       = phoneNumber;
            currentUser.address     = address;
        }

        localStorage.setItem('user', JSON.stringify(currentUser));   // ← consistent key
        showNotification('Profile updated successfully!', 'success');
        closeModal();
        displayUserProfile();
    } catch (error) {
        console.error('Error updating profile:', error);
        currentUser.name        = name;
        currentUser.phoneNumber = phoneNumber;
        currentUser.address     = address;
        localStorage.setItem('user', JSON.stringify(currentUser));
        showNotification('Profile updated (saved locally)', 'info');
        closeModal();
        displayUserProfile();
    }
}

// ── Change password modal ─────────────────────────────────────────────────────
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
                <button type="submit" class="btn-primary" style="width:100%; margin-top:8px;">Change Password</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
}

// ── Handle change password ────────────────────────────────────────────────────
async function handleChangePassword(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword     = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) { showNotification('Passwords do not match', 'error'); return; }
    if (newPassword.length < 6)          { showNotification('Password must be at least 6 characters', 'error'); return; }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        if (response.ok) {
            showNotification('Password changed successfully!', 'success');
            closeModal();
        } else {
            const err = await response.text();
            showNotification(err || 'Failed to change password', 'error');
        }
    } catch (error) {
        showNotification('Failed to change password. Please try again.', 'error');
    }
}

// ── Add address modal ─────────────────────────────────────────────────────────
function showAddAddressModal() {
    const currentAddr = currentUser.address || '';
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>Update Address</h2>
            <form id="addAddressForm">
                <label>Full Address</label>
                <textarea id="addressFull" rows="4" placeholder="House/Flat No., Street, Area, City, State - PIN">${currentAddr}</textarea>
                <button type="submit" class="btn-primary" style="width:100%; margin-top:8px;">Save Address</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('addAddressForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const address = document.getElementById('addressFull').value.trim();
        currentUser.address = address;
        localStorage.setItem('user', JSON.stringify(currentUser));
        showNotification('Address saved!', 'success');
        closeModal();
        displayUserProfile();
    });
}

// ── Delete account ────────────────────────────────────────────────────────────
async function handleDeleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    const check = prompt('Type "DELETE" to confirm:');
    if (check !== 'DELETE') { showNotification('Cancelled', 'info'); return; }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, { method: 'DELETE' });
        if (response.ok) {
            showNotification('Account deleted. Goodbye!', 'success');
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setTimeout(() => { window.location.href = 'index.html'; }, 1500);
        } else {
            const err = await response.text();
            showNotification(err || 'Failed to delete account', 'error');
        }
    } catch (error) {
        showNotification('Failed to delete account.', 'error');
    }
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
