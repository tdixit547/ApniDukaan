package coldblooded.project.prototype.service;

import coldblooded.project.prototype.dto.order.OrderItemDto;
import coldblooded.project.prototype.dto.order.OrderRequestDto;
import coldblooded.project.prototype.dto.order.OrderResponseDto;
import coldblooded.project.prototype.entity.*;
import coldblooded.project.prototype.enums.OrderStatus;
import coldblooded.project.prototype.enums.PaymentStatus;
import coldblooded.project.prototype.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Create order from cart
    @Transactional
    public OrderResponseDto createOrderFromCart(Long userId, OrderRequestDto orderRequest) {

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get cart
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Get all cart items
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Validate stock and lock products
        for (CartItem cartItem : cartItems) {
            Product product = productRepository.lockByIdForUpdate(cartItem.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Check if enough stock available
            if (product.getStock() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
        }

        // Deduct stock from products
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            int newStock = product.getStock() - cartItem.getQuantity();
            product.setStock(newStock);
            productRepository.save(product);
        }

        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            BigDecimal itemTotal = cartItem.getUnitPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PLACED);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setPaymentStatus(PaymentStatus.PENDING);

        // Save order first to get ID
        order = orderRepository.save(order);

        // Create order items from cart items (snapshots)
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(cartItem.getProduct().getId());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setQuantity(cartItem.getQuantity());

            // Calculate subtotal
            BigDecimal subtotal = cartItem.getUnitPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            orderItem.setSubtotal(subtotal);

            orderItems.add(orderItem);
        }

        // Save all order items
        orderItemRepository.saveAll(orderItems);

        // Mock payment processing
        boolean paymentSuccess = processPayment(order);

        if (paymentSuccess) {
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            order.setStatus(OrderStatus.CONFIRMED);
        } else {
            order.setPaymentStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.CANCELLED);
            throw new RuntimeException("Payment failed");
        }

        // Save order with updated payment status
        order = orderRepository.save(order);

        // Clear cart after successful order
        cartItemRepository.deleteByCartId(cart.getId());

        // Convert to DTO and return
        return convertToDto(order, orderItems);
    }

    // Get order by ID
    public OrderResponseDto getOrder(Long userId, Long orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Check if order belongs to user
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Order does not belong to this user");
        }

        // Get order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);

        return convertToDto(order, orderItems);
    }

    // Get all orders for user
    public Page<OrderResponseDto> getUserOrders(Long userId, Pageable pageable) {

        Page<Order> orders = orderRepository.findByUserId(userId, pageable);

        // Convert to DTOs
        return orders.map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return convertToDto(order, items);
        });
    }

    // Admin: Update order status
    @Transactional
    public OrderResponseDto adminUpdateStatus(Long orderId, OrderStatus newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Validate status transition
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot update order in final state");
        }

        // Update status
        order.setStatus(newStatus);
        order = orderRepository.save(order);

        // Get order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);

        return convertToDto(order, orderItems);
    }

    // Admin: Get all orders
    public Page<OrderResponseDto> getAllOrders(Pageable pageable) {

        Page<Order> orders = orderRepository.findAll(pageable);

        return orders.map(order -> {
            List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
            return convertToDto(order, items);
        });
    }

    // Helper method to generate unique order number
    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "ORD-" + timestamp;
    }

    // Mock payment processing
    private boolean processPayment(Order order) {
        // In real app, integrate with payment gateway
        // For now, always return true (payment success)
        return true;
    }

    // Helper method to convert Order to DTO
    private OrderResponseDto convertToDto(Order order, List<OrderItem> orderItems) {

        OrderResponseDto dto = new OrderResponseDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setCreatedAt(order.getCreatedAt());

        // Convert order items
        List<OrderItemDto> itemDtos = new ArrayList<>();
        for (OrderItem item : orderItems) {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setId(item.getId());
            itemDto.setProductId(item.getProductId());
            itemDto.setProductName(item.getProductName());
            itemDto.setUnitPrice(item.getUnitPrice());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setSubtotal(item.getSubtotal());
            itemDtos.add(itemDto);
        }

        dto.setItems(itemDtos);

        return dto;
    }
}

