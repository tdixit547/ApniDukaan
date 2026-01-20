package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.Order;
import coldblooded.project.prototype.enums.OrderStatus;
import coldblooded.project.prototype.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find order by order number
    Optional<Order> findByOrderNumber(String orderNumber);

    // Find orders by user ID with pagination
    Page<Order> findByUserId(Long userId, Pageable pageable);

    // Find orders by user ID without pagination
    List<Order> findByUserId(Long userId);

    // Find orders by status
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    // Find orders by user and status
    Page<Order> findByUserIdAndStatus(Long userId, OrderStatus status, Pageable pageable);

    // Find orders by payment status
    Page<Order> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);

    // Find recent orders for a user
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findRecentOrdersByUserId(@Param("userId") Long userId, Pageable pageable);

    // Check if order number exists
    boolean existsByOrderNumber(String orderNumber);

    // Count orders by user
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    Long countOrdersByUserId(@Param("userId") Long userId);

    // Find orders with items loaded
    @Query("SELECT o FROM Order o LEFT JOIN FETCH o.items WHERE o.id = :orderId")
    Optional<Order> findByIdWithItems(@Param("orderId") Long orderId);
}

