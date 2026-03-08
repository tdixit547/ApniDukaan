// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// Global state
let currentUser = null;
let authToken = null;
let cart = [];
let allProducts = [];
let allCategories = [];
let currentPage = 0;
let totalPages = 0;
let currentSort = 'default'; // Sort state: default, price-low, price-high, name-asc, name-desc

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    // Load user and token from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');

    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        authToken = savedToken;
        updateUIForLoggedInUser();

        // Only load cart if user is properly logged in with valid ID
        if (currentUser && currentUser.id) {
            loadCart();
        }
    }

    // Load initial data
    loadCategories();
    loadProducts();

    // Initialize cart UI (will show login prompt if not logged in)
    updateCartUI();

    // Setup event listeners
    setupEventListeners();

    // Setup navigation
    setupNavigation();
});

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const text = this.textContent.trim().toLowerCase();
            if (text === 'shop') {
                window.location.href = 'index.html';
            } else if (text === 'orders') {
                if (currentUser) {
                    window.location.href = 'orders.html';
                } else {
                    showNotification('Please login first', 'warning');
                    showLoginModal();
                }
            } else if (text === 'profile') {
                if (currentUser) {
                    window.location.href = 'profile.html';
                } else {
                    showNotification('Please login first', 'warning');
                    showLoginModal();
                }
            }
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.nav-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function (e) {
            const query = e.target.value.trim();
            if (query.length > 0) {
                searchProducts(query);
            } else {
                loadProducts();
            }
        }, 500));
    }

    // Cart chip click
    const cartChip = document.querySelector('.cart-chip');
    if (cartChip) {
        cartChip.addEventListener('click', function () {
            if (currentUser) {
                toggleCartPanel();
            } else {
                showNotification('Please login to view your cart', 'warning');
                showLoginModal();
            }
        });
    }

    // Shop Now button
    const shopNowBtn = document.querySelector('.btn-primary');
    if (shopNowBtn && shopNowBtn.textContent === 'Shop Now') {
        shopNowBtn.addEventListener('click', function () {
            document.querySelector('.product-grid').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Filter chips - enhanced to support actual categories
    const filterChips = document.querySelectorAll('.filter-chips .chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function () {
            filterChips.forEach(c => c.classList.remove('chip-active'));
            this.classList.add('chip-active');

            const category = this.textContent;
            if (category === 'All') {
                loadProducts();
            } else {
                // Find category ID and filter
                const cat = allCategories.find(c => c.name === category);
                if (cat) {
                    filterProductsByCategory(cat.id);
                }
            }
        });
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Clear cart button
    const clearCartBtn = document.querySelector('.cart-header .btn-ghost-small');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Sort dropdown functionality
    const sortDisplay = document.querySelector('.sort-display');
    if (sortDisplay) {
        sortDisplay.addEventListener('click', showSortDropdown);
        sortDisplay.style.cursor = 'pointer';
    }
}

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const data = await response.json();

        // API returns a list directly, not paginated
        allCategories = Array.isArray(data) ? data : (data.content || []);
        updateCategoryFilters();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Update category filters
function updateCategoryFilters() {
    const filterChips = document.querySelector('.filter-chips');
    if (!filterChips || allCategories.length === 0) return;

    // Keep "All" chip and add actual categories
    filterChips.innerHTML = '<div class="chip chip-active">All</div>';

    allCategories.forEach(category => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = category.name;
        chip.addEventListener('click', function () {
            document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('chip-active'));
            this.classList.add('chip-active');
            filterProductsByCategory(category.id);
        });
        filterChips.appendChild(chip);
    });

    // Re-add All chip listener
    filterChips.querySelector('.chip').addEventListener('click', function () {
        document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('chip-active'));
        this.classList.add('chip-active');
        loadProducts();
    });
}

// Load products from API
async function loadProducts(page = 0) {
    const productGrid = document.querySelector('.product-grid');

    // Show skeleton loading
    if (productGrid) {
        productGrid.innerHTML = Array(6).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text-short"></div>
            </div>
        `).join('');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products?page=${page}&size=20`);
        const data = await response.json();

        allProducts = data.content || [];
        currentPage = data.number || 0;
        totalPages = data.totalPages || 0;

        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load products', 'error');
        if (productGrid) {
            productGrid.innerHTML = '<p class="empty-state-message">Failed to load products. Please try again.</p>';
        }
    }
}

// Search products
async function searchProducts(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/search?query=${encodeURIComponent(query)}&page=0&size=20`);
        const data = await response.json();

        allProducts = data.content || [];
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

// Filter products by category
async function filterProductsByCategory(categoryId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}?page=0&size=20`);
        const data = await response.json();

        allProducts = data.content || [];
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error filtering products:', error);
        showNotification('Failed to filter products', 'error');
    }
}

// Display products in grid
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <div class="empty-state-title">No products found</div>
                <div class="empty-state-message">Try adjusting your search or filters</div>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(product => {
        // API returns 'stock' field, check both field names for compatibility
        const stockQty = product.stock ?? product.stockQuantity ?? 0;
        const isOutOfStock = !stockQty || stockQty <= 0;

        // Use imageUrl from product if available, otherwise show placeholder
        const imageHtml = product.imageUrl
            ? `<img src="${product.imageUrl}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerText='${product.name}';" />`
            : product.name;

        return `
        <div class="product-card" data-product-id="${product.id}" onclick="showProductDetails(${product.id})">
            <div class="product-image">${imageHtml}</div>
            
            <div class="product-content">
                <div class="product-name-row">
                    <span class="product-name">${product.name}</span>
                    ${!isOutOfStock ? '<span class="product-tag">Available</span>' : '<span class="product-tag product-tag-alt">Out of Stock</span>'}
                </div>
                
                <span class="product-desc">
                    ${product.description || 'Quality product for your needs'}
                </span>
                
                <div class="product-bottom">
                    <div class="price-block">
                        <span class="product-price">₹${product.finalPrice ? product.finalPrice.toFixed(2) : product.basePrice.toFixed(2)}</span>
                        ${product.finalPrice && product.finalPrice < product.basePrice ?
                `<span class="product-price-muted">₹${product.basePrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="btn-add" onclick="event.stopPropagation(); addToCart(${product.id})" ${isOutOfStock ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    // Add pagination controls
    renderPagination();
}

// Render pagination controls
function renderPagination() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    // Remove existing pagination
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) existingPagination.remove();

    // Only show pagination if there are multiple pages
    if (totalPages <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';
    pagination.innerHTML = `
        <button class="pagination-button" onclick="loadProducts(${currentPage - 1})" ${currentPage === 0 ? 'disabled' : ''}>
            ← Previous
        </button>
        <span class="pagination-info">Page ${currentPage + 1} of ${totalPages}</span>
        <button class="pagination-button" onclick="loadProducts(${currentPage + 1})" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>
            Next →
        </button>
    `;

    productGrid.insertAdjacentElement('afterend', pagination);
}

// Show product details (with reviews)
async function showProductDetails(productId) {
    try {
        // Fetch product details
        const productResponse = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await productResponse.json();

        // Fetch product reviews - API returns a list, not paginated
        const reviewsResponse = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
        const reviewsData = await reviewsResponse.json();
        // Handle both list and paginated response formats
        const reviews = Array.isArray(reviewsData) ? reviewsData : (reviewsData.content || []);

        // Fetch average rating (handle case when no reviews)
        let averageRating = 0;
        try {
            const ratingResponse = await fetch(`${API_BASE_URL}/products/${productId}/reviews/average`);
            if (ratingResponse.ok) {
                const ratingData = await ratingResponse.json();
                averageRating = typeof ratingData === 'number' ? ratingData : 0;
            }
        } catch (e) {
            console.log('No average rating available');
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content product-details-modal">
                <button class="modal-close" onclick="closeModal()">✕</button>
                ${product.imageUrl ? `
                    <div style="width: 100%; max-width: 400px; height: 300px; margin: 0 auto 20px; border-radius: 12px; overflow: hidden; background: rgba(255,255,255,0.05);">
                        <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';" />
                    </div>
                ` : ''}
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <span>⭐ ${averageRating.toFixed(1)} / 5</span>
                    <span>(${reviews.length} reviews)</span>
                </div>
                <p><strong>Category:</strong> ${product.categoryName}</p>
                <p><strong>Description:</strong> ${product.description || 'No description available'}</p>
                <p><strong>Price:</strong> ₹${product.finalPrice ? product.finalPrice.toFixed(2) : product.basePrice.toFixed(2)}</p>
                ${product.finalPrice && product.finalPrice < product.basePrice ?
                `<p><strong>Original Price:</strong> <s>₹${product.basePrice.toFixed(2)}</s></p>` : ''}
                <p><strong>Stock:</strong> ${product.stockQuantity} units</p>
                
                <div class="product-reviews-section">
                    <h3>Customer Reviews</h3>
                    <div class="reviews-list">
                        ${reviews.length > 0 ? reviews.map(review => `
                            <div class="review-item">
                                <div class="review-header">
                                    <strong>${review.userName || 'Anonymous'}</strong>
                                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                                </div>
                                <p class="review-comment">${review.comment || 'No comment'}</p>
                                <small class="review-date">${new Date(review.createdAt).toLocaleDateString()}</small>
                            </div>
                        `).join('') : '<p>No reviews yet. Be the first to review!</p>'}
                    </div>
                    ${currentUser ? `
                        <div class="add-review-section">
                            <h4>Write a Review</h4>
                            <div class="review-rating-input">
                                <label>Rating:</label>
                                <select id="reviewRating">
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                            </div>
                            <textarea id="reviewComment" placeholder="Share your experience..." rows="4"></textarea>
                            <button class="btn-primary" onclick="submitReview(${productId})">Submit Review</button>
                        </div>
                    ` : '<p><em>Please login to write a review</em></p>'}
                </div>
                
                <div style="margin-top: 20px;">
                    <button class="btn-primary" onclick="addToCart(${productId}); closeModal();" ${product.stockQuantity === 0 ? 'disabled' : ''}>
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error loading product details:', error);
        showNotification('Failed to load product details', 'error');
    }
}

// Submit review
async function submitReview(productId) {
    if (!currentUser) {
        showNotification('Please login first', 'warning');
        return;
    }

    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value.trim();

    if (!comment) {
        showNotification('Please write a comment', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews?userId=${currentUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                rating: parseInt(rating),
                comment: comment
            })
        });

        if (response.ok) {
            showNotification('Review submitted successfully!', 'success');
            closeModal();
            // Refresh product details to show new review
            setTimeout(() => showProductDetails(productId), 500);
        } else {
            const error = await response.text();
            showNotification(error || 'Failed to submit review', 'error');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Failed to submit review', 'error');
    }
}

// Show quick view modal for product
async function showQuickView(productId) {
    try {
        const productResponse = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await productResponse.json();

        const ratingResponse = await fetch(`${API_BASE_URL}/products/${productId}/reviews/average`);
        const averageRating = await ratingResponse.json();

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content quick-view-modal">
                <button class="modal-close" onclick="closeModal()">✕</button>
                <div class="quick-view-content">
                    <div class="quick-view-image">
                        ${product.name.substring(0, 2)}
                    </div>
                    <div class="quick-view-info">
                        <h2>${product.name}</h2>
                        <div class="product-rating">
                            <span>⭐ ${averageRating.toFixed(1)} / 5</span>
                            <span style="color: var(--text-muted);">•</span>
                            <span>${product.categoryName}</span>
                        </div>
                        <div class="quick-view-price">
                            ₹${product.finalPrice ? product.finalPrice.toFixed(2) : product.basePrice.toFixed(2)}
                            ${product.finalPrice && product.finalPrice < product.basePrice ?
                `<span style="text-decoration: line-through; font-size: 18px; color: var(--text-muted); margin-left: 10px;">₹${product.basePrice.toFixed(2)}</span>` : ''}
                        </div>
                        <p class="quick-view-description">
                            ${product.description || 'Quality product for your needs'}
                        </p>
                        <p><strong>Stock:</strong> ${product.stockQuantity} units available</p>
                        <div class="quick-view-actions">
                            <button class="btn-primary" onclick="addToCart(${productId}); closeModal();" ${product.stockQuantity === 0 ? 'disabled' : ''}>
                                Add to Cart
                            </button>
                            <button class="btn-ghost" onclick="closeModal(); setTimeout(() => showProductDetails(${productId}), 300);">
                                Full Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error loading quick view:', error);
        showNotification('Failed to load product preview', 'error');
    }
}

// Add to cart
async function addToCart(productId) {
    if (!currentUser) {
        showNotification('Please login first', 'warning');
        showLoginModal();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/items?userId=${currentUser.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
            })
        });

        if (response.ok) {
            showNotification('Added to cart!', 'success');
            loadCart();
        } else {
            const error = await response.text();
            showNotification(error || 'Failed to add to cart', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add to cart', 'error');
    }
}

// Load cart
async function loadCart() {
    // Guard: Don't load cart if no user or invalid ID
    if (!currentUser || !currentUser.id) {
        console.log('No user logged in, skipping cart load');
        updateCartUI(); // Show empty cart
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart?userId=${currentUser.id}`);
        const data = await response.json();

        cart = data.items || [];
        updateCartUI();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartSubtitle = document.querySelector('.cart-subtitle');
    const cartItems = document.querySelector('.cart-items');
    const cartSummarySubtotal = document.querySelector('.cart-summary-row:nth-child(1) .cart-summary-value');
    const cartSummaryTotal = document.querySelector('.cart-summary-row-total .cart-summary-value');

    // If user is not logged in, show login prompt
    if (!currentUser) {
        if (cartCount) cartCount.textContent = '0';
        if (cartSubtitle) cartSubtitle.textContent = '0 items';
        if (cartItems) {
            cartItems.innerHTML = `
                <div class="empty-state" style="padding: 40px 20px;">
                    <div class="empty-state-icon" style="font-size: 48px;">🛒</div>
                    <div class="empty-state-title" style="font-size: 16px; margin: 12px 0; color: white;">Please Login</div>
                    <div class="empty-state-message" style="font-size: 13px;">Login to see your cart items</div>
                    <button class="btn-primary" onclick="showLoginModal()" style="margin-top: 16px;">Login Now</button>
                </div>
            `;
        }
        if (cartSummarySubtotal) cartSummarySubtotal.textContent = '₹0.00';
        if (cartSummaryTotal) cartSummaryTotal.textContent = '₹0.00';
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => {
        const price = item.unitPrice || item.price || 0;
        return sum + (price * item.quantity);
    }, 0);
    const shipping = cart.length > 0 ? 99 : 0;
    const total = subtotal + shipping;

    if (cartCount) cartCount.textContent = totalItems;
    if (cartSubtitle) cartSubtitle.textContent = `${totalItems} items`;
    if (cartSummarySubtotal) cartSummarySubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    if (cartSummaryTotal) cartSummaryTotal.textContent = `₹${total.toFixed(2)}`;

    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-state" style="padding: 40px 20px;">
                    <div class="empty-state-icon" style="font-size: 48px;">🛒</div>
                    <div class="empty-state-title" style="font-size: 16px; margin: 12px 0; color: white;">Your cart is empty</div>
                    <div class="empty-state-message" style="font-size: 13px;">Start shopping to add items!</div>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => {
                const price = item.unitPrice || item.price || 0;
                return `
                <div class="cart-item">
                    <div class="cart-item-left">
                        <div class="cart-item-thumb">${item.productName.substring(0, 3)}</div>
                        <div class="cart-item-info">
                            <span class="cart-item-name">${item.productName}</span>
                            <span class="cart-item-meta">₹${price.toFixed(2)} each</span>
                        </div>
                    </div>
                    
                    <div class="cart-item-right">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">−</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <span class="cart-item-price">₹${(price * item.quantity).toFixed(2)}</span>
                        <button class="btn-icon" onclick="removeFromCart(${item.id})">🗑</button>
                    </div>
                </div>
            `;
            }).join('');
        }
    }
}

// Clear cart
async function clearCart() {
    if (!currentUser || cart.length === 0) return;

    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
        // Remove each item
        for (const item of cart) {
            await fetch(`${API_BASE_URL}/cart/items/${item.id}?userId=${currentUser.id}`, {
                method: 'DELETE'
            });
        }

        showNotification('Cart cleared', 'success');
        loadCart();
    } catch (error) {
        console.error('Error clearing cart:', error);
        showNotification('Failed to clear cart', 'error');
    }
}

// Handle checkout
async function handleCheckout() {
    if (!currentUser) {
        showNotification('Please login first', 'warning');
        showLoginModal();
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    // Show checkout modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content checkout-modal">
            <button class="modal-close" onclick="closeModal()">✕</button>
            <h2>Checkout</h2>
            <form id="checkoutForm">
                <label>Shipping Address *</label>
                <textarea id="shippingAddress" rows="3" placeholder="Enter full address" required>${currentUser.address || ''}</textarea>
                
                <label>Payment Method *</label>
                <select id="paymentMethod" required>
                    <option value="COD">Cash on Delivery</option>
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="WALLET">Wallet</option>
                </select>
                
                <label>Phone Number *</label>
                <input type="tel" id="phoneNumber" placeholder="Enter phone number" value="${currentUser.phoneNumber || ''}" required>
                
                <div class="checkout-summary">
                    <h3>Order Summary</h3>
                    <p>Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p>Subtotal: ₹${cart.reduce((sum, item) => {
        const price = item.unitPrice || item.price || 0;
        return sum + (price * item.quantity);
    }, 0).toFixed(2)}</p>
                    <p>Shipping: ₹99.00</p>
                    <p><strong>Total: ₹${(cart.reduce((sum, item) => {
        const price = item.unitPrice || item.price || 0;
        return sum + (price * item.quantity);
    }, 0) + 99).toFixed(2)}</strong></p>
                </div>
                
                <button type="submit" class="btn-primary">Place Order</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('checkoutForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const shippingAddress = document.getElementById('shippingAddress').value.trim();
        const paymentMethod = document.getElementById('paymentMethod').value;
        const phoneNumber = document.getElementById('phoneNumber').value.trim();

        if (!shippingAddress || !paymentMethod || !phoneNumber) {
            showNotification('Please fill all fields', 'warning');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/orders?userId=${currentUser.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod
                })
            });

            if (response.ok) {
                const order = await response.json();
                closeModal();
                toggleCartPanel(); // Close cart panel

                showNotification(`🎉 Order Placed Successfully! Order #${order.orderNumber}`, 'success');

                // Reload cart (should be empty now)
                loadCart();

                // Redirect to orders page after a short delay
                setTimeout(() => {
                    window.location.href = 'orders.html';
                }, 1500);
            } else {
                const error = await response.text();
                showNotification(error || 'Failed to place order', 'error');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showNotification('Failed to place order', 'error');
        }
    });
}

// Update cart item quantity
async function updateCartItemQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}?userId=${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: newQuantity
            })
        });

        if (response.ok) {
            loadCart();
        }
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}

// Remove from cart
async function removeFromCart(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}?userId=${currentUser.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Removed from cart', 'success');
            loadCart();
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

// Toggle cart panel
function toggleCartPanel() {
    const cartPanel = document.querySelector('.cart-panel');
    const backdrop = document.getElementById('cartBackdrop');

    if (cartPanel && backdrop) {
        const isOpen = cartPanel.classList.contains('cart-panel-open');

        if (isOpen) {
            // Close cart
            cartPanel.classList.remove('cart-panel-open');
            backdrop.classList.remove('active');
        } else {
            // Open cart
            cartPanel.classList.add('cart-panel-open');
            backdrop.classList.add('active');
            if (currentUser) {
                loadCart();
            }
        }
    }
}

// Close cart panel when clicking backdrop
document.addEventListener('DOMContentLoaded', function () {
    const backdrop = document.getElementById('cartBackdrop');
    if (backdrop) {
        backdrop.addEventListener('click', function () {
            toggleCartPanel();
        });
    }
});

// Show login modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Login</h2>
            <form id="loginForm">
                <input type="email" id="loginEmail" placeholder="Email" required>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <button type="submit" class="btn-primary">Login</button>
                <button type="button" class="btn-ghost" onclick="showRegisterModal()">Register Instead</button>
            </form>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Show register modal
function showRegisterModal() {
    closeModal();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Register</h2>
            <form id="registerForm">
                <input type="text" id="regName" placeholder="Full Name" required>
                <input type="email" id="regEmail" placeholder="Email" required>
                <input type="password" id="regPassword" placeholder="Password" required>
                <input type="text" id="regPhone" placeholder="Phone Number">
                <textarea id="regAddress" placeholder="Address"></textarea>
                <button type="submit" class="btn-primary">Register</button>
                <button type="button" class="btn-ghost" onclick="showLoginModal()">Login Instead</button>
            </form>
            <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user || data;
            authToken = data.token || null;

            localStorage.setItem('user', JSON.stringify(currentUser));
            if (authToken) {
                localStorage.setItem('authToken', authToken);
            }

            showNotification('Login successful!', 'success');
            closeModal();
            updateUIForLoggedInUser();
            loadCart();
        } else {
            const error = await response.text();
            showNotification(error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed', 'error');
    }
}

// Handle register
async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phoneNumber = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                phoneNumber,
                address,
                role: 'CUSTOMER'
            })
        });

        if (response.ok) {
            showNotification('Registration successful! Please login.', 'success');
            closeModal();
            showLoginModal();
        } else {
            const error = await response.text();
            showNotification(error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Registration failed', 'error');
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    // Remove existing auth elements
    const existingUserInfo = navRight.querySelector('.user-info');
    const existingAuthBtn = navRight.querySelector('.auth-button');
    if (existingUserInfo) existingUserInfo.remove();
    if (existingAuthBtn) existingAuthBtn.remove();

    if (currentUser) {
        // Get user's display name
        const displayName = currentUser.name || currentUser.firstName || 'User';
        const firstName = displayName.split(' ')[0];

        // Show user info and logout
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.style.cssText = 'display: flex; align-items: center; gap: 12px;';

        // Check if user is admin
        const isAdmin = currentUser.role === 'ADMIN';

        userInfo.innerHTML = `
            ${isAdmin ? '<a href="admin.html" class="btn-admin" style="background: linear-gradient(135deg, #E74C3C, #C0392B); color: white; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; text-decoration: none; margin-right: 8px;">🛠️ Admin</a>' : ''}
            <span class="user-greeting">Hello, ${firstName}</span>
            <button class="btn-logout" onclick="logout()">Logout</button>
        `;
        navRight.insertBefore(userInfo, navRight.firstChild);
    } else {
        // Show login button
        const loginBtn = document.createElement('button');
        loginBtn.className = 'btn-login auth-button';
        loginBtn.textContent = 'Login / Register';
        loginBtn.onclick = showLoginModal;
        navRight.insertBefore(loginBtn, navRight.firstChild);
    }
}

// Call updateUIForLoggedInUser on initial load
document.addEventListener('DOMContentLoaded', function () {
    updateUIForLoggedInUser();
});

// Logout
function logout() {
    currentUser = null;
    authToken = null;
    cart = [];
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    location.reload();
}

// Show notification
function showNotification(message, type = 'info') {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show sort dropdown
function showSortDropdown() {
    // Remove existing dropdown if any
    const existingDropdown = document.querySelector('.sort-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }

    const sortDisplay = document.querySelector('.sort-display');
    if (!sortDisplay) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'sort-dropdown';
    dropdown.innerHTML = `
        <div class="sort-option ${currentSort === 'default' ? 'active' : ''}" data-sort="default">Most Popular</div>
        <div class="sort-option ${currentSort === 'price-low' ? 'active' : ''}" data-sort="price-low">Price: Low to High</div>
        <div class="sort-option ${currentSort === 'price-high' ? 'active' : ''}" data-sort="price-high">Price: High to Low</div>
        <div class="sort-option ${currentSort === 'name-asc' ? 'active' : ''}" data-sort="name-asc">Name: A to Z</div>
        <div class="sort-option ${currentSort === 'name-desc' ? 'active' : ''}" data-sort="name-desc">Name: Z to A</div>
    `;

    // Position the dropdown
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(0,0,0,0.15);
        border-radius: 12px;
        box-shadow: 0 15px 50px rgba(0,0,0,0.4);
        z-index: 9999;
        margin-top: 8px;
        min-width: 200px;
        overflow: hidden;
        backdrop-filter: blur(10px);
    `;

    // Make parent relative for positioning
    sortDisplay.style.position = 'relative';
    sortDisplay.appendChild(dropdown);

    // Add click handlers for each option
    dropdown.querySelectorAll('.sort-option').forEach(option => {
        option.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            color: #1A1F36;
            font-size: 13px;
            transition: background 0.2s;
        `;
        option.addEventListener('mouseenter', () => {
            option.style.background = 'rgba(58, 123, 255, 0.1)';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = option.classList.contains('active') ? 'rgba(58, 123, 255, 0.15)' : 'transparent';
        });
        if (option.classList.contains('active')) {
            option.style.background = 'rgba(58, 123, 255, 0.15)';
            option.style.fontWeight = '600';
        }
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const sortValue = option.getAttribute('data-sort');
            applySort(sortValue);
            dropdown.remove();
        });
    });

    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!dropdown.contains(e.target) && e.target !== sortDisplay) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 0);
}

// Apply sort to products
function applySort(sortType) {
    currentSort = sortType;

    // Update sort display text
    const sortValue = document.querySelector('.sort-value');
    if (sortValue) {
        const labels = {
            'default': 'Most Popular ▾',
            'price-low': 'Price: Low to High ▾',
            'price-high': 'Price: High to Low ▾',
            'name-asc': 'Name: A to Z ▾',
            'name-desc': 'Name: Z to A ▾'
        };
        sortValue.textContent = labels[sortType] || 'Most Popular ▾';
    }

    // Sort the products
    let sortedProducts = [...allProducts];

    switch (sortType) {
        case 'price-low':
            sortedProducts.sort((a, b) => (a.finalPrice || a.basePrice) - (b.finalPrice || b.basePrice));
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => (b.finalPrice || b.basePrice) - (a.finalPrice || a.basePrice));
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Keep original order (most popular / default)
            break;
    }

    displayProducts(sortedProducts);
    showNotification(`Sorted by: ${sortType.replace('-', ' ')}`, 'success');
}
