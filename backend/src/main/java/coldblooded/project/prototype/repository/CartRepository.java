package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Find cart by user ID
    Optional<Cart> findByUserId(Long userId);

    // Check if cart exists for user
    boolean existsByUserId(Long userId);

    // Find cart with items loaded (fetch join to avoid lazy loading issues)
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.user.id = :userId")
    Optional<Cart> findByUserIdWithItems(@Param("userId") Long userId);

    // Delete cart by user ID
    void deleteByUserId(Long userId);
}

