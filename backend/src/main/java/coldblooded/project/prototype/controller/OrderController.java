package coldblooded.project.prototype.controller;

import coldblooded.project.prototype.dto.order.OrderRequestDto;
import coldblooded.project.prototype.dto.order.OrderResponseDto;
import coldblooded.project.prototype.dto.order.UpdateOrderStatusDto;
import coldblooded.project.prototype.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Create order - checkout (AUTHENTICATED)
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestParam Long userId,
                                        @RequestBody OrderRequestDto orderRequest) {
        try {
            OrderResponseDto order = orderService.createOrderFromCart(userId, orderRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get user orders or admin list all orders
    @GetMapping
    public ResponseEntity<?> getOrders(@RequestParam Long userId,
                                      @RequestParam(required = false) Boolean isAdmin,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);

            // If admin, get all orders; otherwise get user's orders
            if (isAdmin != null && isAdmin) {
                Page<OrderResponseDto> orders = orderService.getAllOrders(pageable);
                return ResponseEntity.ok(orders);
            } else {
                Page<OrderResponseDto> orders = orderService.getUserOrders(userId, pageable);
                return ResponseEntity.ok(orders);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get order by ID - owner or admin (AUTHENTICATED)
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@RequestParam Long userId,
                                     @PathVariable Long id) {
        try {
            OrderResponseDto order = orderService.getOrder(userId, id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Update order status - admin only (ADMIN)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                               @RequestBody UpdateOrderStatusDto statusRequest) {
        try {
            OrderResponseDto order = orderService.adminUpdateStatus(id, statusRequest.getStatus());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

