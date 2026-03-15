# Individual Contribution Report

## Kabir Ahuja
**Roll Number:** BT2024004

---

## My Role in the Project

I was responsible for building the **Controllers and Services** for Cart, Orders, Reviews, and Users. These are four critical modules that handle the core e-commerce operations.

Additionally, I was one of the team members responsible for **Postman API testing and documentation**.

---

## 1. Cart Module – The Shopping Cart

The cart module handles adding, viewing, updating, and removing items from a user's shopping cart.

### CartController Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cart` | GET | View cart contents |
| `/api/cart/items` | POST | Add item to cart |
| `/api/cart/items/{id}` | PUT | Update item quantity |
| `/api/cart/items/{id}` | DELETE | Remove item from cart |

### CartService – The Business Logic:

**Adding to Cart:**
1. Check if the user has a cart (create if not)
2. Verify the product exists
3. Check if enough stock is available
4. If product already in cart, increase quantity
5. If new product, create new cart item
6. Recalculate cart total

**Stock Validation:**
If there are only 5 items in stock and someone tries to add 10, I return an error "Insufficient stock. Only 5 available." instead of allowing it.

**Cart Total Calculation:**
Every time the cart changes, I recalculate the total by summing (unitPrice × quantity) for each item.

---

## 2. Order Module – Processing Purchases

The order module handles the checkout process and order management.

### OrderController Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders` | POST | Create order (checkout) |
| `/api/orders` | GET | Get user's orders |
| `/api/orders/{id}` | GET | Get specific order details |
| `/api/orders/{id}/status` | PUT | Update order status (admin) |

### OrderService – The Checkout Magic:

**Creating an Order (The Most Complex Part):**
1. Fetch the user's cart
2. If cart is empty, throw error "Cart is empty"
3. Generate unique order number (ORD-YYYYMMDD-NNN)
4. For each cart item:
   - Create OrderItem with product snapshot
   - Store the price at time of purchase
   - Deduct stock from product
5. Calculate total amount
6. Create Order with shipping address and payment method
7. Clear the user's cart
8. Return order confirmation

**Why Snapshot the Price?**
If you buy an iPhone for ₹79,900 today and the price changes to ₹89,900 tomorrow, your order history should show ₹79,900 – what you actually paid.

**Order Status Flow:**
```
PENDING → CONFIRMED → SHIPPED → DELIVERED
                  ↓
             CANCELLED
```

Admin can update status, but only valid transitions are allowed.

---

## 3. Review Module – Product Reviews

The review module handles product ratings and reviews.

### ReviewController Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products/{id}/reviews` | GET | Get all reviews for a product |
| `/api/products/{id}/reviews` | POST | Add a review |
| `/api/products/{id}/reviews/average` | GET | Get average rating |

### ReviewService Logic:

**Adding a Review:**
1. Check if user already reviewed this product
   - If yes, return error "You have already reviewed this product"
2. Verify product exists
3. Validate rating is between 1 and 5
4. Save review with timestamp
5. Return the saved review

**Calculating Average:**
I use a database query to calculate the average:
```sql
SELECT AVG(rating) FROM reviews WHERE product_id = ?
```

This is much faster than loading all reviews into Java and calculating there.

---

## 4. User Module – Profile Management

The user module handles profile viewing and editing.

### UserController Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/me` | GET | Get current user's profile |
| `/api/users/me` | PUT | Update profile |
| `/api/users` | GET | Get all users (admin) |
| `/api/users/{id}/password` | PUT | Change password |
| `/api/users/{id}` | DELETE | Delete account |

### UserService Logic:

**Changing Password:**
1. Verify old password is correct (using BCrypt)
2. If wrong, return error "Current password is incorrect"
3. Encrypt new password
4. Save to database
5. Return success message

**Deleting Account:**
1. Delete user's cart and cart items
2. Delete user's reviews
3. For orders, I keep them for records but remove user reference
4. Delete the user

---

## 5. Postman API Testing & Documentation

I was one of the team members responsible for testing all APIs using Postman.

**My testing approach:**
- Created request examples for each endpoint
- Added sample request bodies in JSON format
- Documented expected responses (success and error cases)
- Tested edge cases like empty carts, out of stock, etc.

**Test scenarios I covered:**
- Cart operations with valid and invalid product IDs
- Checkout with empty cart (should fail)
- Duplicate reviews (should fail)
- Password change with wrong current password
- Order status transitions

---

## 6. My APIs

Based on our work distribution, I was assigned 5 APIs:

| # | API Name | Method | Endpoint |
|---|----------|--------|----------|
| 21 | Get Order by ID | GET | `/api/orders/{id}` |
| 22 | Update Order Status | PUT | `/api/orders/{id}/status` |
| 23 | Get Product Reviews | GET | `/api/products/{id}/reviews` |
| 24 | Add Review | POST | `/api/products/{id}/reviews` |
| 25 | Get Average Rating | GET | `/api/products/{id}/reviews/average` |

---

## 7. How These Modules Connect

The flow from browsing to reviewing:

```
User browses products
        ↓
Adds items to Cart (CartController → CartService)
        ↓
Clicks Checkout
        ↓
Order created (OrderController → OrderService)
  - Cart items → Order items
  - Stock deducted
  - Cart cleared
        ↓
User receives product
        ↓
Writes review (ReviewController → ReviewService)
        ↓
Other users see reviews and average rating
```

---

## Summary

| Module | Controller | Service | Key Features |
|--------|------------|---------|--------------|
| **Cart** | CartController | CartService | Add, update, remove items, stock validation |
| **Order** | OrderController | OrderService | Checkout, status tracking, price snapshots |
| **Review** | ReviewController | ReviewService | Ratings 1-5, duplicate prevention, averages |
| **User** | UserController | UserService | Profile CRUD, password change, account deletion |

---

*Report prepared by Kabir Ahuja (BT2024004)*
