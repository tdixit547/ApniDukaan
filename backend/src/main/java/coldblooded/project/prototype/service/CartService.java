package coldblooded.project.prototype.service;

import coldblooded.project.prototype.dto.cart.CartDto;
import coldblooded.project.prototype.dto.cart.CartItemDto;
import coldblooded.project.prototype.entity.Cart;
import coldblooded.project.prototype.entity.CartItem;
import coldblooded.project.prototype.entity.Product;
import coldblooded.project.prototype.entity.User;
import coldblooded.project.prototype.repository.CartItemRepository;
import coldblooded.project.prototype.repository.CartRepository;
import coldblooded.project.prototype.repository.ProductRepository;
import coldblooded.project.prototype.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Get user's cart
    public CartDto getCart(Long userId) {

        // Get or create cart for user
        Cart cart = getOrCreateCart(userId);

        // Convert to DTO
        return convertToDto(cart);
    }

    // Add item to cart
    @Transactional
    public CartItemDto addItem(Long userId, Long productId, Integer quantity) {

        // Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // Get cart
        Cart cart = getOrCreateCart(userId);

        // Get product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId);

        CartItem cartItem;

        if (existingItem.isPresent()) {
            // Item exists, update quantity
            cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + quantity;

            // Check stock
            if (product.getStock() < newQuantity) {
                throw new RuntimeException("Not enough stock available");
            }

            cartItem.setQuantity(newQuantity);
        } else {
            // New item, create it
            // Check stock
            if (product.getStock() < quantity) {
                throw new RuntimeException("Not enough stock available");
            }

            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            // Save current price as snapshot
            cartItem.setUnitPrice(product.getFinalPrice());
        }

        // Save cart item
        cartItem = cartItemRepository.save(cartItem);

        return convertItemToDto(cartItem);
    }

    // Update cart item quantity
    @Transactional
    public CartItemDto updateItem(Long userId, Long cartItemId, Integer quantity) {

        // Get cart item
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify it belongs to user's cart
        Cart cart = getOrCreateCart(userId);
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        // If quantity is 0, remove item
        if (quantity == null || quantity == 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        // Validate quantity
        if (quantity < 0) {
            throw new RuntimeException("Quantity cannot be negative");
        }

        // Check stock
        Product product = cartItem.getProduct();
        if (product.getStock() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }

        // Update quantity
        cartItem.setQuantity(quantity);
        cartItem = cartItemRepository.save(cartItem);

        return convertItemToDto(cartItem);
    }

    // Remove item from cart
    @Transactional
    public void removeItem(Long userId, Long cartItemId) {

        // Get cart item
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Verify it belongs to user's cart
        Cart cart = getOrCreateCart(userId);
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        // Delete item
        cartItemRepository.delete(cartItem);
    }

    // Calculate cart total
    public BigDecimal getCartTotal(Long userId) {

        Cart cart = getOrCreateCart(userId);

        BigDecimal total = BigDecimal.ZERO;

        // Get all cart items
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        // Sum up all subtotals
        for (CartItem item : items) {
            BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(subtotal);
        }

        return total;
    }

    // Clear cart (useful after order placement)
    @Transactional
    public void clearCart(Long userId) {

        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
    }

    // Helper method to get or create cart
    private Cart getOrCreateCart(Long userId) {

        Optional<Cart> cartOpt = cartRepository.findByUserId(userId);

        if (cartOpt.isPresent()) {
            return cartOpt.get();
        }

        // Cart doesn't exist, create it
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    // Helper method to convert Cart to DTO
    private CartDto convertToDto(Cart cart) {

        CartDto dto = new CartDto();
        dto.setId(cart.getId());

        // Get all cart items
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDto> itemDtos = new ArrayList<>();

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : items) {
            CartItemDto itemDto = convertItemToDto(item);
            itemDtos.add(itemDto);
            total = total.add(itemDto.getSubtotal());
        }

        dto.setItems(itemDtos);
        dto.setTotalAmount(total);
        dto.setItemCount(items.size());

        return dto;
    }

    // Helper method to convert CartItem to DTO
    private CartItemDto convertItemToDto(CartItem item) {

        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());

        // Calculate subtotal
        BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        dto.setSubtotal(subtotal);

        // Add product image if available
        if (item.getProduct().getImagePath() != null) {
            dto.setProductImage(item.getProduct().getImagePath());
        }

        return dto;
    }
}

