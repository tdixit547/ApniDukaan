# Individual Contribution Report

## Tanmay Dixit
**Roll Number:** BT2024016

---

## My Role in the Project

I was responsible for creating all **DTOs (Data Transfer Objects)**, **Mappers**, and setting up **MySQL sample data**. Additionally, I was one of the team members responsible for **Postman API testing**.

Let me explain what these components are and why they matter.

---

## 1. What are DTOs and Why Do We Need Them?

DTOs are simple classes that define what data goes in and out of our APIs. They act as a contract between the frontend and backend.

### The Problem Without DTOs:

Imagine returning our User entity directly:
```json
{
  "id": 1,
  "email": "user@email.com",
  "passwordHash": "$2a$10$...",   // Exposed!
  "firstName": "Raj",
  "createdAt": "2024-12-10"
}
```

The password hash is exposed! Even though it's encrypted, this is a security risk.

### The Solution – DTOs:

With a UserDTO, I control exactly what gets returned:
```json
{
  "id": 1,
  "email": "user@email.com",
  "firstName": "Raj",
  "lastName": "Sharma"
}
```

No password. No internal timestamps. Just what the frontend needs.

---

## 2. DTOs I Created

I organized DTOs into packages by domain:

### Authentication DTOs (`dto/auth/`)

**LoginRequest** – What the user sends to login:
- `email` (required, must be valid email format)
- `password` (required)

**RegisterRequest** – What the user sends to register:
- `email` (required, valid email format)
- `password` (required, minimum 6 characters)
- `firstName` (required)
- `lastName` (required)
- `phone` (10 digits)

**AuthResponse** – What the server returns after login/register:
- User details (id, email, firstName, lastName, phone, role)
- JWT token for future requests

### Product DTOs (`dto/product/`)

**ProductDTO** – Product information for display:
- All product details
- Calculated `finalPrice`
- `categoryName` (so frontend doesn't need extra API call)

**CreateProductRequest** – Admin creating a product:
- name, description, sku (required)
- basePrice (required, must be positive)
- tax (default 18%)
- discount (default 0%)
- stock, categoryId, imageUrl

**UpdateProductRequest** – Admin updating a product:
- All fields optional (only send what you're changing)

### Order DTOs (`dto/order/`)

**CreateOrderRequest** – Checking out:
- `shippingAddress` (required)
- `paymentMethod` (CARD, UPI, COD, NET_BANKING)

**OrderDTO** – Complete order information:
- Order number, status, total amount
- Shipping address, payment method, payment status
- List of OrderItemDTOs
- Timestamps

**OrderItemDTO** – Individual items in an order:
- Product name, quantity, unit price, subtotal

**UpdateStatusRequest** – Admin updating order status:
- `status` (new status to set)

### Cart DTOs (`dto/cart/`)

**CartDTO** – Shopping cart information:
- List of CartItemDTOs
- Total amount
- Item count

**CartItemDTO** – Items in cart:
- Product info (id, name, image)
- Quantity
- Unit price

**AddToCartRequest** – Adding item:
- `productId` (required)
- `quantity` (default 1)

**UpdateCartRequest** – Changing quantity:
- `quantity` (new quantity)

### Review DTOs (`dto/review/`)

**CreateReviewRequest** – Writing a review:
- `rating` (1 to 5)
- `comment` (optional)

**ReviewDTO** – Review for display:
- Rating, comment
- User name (who wrote it)
- Created timestamp

### User DTOs (`dto/user/`)

**UserDTO** – User profile information:
- id, email, firstName, lastName, phone, role

**UpdateProfileRequest** – Editing profile:
- firstName, lastName, phone (all optional)

---

## 3. Validation Annotations

I added validation rules to prevent bad data:

| Annotation | Meaning | Example Use |
|------------|---------|-------------|
| `@NotBlank` | Cannot be empty or whitespace | Email, password, name |
| `@Email` | Must be valid email format | Email field |
| `@Size(min=6)` | Minimum length | Password |
| `@Min(1)`, `@Max(5)` | Number range | Rating (1-5) |
| `@Pattern` | Must match regex | Phone (10 digits) |
| `@Positive` | Must be > 0 | Price |
| `@PositiveOrZero` | Must be >= 0 | Discount, stock |

When validation fails, the API returns helpful error messages like:
- "Email is required"
- "Password must be at least 6 characters"
- "Rating must be between 1 and 5"

---

## 4. Mappers – Converting Between Entities and DTOs

Mappers handle the conversion between database entities and API DTOs.

### Example: Product → ProductDTO

Product entity has a nested Category object:
```java
Product {
    name: "iPhone 14"
    category: Category { id: 1, name: "Electronics" }
}
```

But ProductDTO needs flat fields:
```java
ProductDTO {
    name: "iPhone 14"
    categoryId: 1
    categoryName: "Electronics"
}
```

My ProductMapper handles this conversion.

### Mappers I Created:

| Mapper | Converts |
|--------|----------|
| **ProductMapper** | Product ↔ ProductDTO |
| **CategoryMapper** | Category ↔ CategoryDTO |
| **OrderMapper** | Order ↔ OrderDTO (including OrderItems) |
| **CartMapper** | Cart ↔ CartDTO (including CartItems) |
| **ReviewMapper** | Review ↔ ReviewDTO (includes user name) |
| **UserMapper** | User ↔ UserDTO |

---

## 5. MySQL Sample Data

I populated the database with realistic test data.

### Sample Users (5):
| Email | Role | Purpose |
|-------|------|---------|
| raj.sharma@gmail.com | CUSTOMER | Test customer |
| priya.patel@gmail.com | CUSTOMER | Test customer |
| amit.kumar@gmail.com | CUSTOMER | Test customer |
| sneha.singh@gmail.com | CUSTOMER | Test customer |
| admin@ecommerce.com | ADMIN | Test admin |

Password for all: `password123`

### Sample Categories (5):
- Electronics
- Fashion
- Home & Kitchen
- Books
- Sports & Fitness

### Sample Products (10):
Products with Indian pricing (INR), realistic tax rates, and varied discounts.

### Sample Orders, Reviews:
- 3 orders with different statuses
- 5 reviews with ratings and comments

---

## 6. Postman API Testing

I was one of the team members responsible for testing the APIs using Postman.

**My testing covered:**
- All product and category endpoints
- Validation error scenarios
- Edge cases like empty responses

---

## 7. My APIs

Based on our work distribution, I was assigned 5 APIs:

| # | API Name | Method | Endpoint |
|---|----------|--------|----------|
| 6 | Update Category | PUT | `/api/categories/{id}` |
| 7 | Delete Category | DELETE | `/api/categories/{id}` |
| 9 | Get Product by ID | GET | `/api/products/{id}` |
| 12 | Delete Product | DELETE | `/api/products/{id}` |
| 14 | Products by Category | GET | `/api/products/category/{id}` |

---

## 8. Why DTOs and Mappers Matter

**Without DTOs:**
- Passwords might leak to frontend
- No validation, bad data enters database
- Frontend and backend tightly coupled
- Any entity change breaks the API

**With DTOs:**
- Clean separation of concerns
- Data validated before processing
- Easy to change what API returns
- Sensitive data stays hidden
- API contract is explicit

---

## Summary

| Component | Count | Details |
|-----------|-------|---------|
| Auth DTOs | 3 files | LoginRequest, RegisterRequest, AuthResponse |
| Product DTOs | 3 files | ProductDTO, CreateProductRequest, UpdateProductRequest |
| Order DTOs | 4 files | OrderDTO, OrderItemDTO, CreateOrderRequest, UpdateStatusRequest |
| Cart DTOs | 4 files | CartDTO, CartItemDTO, AddToCartRequest, UpdateCartRequest |
| Review DTOs | 2 files | ReviewDTO, CreateReviewRequest |
| User DTOs | 2 files | UserDTO, UpdateProfileRequest |
| Mappers | 6 files | One for each domain |
| Sample Data | SQL | Users, categories, products, orders, reviews |
| **Total** | 24+ files | DTOs, Mappers, and SQL scripts |

---

*Report prepared by Tanmay Dixit (BT2024016)*
