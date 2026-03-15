# Individual Contribution Report

## Aryan Malik
**Roll Number:** BT2024006

---

## My Role in the Project

I was responsible for the **entire frontend** of the application and **JWT integration** in JavaScript. This means I built everything the user actually sees and interacts with – from the product grid to the shopping cart, from the login modal to the admin dashboard.

I focused on connecting the frontend to the backend securely using JWT tokens.

---

## 1. Frontend Pages I Built

### Main Shopping Page (`index.html` + `style.css` + `app.js`)

This is the heart of the application – where users browse and shop.

**Features I implemented:**
- **Navigation Bar**: Logo, search input, cart icon with item count, user dropdown
- **Category Pills**: Clickable filters to show products by category
- **Product Grid**: Cards showing product image, name, price, and "Add to Cart" button
- **Cart Sidebar**: Slides in from the right showing cart items with quantity controls
- **Login/Register Modals**: Popup forms for authentication
- **Checkout Modal**: Form for shipping address and payment method selection

**The styling:**
- Dark theme with gradient backgrounds
- Glassmorphism effect on cards (translucent with backdrop blur)
- Smooth hover animations (cards lift slightly)
- Responsive design that works on mobile and desktop

### Admin Dashboard (`admin.html` + `admin.css` + `admin.js`)

A separate interface for administrators to manage the store.

**Features:**
- **Product Management**: View all products, add new ones, edit existing, delete
- **Category Management**: Create, update, delete categories
- **User Management**: View all registered users
- **Make Admin**: Promote regular users to admin role
- **Order Status**: Update order statuses (Pending → Shipped → Delivered)

### Orders Page (`orders.html` + `orders.css` + `orders.js`)

Shows the user's order history.

**Features:**
- List of all orders with order number and date
- Status badges with different colors:
  - Pending → Yellow
  - Confirmed → Blue
  - Shipped → Purple
  - Delivered → Green
  - Cancelled → Red
- Total amount for each order

### Profile Page (`profile.html` + `profile.css` + `profile.js`)

User account management.

**Features:**
- View account information (name, email, phone)
- Edit profile (name and phone can be changed)
- Change password
- Delete account

### About Page (`about.html`)

Information about the project and team.

---

## 2. JWT Integration in JavaScript

The most critical part of my frontend work was implementing secure authentication.

### Login Implementation:

When a user logs in:
1. I capture the email and password from the form
2. Send a POST request to `/api/auth/login`
3. The server returns a JWT token if credentials are valid
4. I store this token in `localStorage`
5. Update the UI to show logged-in state

```javascript
// After successful login
localStorage.setItem('token', data.token);
localStorage.setItem('userId', data.id);
localStorage.setItem('userEmail', data.email);
localStorage.setItem('userRole', data.role);
```

### Attaching Token to Requests:

For every API call that requires authentication, I attach the token:

```javascript
fetch('/api/cart', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
    }
})
```

This is how the server knows who is making the request.

### Handling Token Expiry:

If a request returns 401 Unauthorized, I:
1. Clear the stored token
2. Redirect to login modal
3. Show a "Session expired" message

---

## 3. Cart Functionality

I implemented the complete shopping cart in JavaScript.

### Add to Cart:
- When user clicks "Add to Cart", check if they're logged in
- If not logged in, show login modal instead
- Send POST request to `/api/cart/items`
- Update cart count in navbar
- Show success notification

### Update Quantity:
- Plus/minus buttons on each cart item
- Send PUT request with new quantity
- Recalculate totals
- If quantity becomes 0, item is removed

### Remove Item:
- X button to remove items
- Confirmation before deletion
- Update cart total after removal

### Cart Total:
- Calculated client-side by summing all items
- Also verified server-side to prevent tampering

---

## 4. Checkout Flow

When user clicks "Proceed to Checkout":

1. **Show checkout modal** with form for shipping address
2. **Payment method selection**: Card, UPI, COD, Net Banking
3. **Submit order**: POST to `/api/orders`
4. **On success**:
   - Show confirmation with order number
   - Clear the cart display
   - Redirect to orders page

If the cart is empty, checkout button is disabled.

---

## 5. My APIs

Based on our work distribution, I was assigned 5 APIs:

| # | API Name | Method | Endpoint |
|---|----------|--------|----------|
| 16 | Add to Cart | POST | `/api/cart/items` |
| 17 | Update Cart Quantity | PUT | `/api/cart/items/{id}` |
| 18 | Remove from Cart | DELETE | `/api/cart/items/{id}` |
| 19 | Create Order | POST | `/api/orders` |
| 20 | Get User Orders | GET | `/api/orders` |

---

## 6. Files I Created

### Frontend Files:

| File | Size | Purpose |
|------|------|---------|
| `index.html` | 8KB | Main shopping page structure |
| `style.css` | 40KB | All main page styling |
| `app.js` | 45KB | Main JavaScript logic |
| `admin.html` | 6KB | Admin dashboard structure |
| `admin.css` | 6KB | Admin styling |
| `admin.js` | 22KB | Admin functionality |
| `profile.html` | 4KB | Profile page structure |
| `profile.css` | 5KB | Profile styling |
| `profile.js` | 17KB | Profile functionality |
| `orders.html` | 4KB | Orders page structure |
| `orders.css` | 4KB | Orders styling |
| `orders.js` | 9KB | Orders functionality |
| `about.html` | 16KB | About and help page |

---

## Summary

| Category | Details |
|----------|---------|
| **HTML Pages** | 5 pages – index, admin, profile, orders, about |
| **CSS Stylesheets** | 4 files totaling ~55KB |
| **JavaScript** | 4 files totaling ~93KB with all frontend logic |
| **JWT Integration** | Token storage, attachment to requests, expiry handling |
| **APIs** | 5 endpoints for cart and orders |

---

*Report prepared by Aryan Malik (BT2024006)*
