# Team Work Distribution - ApniDukaan


---

## Team Assignments

### Ayush Patel (BT2024054)
**Focus: Entities, Database, Postman**

**Backend Files:**
- `entity/User.java`
- `entity/Category.java`
- `entity/Product.java`
- `entity/Cart.java`
- `entity/CartItem.java`
- `entity/Order.java`
- `entity/OrderItem.java`
- `entity/Review.java`

**APIs (5):**
| # | API | Method | Endpoint |
|---|-----|--------|----------|
| 1 | Register User | POST | `/api/auth/register` |
| 2 | Login User | POST | `/api/auth/login` |
| 3 | Get All Categories | GET | `/api/categories` |
| 8 | Get All Products | GET | `/api/products` |
| 15 | View Cart | GET | `/api/cart` |

**Other:**
- Postman collection testing
- Database schema setup (MySQL)
- SQL scripts in `/sql/` folder
- Maintaining Github
- Implementing basic things in frontend like profile page and about page 

---

### Naman Jindal (BT2024203)
**Focus: Auth, Services, Controllers**

**Backend Files:**
- `controller/AuthController.java`
- `controller/ProductController.java`
- `controller/CategoryController.java`
- `service/AuthService.java`
- `service/ProductService.java`
- `service/CategoryService.java`

**APIs (5):**
| # | API | Method | Endpoint |
|---|-----|--------|----------|
| 4 | Create Category | POST | `/api/categories` |
| 5 | Get Category by ID | GET | `/api/categories/{id}` |
| 10 | Create Product | POST | `/api/products` |
| 11 | Update Product | PUT | `/api/products/{id}` |
| 13 | Search Products | GET | `/api/products/search` |

---

### Sachin Singh Nain (BT2024201)
**Focus: JWT Auth, Security, Repositories**

**Backend Files:**
- `config/SecurityConfig.java`
- `config/JwtProperties.java`
- `security/JwtTokenProvider.java`
- `security/JwtAuthenticationFilter.java`
- `security/CustomUserDetailsService.java`
- `repository/UserRepository.java`
- `repository/ProductRepository.java`
- `repository/CategoryRepository.java`
- `repository/CartRepository.java`
- `repository/CartItemRepository.java`
- `repository/OrderRepository.java`
- `repository/OrderItemRepository.java`
- `repository/ReviewRepository.java`

**APIs (5):**
| # | API | Method | Endpoint |
|---|-----|--------|----------|
| 26 | Get User Profile | GET | `/api/users/me` |
| 27 | Update Profile | PUT | `/api/users/me` |
| 28 | Get All Users | GET | `/api/users` |
| 29 | Change Password | PUT | `/api/users/{id}/password` |
| 30 | Delete User | DELETE | `/api/users/{id}` |

---

### Aryan Malik (BT2024006)
**Focus: Frontend, JWT Integration**

**Frontend Files:**
- `frontend/index.html`
- `frontend/style.css`
- `frontend/app.js`
- `frontend/admin.html`
- `frontend/admin.js`
- `frontend/admin.css`
- `frontend/profile.html`
- `frontend/profile.js`
- `frontend/profile.css`
- `frontend/orders.html`
- `frontend/orders.js`
- `frontend/orders.css`
- `frontend/about.html`

**APIs (5):**
| # | API | Method | Endpoint |
|---|-----|--------|----------|
| 16 | Add to Cart | POST | `/api/cart/items` |
| 17 | Update Cart Quantity | PUT | `/api/cart/items/{id}` |
| 18 | Remove from Cart | DELETE | `/api/cart/items/{id}` |
| 19 | Create Order | POST | `/api/orders` |
| 20 | Get User Orders | GET | `/api/orders` |

---

### Tanmay Dixit (BT2024016)
**Focus: DTOs, Mapping, MySQL**

**Backend Files:**
- `dto/auth/LoginRequest.java`
- `dto/auth/RegisterRequest.java`
- `dto/auth/AuthResponse.java`
- `dto/cart/CartDTO.java`
- `dto/cart/CartItemDTO.java`
- `dto/cart/AddToCartRequest.java`
- `dto/cart/UpdateCartRequest.java`
- `dto/category/CategoryDTO.java`
- `dto/category/CreateCategoryRequest.java`
- `dto/order/CreateOrderRequest.java`
- `dto/order/OrderDTO.java`
- `dto/order/OrderItemDTO.java`
- `dto/order/UpdateStatusRequest.java`
- `dto/product/ProductDTO.java`
- `dto/product/CreateProductRequest.java`
- `dto/product/UpdateProductRequest.java`
- `dto/review/ReviewDTO.java`
- `dto/review/CreateReviewRequest.java`
- `dto/user/UserDTO.java`
- `dto/user/UpdateProfileRequest.java`
- `mapper/` (all mapper files)

**APIs (5):**
| # | API | Method | Endpoint |
|---|-----|--------|----------|
| 6 | Update Category | PUT | `/api/categories/{id}` |
| 7 | Delete Category | DELETE | `/api/categories/{id}` |
| 9 | Get Product by ID | GET | `/api/products/{id}` |
| 12 | Delete Product | DELETE | `/api/products/{id}` |
| 14 | Products by Category | GET | `/api/products/category/{id}` |

---

### Kabir Ahuja (BT2024004)
**Focus: Services, Controllers, Postman**

**Backend Files:**
- `controller/CartController.java`
- `controller/OrderController.java`
- `controller/ReviewController.java`
- `controller/UserController.java`
- `service/CartService.java`
- `service/OrderService.java`
- `service/ReviewService.java`
- `service/UserService.java`

**APIs (5):**
| # | API | Method | Endpoint |
|---|-----|--------|----------|
| 21 | Get Order by ID | GET | `/api/orders/{id}` |
| 22 | Update Order Status | PUT | `/api/orders/{id}/status` |
| 23 | Get Product Reviews | GET | `/api/products/{id}/reviews` |
| 24 | Add Review | POST | `/api/products/{id}/reviews` |
| 25 | Get Average Rating | GET | `/api/products/{id}/reviews/average` |

**Other:**
- Postman API documentation

---

## API Summary

| Member | API Count | API Numbers |
|--------|-----------|-------------|
| Ayush Patel | 5 | 1, 2, 3, 8, 15 |
| Naman Jindal | 5 | 4, 5, 10, 11, 13 |
| Sachin Singh Nain | 5 | 26, 27, 28, 29, 30 |
| Aryan Malik | 5 | 16, 17, 18, 19, 20 |
| Tanmay Dixit | 5 | 6, 7, 9, 12, 14 |
| Kabir Ahuja | 5 | 21, 22, 23, 24, 25 |

---

## Shared Components

These files are jointly maintained:
- `PrototypeApplication.java` - Main class
- `config/PasswordConfig.java`
- `config/WebConfig.java`
- `exception/` - Exception handlers
- `enums/` - Role, OrderStatus, PaymentMethod, PaymentStatus
- `util/` - Utility classes
