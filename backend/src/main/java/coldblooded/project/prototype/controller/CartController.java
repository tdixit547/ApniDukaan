package coldblooded.project.prototype.controller;

import coldblooded.project.prototype.dto.cart.AddToCartRequestDto;
import coldblooded.project.prototype.dto.cart.CartDto;
import coldblooded.project.prototype.dto.cart.CartItemDto;
import coldblooded.project.prototype.dto.cart.UpdateCartItemDto;
import coldblooded.project.prototype.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    // Get current user's cart (AUTHENTICATED)
    @GetMapping
    public ResponseEntity<?> getCart(@RequestParam Long userId) {
        try {
            CartDto cart = cartService.getCart(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Add item to cart (AUTHENTICATED)
    @PostMapping("/items")
    public ResponseEntity<?> addToCart(@RequestParam Long userId,
                                      @RequestBody AddToCartRequestDto addRequest) {
        try {
            CartItemDto item = cartService.addItem(userId,
                                                   addRequest.getProductId(),
                                                   addRequest.getQuantity());
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Update cart item quantity (AUTHENTICATED)
    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateCartItem(@RequestParam Long userId,
                                           @PathVariable Long id,
                                           @RequestBody UpdateCartItemDto updateRequest) {
        try {
            CartItemDto item = cartService.updateItem(userId, id, updateRequest.getQuantity());
            if (item == null) {
                return ResponseEntity.ok("Item removed from cart");
            }
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Remove item from cart (AUTHENTICATED)
    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> removeFromCart(@RequestParam Long userId,
                                           @PathVariable Long id) {
        try {
            cartService.removeItem(userId, id);
            return ResponseEntity.ok("Item removed from cart");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

