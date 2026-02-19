package coldblooded.project.prototype.service;

import coldblooded.project.prototype.dto.review.ReviewRequestDto;
import coldblooded.project.prototype.dto.review.ReviewResponseDto;
import coldblooded.project.prototype.entity.Product;
import coldblooded.project.prototype.entity.Review;
import coldblooded.project.prototype.entity.User;
import coldblooded.project.prototype.repository.ProductRepository;
import coldblooded.project.prototype.repository.ReviewRepository;
import coldblooded.project.prototype.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Add review for product
    public ReviewResponseDto addReview(Long productId, Long userId, ReviewRequestDto reviewRequest) {

        // Get product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user already reviewed this product
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("You have already reviewed this product");
        }

        // Validate rating (1-5)
        if (reviewRequest.getRating() < 1 || reviewRequest.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Create review
        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());

        // Save review
        review = reviewRepository.save(review);

        return convertToDto(review);
    }

    // Get all reviews for a product
    public List<ReviewResponseDto> getProductReviews(Long productId) {

        // Check if product exists
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }

        List<Review> reviews = reviewRepository.findByProductId(productId);

        // Convert to DTOs
        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get reviews with pagination
    public Page<ReviewResponseDto> getProductReviewsPaginated(Long productId, Pageable pageable) {

        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }

        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);

        return reviews.map(this::convertToDto);
    }

    // Get average rating for product
    public Double getAverageRating(Long productId) {

        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }

        Double average = reviewRepository.getAverageRatingForProduct(productId);

        return average != null ? average : 0.0;
    }

    // Get user's reviews
    public List<ReviewResponseDto> getUserReviews(Long userId) {

        List<Review> reviews = reviewRepository.findByUserId(userId);

        return reviews.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Delete review (user can delete own review)
    public void deleteReview(Long reviewId, Long userId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        // Check if review belongs to user
        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    // Helper method to convert Review to DTO
    private ReviewResponseDto convertToDto(Review review) {

        ReviewResponseDto dto = new ReviewResponseDto();
        dto.setId(review.getId());
        dto.setProductId(review.getProduct().getId());
        dto.setProductName(review.getProduct().getName());
        dto.setUserId(review.getUser().getId());

        // Set user name (first name + last name)
        String userName = review.getUser().getFirstName();
        if (review.getUser().getLastName() != null) {
            userName = userName + " " + review.getUser().getLastName();
        }
        dto.setUserName(userName);

        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());

        return dto;
    }
}

