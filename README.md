# 🛒 ApniDukaan — Full Stack E-Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vanilla_JS-Frontend-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge"/>
</p>

<p align="center">
  A production-ready e-commerce web application with JWT-secured REST API, role-based access control, shopping cart, order management, and an admin dashboard — all built with Spring Boot and Vanilla JS.
</p>

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Team](#team)

---

## Features

### Customer Features
- Register and Login with JWT authentication
- Browse products by category or search
- Add to cart, update quantity, remove items
- Place orders with shipping address
- Write product reviews and ratings
- View and update profile, change password
- View order history

### Admin Features
- Admin dashboard with sales overview
- Add, edit, delete products
- Manage product categories
- Update order statuses (Confirmed to Shipped to Delivered)
- View and manage all users

### Security
- Stateless JWT authentication (no sessions)
- BCrypt password hashing
- Role-based authorization (CUSTOMER / ADMIN)
- Pessimistic DB locking to prevent overselling

---

## Architecture

```
Browser (Vanilla JS + HTML + CSS)
        |
        | HTTP REST API
        v
Spring Boot Backend (Port 8081)
  - AuthController
  - ProductController
  - CartController
  - OrderController
  - UserController
  - ReviewController
  - CategoryController
        |
        v
Service Layer (Business Logic)
        |
        v
Spring Data JPA Repositories
        |
        v
MySQL Database (Port 3306)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | Spring Boot 3.3.5 |
| Language | Java 21 |
| Security | Spring Security + JWT (JJWT 0.11.5) |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8.0 |
| Password Hashing | BCrypt |
| Build Tool | Maven |
| Frontend | HTML5, CSS3, Vanilla JavaScript |

---

## Getting Started

### Prerequisites
- Java 21+
- MySQL 8.0+
- Maven 3.8+

### 1. Clone the repository
```bash
git clone https://github.com/tdixit547/ApniDukaan.git
cd ApniDukaan
```

### 2. Set up the database
```sql
CREATE DATABASE ecommerce_db;
```

### 3. Configure application properties
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### 4. Run the backend
```bash
cd backend
./mvnw spring-boot:run
```

The server starts on **http://localhost:8081**

### 5. Open the frontend
Open `http://localhost:8081` in your browser.

> On first startup, the DataSeeder automatically populates sample categories and products.

---

## API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login and get JWT token | Public |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/products | List all products (paginated) | Public |
| GET | /api/products/{id} | Get product by ID | Public |
| GET | /api/products/search?query= | Search products | Public |
| GET | /api/products/category/{id} | Products by category | Public |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/{id} | Update product | Admin |
| DELETE | /api/products/{id} | Delete product | Admin |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/categories | List all categories | Public |
| POST | /api/categories | Create category | Admin |
| PUT | /api/categories/{id} | Update category | Admin |
| DELETE | /api/categories/{id} | Delete category | Admin |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/cart?userId= | Get user cart | Bearer Token |
| POST | /api/cart/items?userId= | Add item to cart | Bearer Token |
| PUT | /api/cart/items/{id}?userId= | Update quantity | Bearer Token |
| DELETE | /api/cart/items/{id}?userId= | Remove item | Bearer Token |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/orders?userId= | Place order from cart | Bearer Token |
| GET | /api/orders?userId= | Get user orders | Bearer Token |
| GET | /api/orders/{id}?userId= | Get order by ID | Bearer Token |
| PUT | /api/orders/{id}/status | Update order status | Admin |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/products/{id}/reviews | Get product reviews | Public |
| POST | /api/products/{id}/reviews?userId= | Add review | Bearer Token |
| GET | /api/products/{id}/reviews/average | Get average rating | Public |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/users/me?userId= | Get current user | Bearer Token |
| PUT | /api/users/me?userId= | Update profile | Bearer Token |
| PUT | /api/users/{id}/password | Change password | Bearer Token |
| GET | /api/users | List all users | Admin |

---

## Project Structure

```
ApniDukaan/
├── backend/                          # Spring Boot application
│   ├── src/main/java/
│   │   └── coldblooded/project/prototype/
│   │       ├── config/               # Security, JWT, CORS, DataSeeder
│   │       ├── controller/           # REST controllers (7 controllers)
│   │       ├── dto/                  # Data Transfer Objects
│   │       ├── entity/               # JPA entities (8 entities)
│   │       ├── enums/                # Role, OrderStatus, PaymentMethod
│   │       ├── exception/            # Global exception handling
│   │       ├── repository/           # Spring Data JPA repositories
│   │       ├── security/             # JWT filter and token provider
│   │       └── service/              # Business logic (8 services)
│   └── src/main/resources/
│       ├── application.properties
│       └── static/                   # Served frontend files
├── frontend/                         # Source frontend files
│   ├── index.html                    # Main shop page
│   ├── admin.html                    # Admin dashboard
│   ├── orders.html                   # Order history
│   ├── profile.html                  # User profile
│   ├── app.js                        # Main application logic
│   ├── admin.js                      # Admin dashboard logic
│   └── style.css                     # Global styles
├── sql/                              # Database scripts
└── postman/                          # API test collections
```

---

## Team

**Team: Cold Blooded**

| Name | Roll No | Contribution |
|------|---------|-------------|
| Tanmay Dixit | BT2024016 | Project lead, Auth and Security |
| Ayush Patel | BT2024054 | Product and Category modules |
| Aryan Malik | BT2024006 | Cart and Order management |
| Kabir Ahuja | BT2024004 | Frontend UI/UX |
| Naman Jindal | BT2024203 | Database design and SQL |
| Sachin Singh Nain | BT2024201 | Testing and Integration |

---

## License

This project is licensed under the MIT License.
