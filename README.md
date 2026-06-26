<div align="center">

# ApniDukaan

### *Your Store. Your Way.*

**A production-grade full-stack e-commerce platform** built with Spring Boot, MySQL & Vanilla JavaScript — featuring JWT authentication, role-based access control, real-time cart management, order processing with concurrency-safe stock locking, and a fully functional admin dashboard.

<br/>

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6.x-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![JWT](https://img.shields.io/badge/JWT-JJWT_0.11.5-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://github.com/jwtk/jjwt)
[![Hibernate](https://img.shields.io/badge/Hibernate-JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white)](https://hibernate.org/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

[Quick Start](#quick-start) • [API Docs](#api-reference) • [Architecture](#architecture) • [Team](#team)

</div>

---

## About The Project

**ApniDukaan** (meaning *"Your Store"* in Hindi) is a complete e-commerce solution developed as a college project by Team Cold Blooded. It demonstrates enterprise-level software engineering practices including:

- **Stateless REST API** secured with JSON Web Tokens
- **Role-Based Access Control** (Customer vs Admin) enforced at the security filter level
- **Pessimistic Database Locking** on product stock to prevent race conditions during concurrent checkouts
- **Layered Architecture** with clean separation: Controllers -> Services -> Repositories -> Entities
- **Global Exception Handling** with structured JSON error responses across all endpoints
- **Data Integrity** via snapshots of product price/name stored in orders (so history is preserved even if products change)

---

## Feature Showcase

<details open>
<summary><strong>Customer Experience</strong></summary>

| Feature | Details |
|---------|---------|
| **Authentication** | Register with name, email, phone & password. Login returns a signed JWT token valid for configurable duration |
| **Product Browsing** | Paginated product listing, category-based filtering, full-text keyword search |
| **Product Details** | View price (with tax & discount applied via `getFinalPrice()`), stock status, category, and star ratings |
| **Shopping Cart** | Add items with stock validation, update quantities, remove items. Cart persists in DB per user |
| **Checkout & Orders** | Place orders from cart contents. Stock is deducted using pessimistic locking. Orders get a unique order number |
| **Order History** | View all past orders with items, prices, status (Placed -> Confirmed -> Shipped -> Delivered) |
| **Reviews & Ratings** | Leave one review per product (1-5 stars + comment). View average ratings |
| **Profile Management** | Update first name, last name, phone. Change password with current-password verification via BCrypt |

</details>

<details>
<summary><strong>Admin Dashboard</strong></summary>

| Feature | Details |
|---------|---------|
| **Product Management** | Full CRUD — create products with base price, tax %, discount %, stock, category and image URL |
| **Category Management** | Create/update/delete categories. Auto-generates URL-friendly slugs |
| **Order Management** | View all orders system-wide. Update order status through the fulfillment pipeline |
| **User Management** | View all registered users, their roles and account details |
| **Sales Overview** | Dashboard with order counts and revenue breakdown |

</details>

<details>
<summary><strong>Security Architecture</strong></summary>

| Layer | Implementation |
|-------|---------------|
| **Password Storage** | BCrypt hashing with salt (via `PasswordConfig` bean) |
| **Token Generation** | HMAC-SHA256 signed JWTs with configurable expiry (via `JwtTokenProvider`) |
| **Request Filtering** | `JwtAuthenticationFilter` intercepts every request, validates token, loads `UserDetails` |
| **Endpoint Security** | `/api/auth/**` and `/api/products/**` are public. All other `/api/**` routes require a valid JWT |
| **Role Enforcement** | Admin-only routes checked via `hasRole('ADMIN')` in `SecurityConfig` |
| **Concurrency Safety** | `@Lock(PESSIMISTIC_WRITE)` on `ProductRepository.findByIdForUpdate()` prevents overselling |

</details>

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│                                                                      │
│   ┌─────────────┐  ┌─────────────┐  ┌──────────┐  ┌─────────────┐  │
│   │  index.html │  │  admin.html │  │orders.html│  │ profile.html│  │
│   │  (Shop)     │  │ (Dashboard) │  │           │  │             │  │
│   └──────┬──────┘  └──────┬──────┘  └─────┬────┘  └──────┬──────┘  │
│          │  Vanilla JS (app.js, admin.js, orders.js, profile.js)    │
└──────────┼────────────────────────────────────────────────┼─────────┘
           │            HTTP / REST API (JSON)               │
           ▼                                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      SPRING BOOT BACKEND  :8081                      │
│                                                                      │
│   ┌───────────────────────────────────────────────────────────────┐  │
│   │                   Security Filter Chain                       │  │
│   │   JwtAuthenticationFilter -> validates token -> sets context   │  │
│   └───────────────────────────┬───────────────────────────────────┘  │
│                               │                                      │
│   ┌─────────┬──────────┬──────┴──┬──────────┬──────────┬──────────┐ │
│   │  Auth   │ Product  │  Cart   │  Order   │  Review  │   User   │ │
│   │  Ctrl   │  Ctrl    │  Ctrl   │  Ctrl    │  Ctrl    │   Ctrl   │ │
│   └────┬────┴─────┬────┴────┬────┴─────┬────┴─────┬────┴────┬─────┘ │
│        │          │         │          │          │         │        │
│   ┌────▼──────────▼─────────▼──────────▼──────────▼─────────▼─────┐ │
│   │                      SERVICE LAYER                             │ │
│   │  AuthService │ ProductService │ CartService │ OrderService     │ │
│   │  CategoryService │ ReviewService │ UserService │ ImageService  │ │
│   └────────────────────────────┬───────────────────────────────────┘ │
│                                │                                      │
│   ┌────────────────────────────▼───────────────────────────────────┐ │
│   │               SPRING DATA JPA REPOSITORIES                     │ │
│   │  UserRepo │ ProductRepo │ CartRepo │ OrderRepo │ ReviewRepo    │ │
│   └────────────────────────────┬───────────────────────────────────┘ │
└────────────────────────────────┼─────────────────────────────────────┘
                                 │  JDBC / Hibernate ORM
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        MySQL DATABASE  :3306                         │
│                                                                      │
│   users │ products │ categories │ carts │ cart_items │              │
│   orders │ order_items │ reviews                                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

```
users                           products
─────────────────────           ──────────────────────────────
id (PK)                         id (PK)
first_name, last_name           name, description
email (UNIQUE)                  base_price, tax, discount
final_price (computed)          final_price (computed)
password_hash (BCrypt)          stock
phone                           image_url
role (CUSTOMER|ADMIN)           category_id (FK -> categories)
created_at, updated_at          created_at, updated_at

categories                      reviews
──────────────────              ──────────────────────────────
id (PK)                         id (PK)
name (UNIQUE)                   product_id (FK -> products)
slug (UNIQUE)                   user_id    (FK -> users)
description                     rating (1-5)
                                comment
                                created_at

carts ──── cart_items           orders ──── order_items
─────────  ───────────────      ──────────  ─────────────────────────
id (PK)    id (PK)              id (PK)     id (PK)
user_id    cart_id (FK)         user_id     order_id (FK)
           product_id (FK)      order_number product_id (snapshot)
           quantity             status       product_name (snapshot)
           unit_price           payment_*    unit_price (snapshot)
                                total_amount quantity, subtotal
                                address
```

> **Design Note:** `order_items` stores **snapshots** of product name and price at time of purchase. This ensures order history is preserved accurately even if a product is later renamed, repriced, or deleted.

---

## Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Language | Java | 21 | Core backend language |
| Framework | Spring Boot | 3.3.5 | Application framework & auto-configuration |
| Web | Spring MVC | 6.x | REST controllers and request mapping |
| Security | Spring Security | 6.x | Authentication & authorization filter chain |
| Tokens | JJWT (jwtk) | 0.11.5 | JWT creation, signing, and validation |
| ORM | Spring Data JPA + Hibernate | 3.x | Database abstraction and query generation |
| Database | MySQL | 8.0 | Persistent relational data store |
| Password | BCryptPasswordEncoder | - | Salted password hashing |
| Build | Apache Maven | 3.9.x | Dependency management and build lifecycle |
| Frontend | HTML5 + CSS3 + Vanilla JS | ES6+ | No-framework lightweight UI |
| Testing | JUnit 5 + Spring Test | - | Unit and integration tests |
| API Testing | Postman | - | Manual API exploration and testing |

---

## Quick Start

### Prerequisites

Make sure you have the following installed:

```
- Java 21+       ->  java -version
- MySQL 8.0+     ->  mysql --version
- Maven 3.8+     ->  mvn -version   (or use included ./mvnw)
```

### Step 1 - Clone the Repository

```bash
git clone https://github.com/tdixit547/ApniDukaan.git
cd ApniDukaan
```

### Step 2 - Create the Database

Log into MySQL and run:

```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3 - Configure the Application

Edit `backend/src/main/resources/application.properties`:

```properties
# Database - update these for your MySQL setup
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT Secret - change this to any long random string in production
app.jwt.secret=your-super-secret-key-change-this-in-production-min-256-bits
app.jwt.expirationMs=86400000
```

### Step 4 - Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

> On Windows: `.\mvnw.cmd spring-boot:run`

Watch the startup logs - you'll see:
```
Started PrototypeApplication in 3.2 seconds
DataSeeder: Seeding 5 categories and 15 products...
DataSeeder: Sample data loaded successfully!
```

### Step 5 - Open the App

Open your browser and visit:

```
http://localhost:8081
```

The Spring Boot backend serves the frontend as static resources. You'll see the full shop UI immediately.

**Default Admin Account** (seeded automatically):
```
Email:    admin@apnidukaan.com
Password: admin123
```

---

## API Reference

All API endpoints are prefixed with `/api`. Protected routes require:
```
Authorization: Bearer <your-jwt-token>
```

### Authentication

<details>
<summary><strong>POST /api/auth/register</strong> - Register a new user</summary>

**Request Body:**
```json
{
  "firstName": "Tanmay",
  "lastName": "Dixit",
  "email": "tanmay@example.com",
  "password": "securepassword",
  "phone": "9876543210"
}
```

**Response 201 Created:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresAt": "2026-03-19T12:00:00Z",
  "user": {
    "id": 1,
    "email": "tanmay@example.com",
    "firstName": "Tanmay",
    "role": "CUSTOMER"
  }
}
```
</details>

<details>
<summary><strong>POST /api/auth/login</strong> - Login and get JWT</summary>

**Request Body:**
```json
{
  "email": "tanmay@example.com",
  "password": "securepassword"
}
```

**Response 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresAt": "2026-03-19T12:00:00Z",
  "user": { ... }
}
```
</details>

---

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products?page=0&size=12` | Public | Paginated product list |
| GET | `/api/products/{id}` | Public | Single product details |
| GET | `/api/products/search?query=laptop` | Public | Keyword search |
| GET | `/api/products/category/{categoryId}` | Public | Filter by category |
| GET | `/api/products/featured` | Public | Featured/discounted products |
| POST | `/api/products` | Admin | Create new product |
| PUT | `/api/products/{id}` | Admin | Update product details |
| DELETE | `/api/products/{id}` | Admin | Delete product |

**Sample Product Response:**
```json
{
  "id": 5,
  "name": "Apple MacBook Pro 14\"",
  "description": "M3 chip, 16GB RAM, 512GB SSD",
  "basePrice": 159999.00,
  "tax": 18.0,
  "discount": 5.0,
  "finalPrice": 179518.82,
  "stock": 12,
  "imageUrl": "/photos/macbook.jpeg",
  "category": { "id": 1, "name": "Electronics", "slug": "electronics" },
  "averageRating": 4.7,
  "reviewCount": 23
}
```

---

### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Public | All categories |
| GET | `/api/categories/{id}` | Public | Single category |
| GET | `/api/categories/slug/{slug}` | Public | Lookup by URL slug |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/{id}` | Admin | Update category |
| DELETE | `/api/categories/{id}` | Admin | Delete category |

---

### Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart?userId={id}` | Bearer | Get user's cart with totals |
| POST | `/api/cart/items?userId={id}` | Bearer | Add product to cart |
| PUT | `/api/cart/items/{itemId}?userId={id}` | Bearer | Update item quantity |
| DELETE | `/api/cart/items/{itemId}?userId={id}` | Bearer | Remove item from cart |
| DELETE | `/api/cart/clear?userId={id}` | Bearer | Empty the cart |

**Add to Cart Request:**
```json
{
  "productId": 5,
  "quantity": 2
}
```

---

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders?userId={id}` | Bearer | Place order from cart |
| GET | `/api/orders?userId={id}` | Bearer | User's order history |
| GET | `/api/orders/{id}?userId={id}` | Bearer | Order details with items |
| GET | `/api/orders/all` | Admin | All orders in system |
| PUT | `/api/orders/{id}/status` | Admin | Update fulfillment status |

**Place Order Request:**
```json
{
  "shippingAddress": "42, MG Road, Bangalore, Karnataka - 560001",
  "paymentMethod": "UPI"
}
```

**Order Status Flow:**
```
PLACED -> CONFIRMED -> SHIPPED -> DELIVERED
                \
                 -> CANCELLED
```

---

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/{id}/reviews` | Public | All reviews for a product |
| GET | `/api/products/{id}/reviews/average` | Public | Average star rating |
| POST | `/api/products/{id}/reviews?userId={id}` | Bearer | Submit review (1 per user) |
| DELETE | `/api/products/{id}/reviews/{reviewId}` | Admin | Delete inappropriate review |

---

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/me?userId={id}` | Bearer | Get own profile |
| PUT | `/api/users/me?userId={id}` | Bearer | Update profile (name, phone) |
| PUT | `/api/users/{id}/password` | Bearer | Change password |
| GET | `/api/users` | Admin | All registered users |
| DELETE | `/api/users/{id}` | Admin | Delete user account |

---

### Error Responses

All errors return a consistent JSON structure:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: '99'",
  "timestamp": "2026-03-18T10:30:00Z"
}
```

| HTTP Code | Meaning |
|-----------|---------|
| 400 | Bad request / validation error |
| 401 | Missing or invalid JWT token |
| 403 | Insufficient role (e.g. customer accessing admin route) |
| 404 | Resource not found |
| 409 | Conflict (e.g. insufficient stock, duplicate review) |
| 500 | Internal server error |

---

## Project Structure

```
ApniDukaan/
│
├── backend/                              # Spring Boot application
│   ├── pom.xml                              # Maven dependencies
│   ├── mvnw / mvnw.cmd                      # Maven wrapper scripts
│   └── src/
│       ├── main/
│       │   ├── java/coldblooded/project/prototype/
│       │   │   ├── PrototypeApplication.java        # Entry point
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java          # Filter chain & auth rules
│       │   │   │   ├── JwtProperties.java           # JWT config properties
│       │   │   │   ├── PasswordConfig.java          # BCrypt bean
│       │   │   │   ├── WebConfig.java               # CORS configuration
│       │   │   │   └── DataSeeder.java              # Sample data on startup
│       │   │   ├── controller/                      # 7 REST controllers
│       │   │   ├── service/                         # 8 business logic services
│       │   │   ├── repository/                      # 8 JPA repositories
│       │   │   ├── entity/                          # 8 JPA entities
│       │   │   ├── dto/                             # Request/Response DTOs
│       │   │   │   ├── auth/
│       │   │   │   ├── cart/
│       │   │   │   ├── order/
│       │   │   │   ├── product/
│       │   │   │   ├── review/
│       │   │   │   └── user/
│       │   │   ├── security/
│       │   │   │   ├── JwtTokenProvider.java        # Token creation & validation
│       │   │   │   ├── JwtAuthenticationFilter.java # Per-request filter
│       │   │   │   └── CustomUserDetailsService.java
│       │   │   ├── exception/                       # GlobalExceptionHandler
│       │   │   ├── enums/                           # Role, OrderStatus, etc.
│       │   │   └── util/                            # SlugGenerator, OrderNumberGenerator
│       │   └── resources/
│       │       ├── application.properties
│       │       └── static/                          # Frontend served by Spring
│       └── test/                                    # JUnit 5 tests
│
├── frontend/                             # Standalone frontend source
│   ├── index.html                           # Product shop homepage
│   ├── admin.html                           # Admin dashboard
│   ├── orders.html                          # Order history page
│   ├── profile.html                         # User profile page
│   ├── app.js                               # Main JS (products, cart, auth)
│   ├── admin.js                             # Admin dashboard logic
│   ├── orders.js                            # Orders page logic
│   ├── profile.js                           # Profile page logic
│   └── style.css / admin.css / orders.css   # Page styles
│
├── sql/                                  # Database scripts
│   ├── sample_data.sql                      # Insert sample products
│   └── populate_database.sh                 # Shell helper script
│
├── postman/                              # API testing
│   └── Ecommerce_API_Collection.json        # Import into Postman
│
├── individual_contribution/              # Team member reports
│
└── README.md                               # This file
```

---

## Running Tests

```bash
cd backend

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=AuthServiceTest

# Run with coverage report
./mvnw test jacoco:report
```

Test coverage includes:
- `AuthServiceTest` - registration, login, duplicate email
- `ProductServiceTest` - CRUD, search, stock validation
- `CartServiceTest` - add/update/remove, stock check
- `OrderServiceTest` - checkout flow, stock deduction
- `AuthControllerTest` - HTTP layer tests with MockMvc
- `OrderFlowIntegrationTest` - end-to-end order lifecycle

---

## Roadmap

- [ ] Email verification on registration
- [ ] Password reset via email OTP
- [ ] Product image upload (Cloudinary / S3)
- [ ] Wishlist / save for later
- [ ] Coupon codes and promo discounts
- [ ] Razorpay / Stripe payment gateway integration
- [ ] Real-time order tracking with WebSockets
- [ ] Product recommendations engine
- [ ] Mobile app (React Native)

---

## Team

**Team Name: Cold Blooded** | IIITB

| Name | Roll Number | Contribution |
|------|------------|-------------|
| **Tanmay Dixit** | BT2024016 | Project Lead - Authentication - Spring Security - JWT implementation |
| **Ayush Patel** | BT2024054 | Product module - Category management - Search & filtering |
| **Aryan Malik** | BT2024006 | Cart system - Order management - Stock concurrency handling |
| **Kabir Ahuja** | BT2024004 | Frontend UI/UX - Admin dashboard - CSS design system |
| **Naman Jindal** | BT2024203 | Database schema design - SQL scripts - Data modeling |
| **Sachin Singh Nain** | BT2024201 | Unit testing - Integration testing - API documentation |

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with code by Team Cold Blooded - IIITB

**Star this repo if you found it useful!**

</div>
