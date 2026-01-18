package coldblooded.project.prototype.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, length = 64)
    private String sku;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(precision = 5, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(length = 500)
    private String imagePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Version
    private Long version;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    // No-arg constructor
    public Product() {
        this.tax = BigDecimal.ZERO;
        this.discount = BigDecimal.ZERO;
        this.stock = 0;
    }

    // All-arg constructor
    public Product(Long id, String sku, String name, String description, BigDecimal basePrice,
                   BigDecimal tax, BigDecimal discount, Integer stock, String imagePath,
                   Category category, Long version, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
        this.tax = tax != null ? tax : BigDecimal.ZERO;
        this.discount = discount != null ? discount : BigDecimal.ZERO;
        this.stock = stock != null ? stock : 0;
        this.imagePath = imagePath;
        this.category = category;
        this.version = version;
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

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
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
     * Calculates final price with discount and tax applied.
     * Formula: basePrice * (1 - discount/100) * (1 + tax/100)
     *
     * Example: basePrice=1000, discount=10%, tax=18%
     * Result: 1000 * 0.90 * 1.18 = 1062.00
     *
     * @return final price with 2 decimal precision
     */
    public BigDecimal getFinalPrice() {
        if (basePrice == null) {
            return BigDecimal.ZERO;
        }

        // Create constants
        BigDecimal hundred = new BigDecimal("100");
        BigDecimal one = BigDecimal.ONE;

        // Calculate discount multiplier: (1 - discount/100)
        BigDecimal discountMultiplier = one.subtract(
            (discount != null ? discount : BigDecimal.ZERO).divide(hundred, 4, RoundingMode.HALF_UP)
        );

        // Calculate tax multiplier: (1 + tax/100)
        BigDecimal taxMultiplier = one.add(
            (tax != null ? tax : BigDecimal.ZERO).divide(hundred, 4, RoundingMode.HALF_UP)
        );

        // Calculate final price: basePrice * discountMultiplier * taxMultiplier
        return basePrice
            .multiply(discountMultiplier)
            .multiply(taxMultiplier)
            .setScale(2, RoundingMode.HALF_UP);
    }
}
