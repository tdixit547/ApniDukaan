# Individual Contribution Report

## Sachin Singh Nain
**Roll Number:** BT2024201

---

## My Role in the Project

I was responsible for the **security infrastructure** of our application. This includes JWT authentication, Spring Security configuration, and all repository interfaces. Essentially, I built the systems that:

1. **Verify identity** – Are you who you claim to be? (authentication)
2. **Control access** – What are you allowed to do? (authorization)
3. **Connect to database** – How does Java code talk to MySQL? (repositories)

Security is often invisible when it works, but critical when it doesn't. Let me walk you through what I built.

---

## 1. JWT Authentication – How It Works

JWT (JSON Web Token) is a way to securely transmit information between parties. In our case, it proves a user's identity without sending passwords repeatedly.

### The Login Flow:

1. User enters email and password
2. Server verifies credentials against database
3. If valid, server creates a JWT token
4. Token is sent back to the client
5. Client stores the token (in localStorage)
6. For every future request, client attaches the token

### Token Structure:

A JWT looks like this:
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGVtYWlsLmNvbSIsInJvbGUiOiJDVVNUT01FUiJ9.signature
```

It has three parts separated by dots:
- **Header** – Algorithm used (HS256)
- **Payload** – User email, role, expiry time
- **Signature** – Proof that token wasn't tampered with

The signature is created using a secret key that only our server knows. If anyone modifies the payload, the signature becomes invalid, and the token is rejected.

---

## 2. SecurityConfig – The Access Control Center

I configured which endpoints are public and which require authentication.

### Public Endpoints (Anyone Can Access):

```java
/api/auth/register    // Registration
/api/auth/login       // Login
/api/products/**      // View products
/api/categories/**    // View categories
```

These are accessible without logging in because you need to browse products before buying.

### Protected Endpoints (Login Required):

```java
/api/cart/**          // Shopping cart
/api/orders/**        // Orders
/api/users/me         // Profile
/api/products/**/reviews  // Writing reviews
```

If you try to access these without a token, you get a 401 Unauthorized response.

### Admin-Only Endpoints:

```java
POST /api/products    // Create product
PUT /api/products/*   // Update product
DELETE /api/products/*// Delete product
POST /api/categories  // Create category
PUT /api/categories/* // Update category
DELETE /api/categories// Delete category
GET /api/users        // View all users
```

Only users with `role = ADMIN` can access these. Regular customers get 403 Forbidden.

---

## 3. JwtTokenProvider – Creating and Validating Tokens

### Token Generation

When someone logs in successfully, I create a token with:
- **Subject**: User's email
- **Role**: CUSTOMER or ADMIN
- **Issued At**: Current timestamp
- **Expiry**: 24 hours from now
- **Signature**: Signed with secret key

```java
String token = Jwts.builder()
    .setSubject(email)
    .claim("role", role)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
    .signWith(secretKey)
    .compact();
```

### Token Validation

For every request, I validate the token:
1. Is the format correct? (three parts with dots)
2. Can we decode it with our secret key?
3. Has it expired?
4. Is the signature valid?

If any check fails, the request is rejected with 401 Unauthorized.

---

## 4. JwtAuthenticationFilter – The Gatekeeper

This filter runs on EVERY HTTP request to our server. Think of it as a security guard at the entrance.

### The Filter Flow:

```
Request arrives
     ↓
Look for "Authorization: Bearer <token>" header
     ↓
Token found?
     ├── No → Skip authentication, proceed
     └── Yes ↓
          Validate token with JwtTokenProvider
          ↓
          Valid?
          ├── No → Reject with 401
          └── Yes ↓
               Extract email from token
               ↓
               Load user from database
               ↓
               Set authentication in SecurityContext
               ↓
               Continue to controller
```

By setting the authentication in SecurityContext, I tell Spring Security who this user is. Controllers can then access the authenticated user's information.

---

## 5. CustomUserDetailsService – Loading User Info

Spring Security needs a way to load user details for authentication. I implemented this interface to fetch users from our database.

When a token is validated, I:
1. Extract the email from the token
2. Call `userRepository.findByEmail(email)`
3. Return the user details (email, password hash, role)

This integrates our custom User entity with Spring Security's authentication system.

---

## 6. Repository Interfaces – Database Access

Repositories are the bridge between Java code and MySQL. Spring Data JPA does the heavy lifting – I just define what queries I need, and Spring generates the SQL.

### UserRepository
```java
Optional<User> findByEmail(String email);      // For login
boolean existsByEmail(String email);            // Check during registration
```

### ProductRepository
```java
Page<Product> findByCategoryId(Long categoryId);  // Category filtering
Page<Product> searchByNameContaining(String q);   // Search
```

### OrderRepository
```java
List<Order> findByUserId(Long userId);           // Order history
Optional<Order> findByOrderNumber(String num);   // Find specific order
```

### ReviewRepository
```java
Double getAverageRatingByProductId(Long id);     // Calculate average stars
boolean existsByProductIdAndUserId(Long p, Long u); // Prevent duplicates
```

### Other Repositories:
- **CategoryRepository** – Category CRUD
- **CartRepository** – Cart operations
- **CartItemRepository** – Cart item management
- **OrderItemRepository** – Order line items

---

## 7. My APIs

Based on our work distribution, I was assigned 5 APIs related to user management:

| # | API Name | Method | Endpoint |
|---|----------|--------|----------|
| 26 | Get User Profile | GET | `/api/users/me` |
| 27 | Update Profile | PUT | `/api/users/me` |
| 28 | Get All Users | GET | `/api/users` (admin) |
| 29 | Change Password | PUT | `/api/users/{id}/password` |
| 30 | Delete User | DELETE | `/api/users/{id}` |

---

## 8. How It All Connects

Here's the complete security flow:

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LOGIN                           │
│                                                             │
│  1. User sends: POST /api/auth/login                        │
│     Body: { "email": "...", "password": "..." }             │
│                           ↓                                 │
│  2. AuthService validates credentials                       │
│                           ↓                                 │
│  3. JwtTokenProvider creates token                          │
│                           ↓                                 │
│  4. Token returned to client                                │
│                           ↓                                 │
│  5. Client stores token in localStorage                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    PROTECTED REQUEST                         │
│                                                             │
│  1. User sends: GET /api/cart                               │
│     Header: Authorization: Bearer <token>                   │
│                           ↓                                 │
│  2. JwtAuthenticationFilter extracts token                  │
│                           ↓                                 │
│  3. JwtTokenProvider validates token                        │
│                           ↓                                 │
│  4. CustomUserDetailsService loads user                     │
│                           ↓                                 │
│  5. SecurityContext updated with user info                  │
│                           ↓                                 │
│  6. Request proceeds to CartController                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

| Component | Purpose |
|-----------|---------|
| **SecurityConfig** | Defines which URLs need authentication and which are public |
| **JwtTokenProvider** | Creates JWT tokens at login, validates tokens on requests |
| **JwtAuthenticationFilter** | Intercepts all requests and handles token-based auth |
| **CustomUserDetailsService** | Loads user details from database for Spring Security |
| **8 Repositories** | Database access for all entities |

---

*Report prepared by Sachin Singh Nain (BT2024201)*
