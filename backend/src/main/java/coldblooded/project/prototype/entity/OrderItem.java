package coldblooded.project.prototype.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /**
     * Snapshot of product ID at time of order.
     * Stored separately in case product is deleted later.
     */
    @Column(nullable = false)
    private Long productId;

    /**
     * Snapshot of product name at time of order.
     * Ensures order history remains accurate even if product is renamed/deleted.
     */
    @Column(nullable = false, length = 255)
    private String productName;

    /**
     * Snapshot of product price at time of order.
     * Includes tax and discount calculations.
     */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantity;

    /**
     * Pre-calculated subtotal: unitPrice * quantity
     * Stored for performance and accuracy.
     */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    // No-arg constructor
    public OrderItem() {
    }

    // All-arg constructor
    public OrderItem(Long id, Order order, Long productId, String productName, BigDecimal unitPrice,
                     Integer quantity, BigDecimal subtotal, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.order = order;
        this.productId = productId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.subtotal = subtotal;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Calculate and set subtotal based on unitPrice and quantity.
     * Call this before persisting OrderItem.
     */
    public void calculateSubtotal() {
        if (unitPrice != null && quantity != null) {
            this.subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        } else {
            this.subtotal = BigDecimal.ZERO;
        }
    }

    /**
     * Get subtotal value.
     * @return subtotal (unitPrice * quantity)
     */
    public BigDecimal getSubtotal() {
        if (subtotal == null) {
            calculateSubtotal();
        }
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
