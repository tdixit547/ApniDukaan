package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Find reviews by product ID with pagination
    Page<Review> findByProductId(Long productId, Pageable pageable);

    // Find reviews by product ID without pagination
    List<Review> findByProductId(Long productId);

    // Find reviews by user ID
    List<Review> findByUserId(Long userId);

    // Find review by product and user (to check if user already reviewed)
    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);

    // Check if user already reviewed a product
    boolean existsByProductIdAndUserId(Long productId, Long userId);

    // Find reviews by rating
    List<Review> findByRating(Integer rating);

    // Find reviews by product and rating
    Page<Review> findByProductIdAndRating(Long productId, Integer rating, Pageable pageable);

    // Calculate average rating for a product
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingForProduct(@Param("productId") Long productId);

    // Count reviews for a product
    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.id = :productId")
    Long countReviewsForProduct(@Param("productId") Long productId);

    // Find recent reviews for a product
    @Query("SELECT r FROM Review r WHERE r.product.id = :productId ORDER BY r.createdAt DESC")
    List<Review> findRecentReviewsByProductId(@Param("productId") Long productId, Pageable pageable);

    // Delete reviews by product ID
    void deleteByProductId(Long productId);

    // Delete reviews by user ID
    void deleteByUserId(Long userId);
}

