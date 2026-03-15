# Individual Contribution Report

## Ayush Patel
**Roll Number:** BT2024054

---

## My Role in the Project

When we started this project, we needed someone to lay the groundwork before anyone else could begin coding. That's where I came in. I took on the responsibility of designing and building the **foundation** that the entire application sits on.

My work covered three major areas:
1. **Entity Classes** – I designed all 8 data models that represent our database tables
2. **MySQL Database Setup** – I set up the database, wrote SQL scripts, and created sample data
3. **API Testing with Postman** – I tested all 30 APIs to make sure everything works correctly
4. **GitHub Management** – I maintained the repository, handled pull requests, and wrote documentation
5. **Frontend Contributions** – I built the Profile and About pages

Think of it this way: entities are like the blueprint of a building, and I was the architect who drew all the blueprints before construction began. Without these, the services and controllers couldn't do anything.

---

## 1. Entity Classes – The Data Foundation

Entities in Spring Boot are Java classes that directly map to MySQL database tables. When you annotate a class with `@Entity`, Spring Boot (through Hibernate) automatically creates the corresponding table in the database. This is called **Object-Relational Mapping (ORM)**.

I designed all 8 entity classes for our application. Let me walk you through each one and explain my design decisions.

### 1.1 User Entity (`entity/User.java`)

This is arguably the most important entity because everything in an e-commerce application revolves around users – they browse products, add items to cart, place orders, and write reviews.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key, auto-generated |
| `email` | String | Unique identifier for login |
| `passwordHash` | String | BCrypt encrypted password |
| `firstName` | String | User's first name |
| `lastName` | String | User's last name |
| `phone` | String | 10-digit mobile number |
| `role` | Enum | CUSTOMER or ADMIN |
| `createdAt` | LocalDateTime | Registration timestamp |
| `updatedAt` | LocalDateTime | Last profile update |

**Key Design Decisions:**

1. **Email as unique constraint**: I made email unique because it serves as the login username. Two users can't register with the same email. This is enforced at the database level with `@Column(unique = true)`.

2. **Password security**: Passwords are never stored as plain text. They go through BCrypt hashing with a strength of 12. Even if someone accesses the database, they can't reverse the hash to get the actual password. The field is named `passwordHash` rather than `password` to remind developers that it's already encrypted.

3. **Role-based access**: By default, new users get the `CUSTOMER` role. Admins can later upgrade them to `ADMIN` role through the admin panel. This is crucial for protecting admin-only endpoints like creating products or viewing all users.

4. **Audit timestamps**: `createdAt` is set automatically when the user registers, and `updatedAt` changes whenever they modify their profile. This is useful for debugging and analytics.

---

### 1.2 Product Entity (`entity/Product.java`)

Products are the core of any e-commerce application. I spent a lot of time thinking about what fields would be needed for a realistic product catalog.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key |
| `name` | String | Product name (required) |
| `description` | Text | Detailed description |
| `sku` | String | Stock Keeping Unit (unique code) |
| `basePrice` | BigDecimal | Original price before tax/discount |
| `tax` | BigDecimal | Tax percentage (default 18% for GST) |
| `discount` | BigDecimal | Discount percentage (default 0%) |
| `stock` | Integer | Available quantity |
| `category` | Category | Foreign key to Category |
| `imagePath` | String | Path to product image |
| `version` | Integer | For optimistic locking |
| `createdAt` | LocalDateTime | When product was added |
| `updatedAt` | LocalDateTime | Last modification |

**Key Design Decisions:**

1. **Price calculation logic**: Instead of storing the final price, I store `basePrice`, `tax`, and `discount` separately. The final price is calculated dynamically as:
   ```
   finalPrice = basePrice × (1 - discount/100) × (1 + tax/100)
   ```
   This approach means that if we change the tax rate (say from 18% to 12%), all products automatically reflect the new pricing without needing individual updates.

2. **Using BigDecimal for prices**: I used `BigDecimal` instead of `double` for all money-related fields. This is essential because floating-point arithmetic can lead to rounding errors. Try this in Java: `0.1 + 0.2` gives `0.30000000000000004`. For financial calculations, this is unacceptable.

3. **SKU for inventory**: Stock Keeping Unit is a unique identifier that warehouses use. It allows us to distinguish between different variants of the same product (like iPhone 14 Black 128GB vs iPhone 14 Blue 256GB).

4. **Optimistic locking with version**: The `@Version` annotation prevents concurrent update problems. If two admins try to update the same product simultaneously, the second one gets an error instead of silently overwriting the first update.

---

### 1.3 Category Entity (`entity/Category.java`)

Categories help organize products into logical groups. I kept this entity simple but added some smart features.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key |
| `name` | String | Display name (unique) |
| `slug` | String | URL-friendly version |
| `description` | String | What products belong here |
| `products` | List<Product> | All products in this category |
| `createdAt` | LocalDateTime | When created |
| `updatedAt` | LocalDateTime | Last modified |

**Key Design Decisions:**

1. **Automatic slug generation**: When someone creates a category named "Electronics & Gadgets", the slug automatically becomes "electronics-gadgets". This is used for SEO-friendly URLs like `/category/electronics-gadgets` instead of `/category/1`.

2. **One-to-Many relationship**: A category can have many products, but a product belongs to exactly one category. I mapped this with `@OneToMany(mappedBy = "category")`.

3. **Cascade behavior**: When a category is deleted, I had to decide what happens to its products. I went with restricting deletion if products exist – you have to move or delete the products first. This prevents accidental data loss.

---

### 1.4 Order Entity (`entity/Order.java`)

Orders are created when customers complete checkout. This is a complex entity because it needs to store a snapshot of the transaction.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key |
| `orderNumber` | String | Human-readable identifier |
| `user` | User | Who placed the order |
| `status` | OrderStatus | Current order state |
| `totalAmount` | BigDecimal | Final amount charged |
| `shippingAddress` | String | Delivery address |
| `paymentMethod` | PaymentMethod | How they're paying |
| `paymentStatus` | PaymentStatus | Payment state |
| `orderItems` | List<OrderItem> | Products in this order |
| `createdAt` | LocalDateTime | Order placement time |
| `updatedAt` | LocalDateTime | Last status change |

**Key Design Decisions:**

1. **Order number format**: I generate order numbers with the pattern `ORD-YYYYMMDD-NNN` like `ORD-20241210-001`. This is human-friendly for customer support calls and helps with sorting by date.

2. **Status enum**: I created an enum with states:
   - `PENDING` – Just placed, awaiting confirmation
   - `CONFIRMED` – Payment verified, processing
   - `SHIPPED` – On the way
   - `DELIVERED` – Customer received
   - `CANCELLED` – Order cancelled

3. **Payment tracking**: Separate `paymentMethod` (CARD, UPI, COD, NET_BANKING) and `paymentStatus` (PENDING, SUCCESS, FAILED) because these are independent. A COD order has payment PENDING until delivery.

---

### 1.5 OrderItem Entity (`entity/OrderItem.java`)

Each product in an order becomes an OrderItem. This is a classic junction table pattern for many-to-many relationships.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key |
| `order` | Order | Parent order |
| `product` | Product | Which product |
| `productName` | String | Product name snapshot |
| `quantity` | Integer | How many ordered |
| `unitPrice` | BigDecimal | Price per unit at purchase |
| `subtotal` | BigDecimal | quantity × unitPrice |

**Key Design Decision – Historical Pricing:**

This is crucial: I store `unitPrice` and `productName` as snapshots at the time of purchase. Here's why:

Imagine you buy an iPhone for ₹79,900 today. Next week, Apple increases the price to ₹84,900. When you view your order history, it should show ₹79,900 – what you actually paid – not the current price.

Similarly, if a product is renamed or discontinued, your order history still shows what you ordered. Without this snapshot, historical data becomes unreliable.

---

### 1.6 Cart Entity (`entity/Cart.java`)

Each user has exactly one shopping cart that persists across sessions.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key |
| `user` | User | Cart owner (one-to-one) |
| `cartItems` | List<CartItem> | Items in cart |
| `createdAt` | LocalDateTime | When cart was created |
| `updatedAt` | LocalDateTime | Last modification |

**Key Design Decision – One cart per user:**

I used `@OneToOne` relationship with User. When a user registers, an empty cart is automatically created for them. This simplifies the cart logic – we never need to check if a cart exists.

---

### 1.7 CartItem Entity (`entity/CartItem.java`)

Items inside a shopping cart.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key |
| `cart` | Cart | Parent cart |
| `product` | Product | Which product |
| `quantity` | Integer | How many |
| `unitPrice` | BigDecimal | Price at addition time |
| `createdAt` | LocalDateTime | When added |
| `updatedAt` | LocalDateTime | Last quantity change |

**Key Design Decision – Cart to Order conversion:**

When someone checks out, I designed the flow so that:
1. Each CartItem becomes an OrderItem
2. Stock is deducted from products
3. The cart is cleared
4. The order is created with all the items

This atomic transaction ensures data consistency – either everything succeeds or nothing changes.

---

### 1.8 Review Entity (`entity/Review.java`)

Product reviews with star ratings.

**Fields I included:**
| Field | Type | Purpose |
|-------|------|---------|
| `id` | Long | Primary key |
| `product` | Product | Product being reviewed |
| `user` | User | Review author |
| `rating` | Integer | 1 to 5 stars |
| `comment` | String | Written review text |
| `createdAt` | LocalDateTime | When written |

**Key Design Decision – One review per user per product:**

I added a unique constraint on `(product_id, user_id)`. This means each user can only review a product once. If they want to change their review, they can edit it, but they can't leave multiple reviews. This prevents review spam and keeps ratings authentic.

---

## 2. Database Schema & Relationships

I designed how all tables connect to each other. Here's the complete relationship diagram:

```
┌─────────────┐           ┌──────────────┐           ┌─────────────┐
│    USERS    │◄──────────│     CART     │           │  CATEGORIES │
│             │           │              │           │             │
│  id (PK)    │           │  id (PK)     │           │  id (PK)    │
│  email      │           │  user_id(FK) │───────────│  name       │
│  password   │           └──────┬───────┘           │  slug       │
│  firstName  │                  │                   └──────┬──────┘
│  lastName   │                  │                          │
│  role       │           ┌──────▼───────┐                  │
└──────┬──────┘           │  CART_ITEMS  │                  │
       │                  │              │           ┌──────▼──────┐
       │                  │  id (PK)     │           │  PRODUCTS   │
       │                  │  cart_id(FK) │           │             │
       │                  │  product_id  │──────────►│  id (PK)    │
       │                  │  quantity    │           │  name       │
       │                  └──────────────┘           │  basePrice  │
       │                                             │  category_id│
       │                                             └──────┬──────┘
       │           ┌──────────────┐                         │
       │           │    ORDERS    │                         │
       │           │              │                         │
       └──────────►│  id (PK)     │                         │
       │           │  user_id(FK) │                         │
       │           │  status      │                         │
       │           │  totalAmount │                         │
       │           └──────┬───────┘                         │
       │                  │                                 │
       │           ┌──────▼───────┐                         │
       │           │ ORDER_ITEMS  │                         │
       │           │              │                         │
       │           │  id (PK)     │                         │
       │           │  order_id(FK)│                         │
       │           │  product_id  │─────────────────────────┘
       │           │  quantity    │
       │           └──────────────┘
       │
       │           ┌──────────────┐
       │           │   REVIEWS    │
       │           │              │
       └──────────►│  id (PK)     │
                   │  user_id(FK) │
                   │  product_id  │─────────────────────────►
                   │  rating      │
                   │  comment     │
                   └──────────────┘
```

**Indexes I Created:**
- **Email index on users** – For fast login lookup
- **Name index on products** – For search functionality
- **Category_id index on products** – For category filtering
- **User_id index on orders** – For order history queries
- **Product_id + user_id unique index on reviews** – To prevent duplicate reviews

---

## 3. MySQL Database & SQL Scripts

I set up the complete database environment for our project.

### Database Setup

I wrote scripts in the `/sql/` folder:

1. **sample_data.sql** – Populates the database with test data:
   - 5 users (4 customers + 1 admin)
   - 5 categories (Electronics, Fashion, Home & Kitchen, Books, Sports)
   - 10 products with Indian pricing in INR
   - Sample cart items, orders, and reviews
   - Default password for all test users: `password123`

2. **update_product_images.sql** – Updates product image paths after adding images

3. **populate_database.sh** – Shell script to run all SQL files in order

### Sample Products I Created:

| Product | Category | Base Price | Tax | Discount |
|---------|----------|------------|-----|----------|
| iPhone 14 128GB | Electronics | ₹79,900 | 18% | 5% |
| Samsung Galaxy M33 | Electronics | ₹16,999 | 18% | 10% |
| Dell Inspiron Laptop | Electronics | ₹52,990 | 18% | 8% |
| Levis 511 Jeans | Fashion | ₹2,999 | 12% | 20% |
| Nike Air Max | Fashion | ₹5,499 | 12% | 15% |
| Prestige Cooker | Home & Kitchen | ₹2,199 | 18% | 12% |
| Philips Iron | Home & Kitchen | ₹1,295 | 18% | 10% |
| Ikigai Book | Books | ₹299 | 0% | 15% |
| Sapiens Book | Books | ₹499 | 0% | 20% |
| Yoga Mat | Sports | ₹799 | 18% | 25% |

---

## 4. Postman API Testing

I was responsible for testing all 30 APIs using Postman to ensure everything works correctly before we consider any feature complete.

### Testing Methodology

For each API, I tested:

1. **Happy path** – Valid request with correct data, expecting success
2. **Missing fields** – What happens if required fields are missing?
3. **Invalid data** – Wrong data types, invalid emails, negative prices
4. **Authorization** – Protected endpoints should reject unauthenticated requests
5. **Edge cases** – Empty carts, out-of-stock products, duplicate emails

### Testing Summary by Module

| Module | APIs Tested | Test Cases |
|--------|-------------|------------|
| Authentication | 2 | Registration validation, login with wrong password, token generation |
| Categories | 5 | CRUD operations, duplicate name prevention, slug generation |
| Products | 7 | CRUD, search, category filter, pagination (page 0, 1, etc.) |
| Cart | 4 | Add to cart, update quantity, remove, stock validation |
| Orders | 4 | Checkout flow, empty cart error, status updates |
| Reviews | 3 | Add review, duplicate review prevention, average calculation |
| Users | 5 | Profile CRUD, password change with wrong old password |

### Issues I Found and Reported:

- Initial cart creation was failing if user had no cart – fixed
- Search wasn't case-insensitive – fixed
- Pagination was 1-indexed instead of 0-indexed – corrected
- Reviews allowed rating 0 – added validation for 1-5 only

---

## 5. GitHub Repository Management

I set up and maintained the GitHub repository throughout the project.

### Repository Setup:
- Created the repository with proper structure
- Set up `.gitignore` for Java/Spring Boot (ignoring `target/`, `.idea/`, etc.)
- Created branch protection rules for `main`
- Wrote the initial README with setup instructions

### Ongoing Maintenance:
- Reviewed and merged pull requests from team members
- Resolved merge conflicts when multiple people edited the same file
- Created the final comprehensive README with project details
- Maintained the `API_REFERENCE.md` documentation

### Documentation I Wrote:
- **README.md** – Complete project overview, setup guide, team info
- **API_REFERENCE.md** – All 30 endpoints with request/response examples
- **TEAM_WORK_DISTRIBUTION.md** – Who did what in the project

---

## 6. Frontend Contribution

I also contributed to the frontend by building two pages:

### Profile Page (`profile.html`)
A page where users can:
- View their account information
- Edit their first name, last name, and phone number
- Change their password
- Delete their account

### About Page (`about.html`)
A page containing:
- Project description and overview
- How-to-use guide for new users
- Team member information with roll numbers

---

## 7. My APIs

Based on our work distribution, I was assigned 5 APIs:

| # | API Name | Method | Endpoint | What It Does |
|---|----------|--------|----------|--------------|
| 1 | Register User | POST | `/api/auth/register` | Creates a new user account with encrypted password |
| 2 | Login User | POST | `/api/auth/login` | Validates credentials and returns JWT token |
| 3 | Get All Categories | GET | `/api/categories` | Lists all product categories |
| 8 | Get All Products | GET | `/api/products` | Returns paginated list of products |
| 15 | View Cart | GET | `/api/cart` | Shows user's shopping cart with items |

---

## Summary

| Contribution Area | Details |
|-------------------|---------|
| **Entity Classes** | 8 classes – User, Product, Category, Order, OrderItem, Cart, CartItem, Review |
| **Database Design** | Complete schema with relationships, indexes, and constraints |
| **SQL Scripts** | Sample data with 5 users, 5 categories, 10 products, orders, reviews |
| **Postman Testing** | Tested all 30 APIs with multiple test cases each |
| **GitHub** | Repository setup, maintenance, documentation |
| **Frontend** | Profile page and About page |
| **APIs** | 5 endpoints – Register, Login, Get Categories, Get Products, View Cart |

---

*Report prepared by Ayush Patel (BT2024054)*
