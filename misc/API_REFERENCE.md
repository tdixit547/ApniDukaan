# 📮 API Reference - Complete Postman Guide

> **Total APIs: 28 endpoints across 7 sections**

---

## 📊 API Summary

| Section | Endpoints | Description |
|---------|-----------|-------------|
| 🔐 Authentication | 2 | Register, Login |
| 🏷️ Categories | 5 | CRUD operations |
| 📦 Products | 7 | CRUD + Search + Filter |
| 🛒 Shopping Cart | 4 | Add, View, Update, Remove |
| 📋 Orders | 4 | Create, View, Status |
| ⭐ Reviews | 3 | Add, View, Ratings |
| 👤 Users | 5 | Profile, Password, Delete |

---

# 🔐 Authentication (2 APIs)

---

## 1. Register New User

```
POST http://localhost:8080/api/auth/register
```

**Request Body:**
```json
{
  "email": "raj.sharma@gmail.com",
  "password": "password123",
  "firstName": "Raj",
  "lastName": "Sharma",
  "phone": "9876543210"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "email": "raj.sharma@gmail.com",
  "firstName": "Raj",
  "lastName": "Sharma",
  "phone": "9876543210",
  "role": "CUSTOMER",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## 2. Login User

```
POST http://localhost:8080/api/auth/login
```

**Request Body:**
```json
{
  "email": "raj.sharma@gmail.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "email": "raj.sharma@gmail.com",
  "firstName": "Raj",
  "lastName": "Sharma",
  "role": "CUSTOMER",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

# 🏷️ Categories (5 APIs)

---

## 3. Get All Categories

```
GET http://localhost:8080/api/categories
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics",
    "description": "Mobile phones, laptops, and gadgets"
  },
  {
    "id": 2,
    "name": "Fashion",
    "slug": "fashion",
    "description": "Clothing and accessories"
  }
]
```

---

## 4. Create Category (Admin)

```
POST http://localhost:8080/api/categories
```

**Request Body:**
```json
{
  "name": "Electronics",
  "description": "Mobile phones, laptops, and electronic gadgets"
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "name": "Electronics",
  "slug": "electronics",
  "description": "Mobile phones, laptops, and electronic gadgets"
}
```

---

## 5. Get Category by ID

```
GET http://localhost:8080/api/categories/1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Electronics",
  "slug": "electronics",
  "description": "Mobile phones, laptops, and electronic gadgets"
}
```

---

## 6. Update Category (Admin)

```
PUT http://localhost:8080/api/categories/1
```

**Request Body:**
```json
{
  "name": "Electronics & Gadgets",
  "description": "Updated description"
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Electronics & Gadgets",
  "slug": "electronics-gadgets",
  "description": "Updated description"
}
```

---

## 7. Delete Category (Admin)

```
DELETE http://localhost:8080/api/categories/1
```

**Expected Response (200 OK):**
```
Category deleted successfully
```

---

# 📦 Products (7 APIs)

---

## 8. Get All Products (Paginated)

```
GET http://localhost:8080/api/products?page=0&size=10
```

**Expected Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "iPhone 14 128GB",
      "description": "Apple iPhone 14",
      "basePrice": 79900.00,
      "tax": 18.00,
      "discount": 5.00,
      "finalPrice": 89431.95,
      "stock": 25,
      "categoryId": 1,
      "categoryName": "Electronics",
      "imageUrl": "/photos/iphone.jpeg"
    }
  ],
  "totalElements": 15,
  "totalPages": 2,
  "number": 0,
  "size": 10
}
```

---

## 9. Get Product by ID

```
GET http://localhost:8080/api/products/1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "iPhone 14 128GB",
  "description": "Apple iPhone 14 with A15 Bionic chip",
  "sku": "IPHONE14-128",
  "basePrice": 79900.00,
  "tax": 18.00,
  "discount": 5.00,
  "finalPrice": 89431.95,
  "stock": 25,
  "stockQuantity": 25,
  "categoryId": 1,
  "categoryName": "Electronics",
  "imageUrl": "/photos/iphone.jpeg"
}
```

---

## 10. Create Product (Admin)

```
POST http://localhost:8080/api/products
```

**Request Body:**
```json
{
  "name": "iPhone 14 128GB",
  "description": "Apple iPhone 14 with A15 Bionic chip",
  "sku": "IPHONE14-128",
  "basePrice": 79900,
  "tax": 18,
  "discount": 5,
  "stock": 25,
  "categoryId": 1
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "name": "iPhone 14 128GB",
  "basePrice": 79900.00,
  "finalPrice": 89431.95,
  "stock": 25,
  "categoryName": "Electronics"
}
```

---

## 11. Update Product (Admin)

```
PUT http://localhost:8080/api/products/1
```

**Request Body:**
```json
{
  "name": "iPhone 14 128GB - Updated",
  "basePrice": 74900,
  "stock": 30
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "iPhone 14 128GB - Updated",
  "basePrice": 74900.00,
  "finalPrice": 83786.95,
  "stock": 30
}
```

---

## 12. Delete Product (Admin)

```
DELETE http://localhost:8080/api/products/1
```

**Expected Response (200 OK):**
```
Product deleted successfully
```

---

## 13. Search Products

```
GET http://localhost:8080/api/products/search?query=iPhone
```

**Expected Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "iPhone 14 128GB",
      "finalPrice": 89431.95,
      "stock": 25
    }
  ],
  "totalElements": 1
}
```

---

## 14. Get Products by Category

```
GET http://localhost:8080/api/products/category/1
```

**Expected Response (200 OK):**
```json
{
  "content": [
    {"id": 1, "name": "iPhone 14 128GB", "categoryName": "Electronics"},
    {"id": 2, "name": "Samsung Galaxy M33", "categoryName": "Electronics"},
    {"id": 3, "name": "Dell Laptop", "categoryName": "Electronics"}
  ]
}
```

---

# 🛒 Shopping Cart (4 APIs)

---

## 15. View Cart

```
GET http://localhost:8080/api/cart?userId=1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "iPhone 14 128GB",
      "quantity": 2,
      "unitPrice": 89431.95,
      "totalPrice": 178863.90
    }
  ],
  "totalAmount": 178863.90,
  "itemCount": 2
}
```

---

## 16. Add Item to Cart

```
POST http://localhost:8080/api/cart/items?userId=1
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "productId": 1,
  "productName": "iPhone 14 128GB",
  "quantity": 2,
  "unitPrice": 89431.95
}
```

---

## 17. Update Cart Item Quantity

```
PUT http://localhost:8080/api/cart/items/1?userId=1
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "productId": 1,
  "productName": "iPhone 14 128GB",
  "quantity": 3,
  "unitPrice": 89431.95
}
```

---

## 18. Remove Item from Cart

```
DELETE http://localhost:8080/api/cart/items/1?userId=1
```

**Expected Response (200 OK):**
```
Item removed from cart
```

---

# 📋 Orders (4 APIs)

---

## 19. Create Order (Checkout)

```
POST http://localhost:8080/api/orders?userId=1
```

**Request Body:**
```json
{
  "shippingAddress": "Flat 302, MG Road, Pune - 411001",
  "paymentMethod": "CARD"
}
```

**Payment Methods:** `CARD`, `UPI`, `COD`, `NET_BANKING`

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "orderNumber": "ORD-20241210-001",
  "userId": 1,
  "status": "PENDING",
  "totalAmount": 178962.90,
  "shippingAddress": "Flat 302, MG Road, Pune - 411001",
  "paymentMethod": "CARD",
  "paymentStatus": "PENDING",
  "items": [
    {
      "productName": "iPhone 14 128GB",
      "quantity": 2,
      "unitPrice": 89431.95,
      "subtotal": 178863.90
    }
  ],
  "createdAt": "2024-12-10T10:00:00"
}
```

---

## 20. Get User Orders

```
GET http://localhost:8080/api/orders?userId=1
```

**Expected Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "orderNumber": "ORD-20241210-001",
      "status": "PENDING",
      "totalAmount": 178962.90,
      "createdAt": "2024-12-10T10:00:00"
    }
  ]
}
```

---

## 21. Get Order by ID

```
GET http://localhost:8080/api/orders/1?userId=1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "orderNumber": "ORD-20241210-001",
  "status": "PENDING",
  "totalAmount": 178962.90,
  "shippingAddress": "Flat 302, MG Road, Pune - 411001",
  "paymentMethod": "CARD",
  "paymentStatus": "PENDING",
  "items": [...],
  "createdAt": "2024-12-10T10:00:00"
}
```

---

## 22. Update Order Status (Admin)

```
PUT http://localhost:8080/api/orders/1/status
```

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

**Statuses:** `PENDING` → `CONFIRMED` → `SHIPPED` → `DELIVERED` / `CANCELLED`

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "orderNumber": "ORD-20241210-001",
  "status": "SHIPPED",
  "totalAmount": 178962.90
}
```

---

# ⭐ Reviews (3 APIs)

---

## 23. Get Product Reviews

```
GET http://localhost:8080/api/products/1/reviews
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "userId": 2,
    "userName": "Priya Patel",
    "rating": 5,
    "comment": "Excellent phone! Camera is amazing!",
    "createdAt": "2024-12-09T15:30:00"
  }
]
```

---

## 24. Add Review

```
POST http://localhost:8080/api/products/1/reviews?userId=1
```

**Request Body:**
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Amazing product! Highly recommended."
}
```

**Rating:** 1-5 stars

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "productId": 1,
  "userId": 1,
  "rating": 5,
  "comment": "Amazing product! Highly recommended.",
  "createdAt": "2024-12-10T10:15:00"
}
```

---

## 25. Get Average Rating

```
GET http://localhost:8080/api/products/1/reviews/average
```

**Expected Response (200 OK):**
```json
4.5
```

---

# 👤 Users (5 APIs)

---

## 26. Get User Profile

```
GET http://localhost:8080/api/users/me?userId=1
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "email": "raj.sharma@gmail.com",
  "firstName": "Raj",
  "lastName": "Sharma",
  "phone": "9876543210",
  "role": "CUSTOMER"
}
```

---

## 27. Update Profile

```
PUT http://localhost:8080/api/users/me?userId=1
```

**Request Body:**
```json
{
  "firstName": "Raj",
  "lastName": "Sharma",
  "phone": "9876543210"
}
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "email": "raj.sharma@gmail.com",
  "firstName": "Raj",
  "lastName": "Sharma",
  "phone": "9876543210"
}
```

---

## 28. Get All Users (Admin)

```
GET http://localhost:8080/api/users
```

**Expected Response (200 OK):**
```json
[
  {"id": 1, "email": "raj@gmail.com", "firstName": "Raj", "role": "CUSTOMER"},
  {"id": 2, "email": "priya@gmail.com", "firstName": "Priya", "role": "CUSTOMER"},
  {"id": 5, "email": "admin@ecommerce.com", "firstName": "Admin", "role": "ADMIN"}
]
```

---

## 29. Change Password

```
PUT http://localhost:8080/api/users/1/password
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Expected Response (200 OK):**
```
Password changed successfully
```

---

## 30. Delete User

```
DELETE http://localhost:8080/api/users/1
```

**Expected Response (200 OK):**
```
User deleted successfully
```

---

# 📊 Response Codes

| Code | Meaning | When |
|------|---------|------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Missing body or validation error |
| `401` | Unauthorized | Invalid/missing token |
| `403` | Forbidden | Admin-only endpoint |
| `404` | Not Found | Resource doesn't exist |

---

# 💡 Postman Tips

1. **For POST/PUT requests:**
   - Go to **Body** tab
   - Select **raw**
   - Choose **JSON** from dropdown
   - Paste the JSON body

2. **Replace placeholders:**
   - `userId=1` → Use actual user ID from registration
   - `/products/1` → Use actual product ID

3. **Test Flow:**
   1. Register a user (get userId)
   2. Create categories
   3. Create products
   4. Add to cart
   5. Checkout (create order)
   6. Add reviews

---

**Total: 30 API Endpoints** 🚀
