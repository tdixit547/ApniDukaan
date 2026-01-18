package coldblooded.project.prototype.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(
    name = "reviews",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"product_id", "user_id"})
    }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Rating from 1 to 5 stars.
     * Validation should be enforced at service layer and/or database constraint.
     */
    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    // No-arg constructor
    public Review() {
    }

    // All-arg constructor
    public Review(Long id, Product product, User user, Integer rating, String comment, Instant createdAt) {
        this.id = id;
        this.product = product;
        this.user = user;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * Validate rating is within acceptable range (1-5).
     * @return true if valid
     */
    public boolean isValidRating() {
        return rating != null && rating >= 1 && rating <= 5;
    }
}
