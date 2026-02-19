package coldblooded.project.prototype.controller;

import coldblooded.project.prototype.dto.review.ReviewRequestDto;
import coldblooded.project.prototype.dto.review.ReviewResponseDto;
import coldblooded.project.prototype.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Get all reviews for a product (PUBLIC)
    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getProductReviews(@PathVariable Long id) {
        try {
            List<ReviewResponseDto> reviews = reviewService.getProductReviews(id);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Add review for product (AUTHENTICATED)
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id,
                                      @RequestParam Long userId,
                                      @RequestBody ReviewRequestDto reviewRequest) {
        try {
            ReviewResponseDto review = reviewService.addReview(id, userId, reviewRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get average rating for product (PUBLIC)
    @GetMapping("/{id}/reviews/average")
    public ResponseEntity<?> getAverageRating(@PathVariable Long id) {
        try {
            Double average = reviewService.getAverageRating(id);
            return ResponseEntity.ok(average);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

