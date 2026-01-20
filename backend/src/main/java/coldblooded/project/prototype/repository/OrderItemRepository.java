package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Find all items in an order
    List<OrderItem> findByOrderId(Long orderId);

    // Find items by product ID (to see order history of a product)
    List<OrderItem> findByProductId(Long productId);

    // Find items by product name (useful for reports)
    List<OrderItem> findByProductNameContainingIgnoreCase(String productName);

    // Count items in an order
    @Query("SELECT COUNT(oi) FROM OrderItem oi WHERE oi.order.id = :orderId")
    Long countItemsInOrder(@Param("orderId") Long orderId);

    // Get total quantity sold for a product
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.productId = :productId")
    Long getTotalQuantitySoldForProduct(@Param("productId") Long productId);

    // Delete all items in an order
    void deleteByOrderId(Long orderId);
}

