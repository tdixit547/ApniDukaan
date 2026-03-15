# Individual Contribution Report

## Naman Jindal
**Roll Number:** BT2024203

---

## My Role in the Project

I was responsible for building the **Controllers and Services** for Products, Categories, and Authentication. In Spring Boot terms, this is the core business layer of the application – controllers receive HTTP requests and services contain the actual logic that makes things happen.

Let me explain what I built and why it matters.

---

## 1. Understanding Controllers and Services

Before diving into code details, here's how these components fit together:

```
User Request → Controller → Service → Repository → Database
                   ↓            ↓           ↓
              Validates    Processes    Fetches/
              Request      Logic        Saves Data
```

**Controllers** are the entry points. When someone visits `/api/products`, my ProductController receives that. Think of controllers as receptionists – they greet the request, check if it's valid, and hand it off to the right service.

**Services** contain the business logic. They know the rules: how to calculate prices, when to reject a request, what validations to apply. The controller doesn't know any of this – it just coordinates.

---

## 2. AuthController & AuthService – User Authentication

This is the gateway to our application. Before users can shop, they need to register and login.

### AuthController Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/login` | POST | Authenticate and get JWT token |

### AuthService – The Authentication Logic:

**Registration Flow:**
1. Check if email already exists in database
2. If exists, return error "Email already registered"
3. Validate password meets requirements (minimum 6 characters)
4. Hash the password using BCrypt (never store plain text!)
5. Create new User with CUSTOMER role
6. Generate JWT token for immediate login
7. Return user details with token

**Login Flow:**
1. Look up user by email
2. If not found, return error "Invalid credentials"
3. Compare provided password with stored hash using BCrypt
4. If match, generate new JWT token
5. Return user details with token

The token contains the user's email and role, signed with a secret key. It expires after 24 hours for security.

---

## 3. ProductController – What I Built

### The Endpoints

I created six endpoints in ProductController:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | Get all products (paginated) |
| `/api/products/{id}` | GET | Get single product by ID |
| `/api/products` | POST | Create new product (admin) |
| `/api/products/{id}` | PUT | Update product (admin) |
| `/api/products/{id}` | DELETE | Delete product (admin) |
| `/api/products/search` | GET | Search products by keyword |
| `/api/products/category/{id}` | GET | Products in a category |

### Pagination Implementation

Loading all products at once would be slow and wasteful. If we have 1000 products, why load all of them when the user only sees 10?

I implemented pagination with these parameters:
- `page` – Which page (starting from 0)
- `size` – How many items per page (default 10)

So `/api/products?page=0&size=10` gets the first 10 products, and `page=1` gets the next 10.

The response includes metadata:
```json
{
  "content": [...products...],
  "totalElements": 100,
  "totalPages": 10,
  "number": 0,
  "size": 10
}
```

This tells the frontend there are 100 products across 10 pages.

### Search Functionality

For the search endpoint, I implemented case-insensitive searching across product names and descriptions. If you search for "iphone", it finds products with "iPhone", "IPHONE", or "iphone" in their name or description.

The query looks like:
```
/api/products/search?query=iphone
```

---

## 4. ProductService – The Business Logic

This is where the real work happens.

### Price Calculation

Every product has:
- `basePrice` – The original MRP
- `tax` – GST percentage (default 18%)
- `discount` – Discount percentage

I implemented the price calculation formula:
```
finalPrice = basePrice × (1 - discount/100) × (1 + tax/100)
```

Example:
```
Base Price:  ₹10,000
Discount:    10% → ₹10,000 × 0.90 = ₹9,000
Tax:         18% → ₹9,000 × 1.18 = ₹10,620
Final Price: ₹10,620
```

This calculation happens in the service layer, not the database, so it's always consistent.

### Creating a Product

When an admin creates a product, I perform these checks:
1. **Category validation** – Does the category exist? Can't add a product to a non-existent category.
2. **SKU uniqueness** – The SKU (stock keeping unit) must be unique.
3. **Price validation** – Base price must be positive, tax and discount must be between 0-100.

If any check fails, I return a meaningful error message.

### Updating a Product

For updates, I made it flexible – you only need to send the fields you want to change. If you just want to update the price, send only `basePrice`. Other fields stay unchanged.

### Stock Management

When products are added to cart or ordered, the stock decreases. When orders are cancelled, stock is restored. This logic lives in the service layer to keep it centralized.

---

## 5. CategoryController & CategoryService

### CategoryController Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/categories` | GET | Get all categories |
| `/api/categories/{id}` | GET | Get single category |
| `/api/categories` | POST | Create category (admin) |
| `/api/categories/{id}` | PUT | Update category (admin) |
| `/api/categories/{id}` | DELETE | Delete category (admin) |

### Slug Generation

When you create a category like "Electronics & Gadgets", I automatically generate a URL-friendly slug: "electronics-gadgets".

The logic:
1. Convert to lowercase
2. Replace spaces and special characters with hyphens
3. Remove consecutive hyphens

This is useful for SEO-friendly URLs like `/shop/category/electronics-gadgets`.

### Duplicate Prevention

Before saving a new category, I check if one with the same name already exists. Two categories named "Electronics" would be confusing, so I reject duplicates.

### Delete Protection

You can't delete a category that has products. I check if `products.isEmpty()` before allowing deletion. If products exist, the admin must move or delete them first.

---

## 6. My APIs

Based on our work distribution, I was assigned 5 APIs:

| # | API Name | Method | Endpoint |
|---|----------|--------|----------|
| 4 | Create Category | POST | `/api/categories` |
| 5 | Get Category by ID | GET | `/api/categories/{id}` |
| 10 | Create Product | POST | `/api/products` |
| 11 | Update Product | PUT | `/api/products/{id}` |
| 13 | Search Products | GET | `/api/products/search` |

---

## 7. Key Design Decisions

### Separation of Concerns
I kept controllers thin – they only handle HTTP concerns (reading request parameters, setting response status). All business rules live in services. This makes testing easier and keeps code organized.

### Error Handling
Instead of generic 500 errors, I return specific messages:
- "Category not found" with 404
- "Product with this SKU already exists" with 400
- "Price must be positive" with 400

This helps the frontend show meaningful messages to users.

### Using DTOs
I never return entity objects directly. I use DTOs (created by Tanmay) to control exactly what data goes out. This prevents sensitive data leakage and makes the API contract clear.

---

## Summary

| Component | What I Built |
|-----------|--------------|
| **AuthController** | 2 REST endpoints for registration and login |
| **AuthService** | Password hashing, credential validation, token generation |
| **ProductController** | 7 REST endpoints for product CRUD, search, and filtering |
| **ProductService** | Price calculation, validation, search logic, stock management |
| **CategoryController** | 5 REST endpoints for category CRUD |
| **CategoryService** | Slug generation, duplicate checking, delete protection |

---

*Report prepared by Naman Jindal (BT2024203)*
