package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Find cart item by cart ID and product ID
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    // Find all items in a cart
    List<CartItem> findByCartId(Long cartId);

    // Find items by product ID (useful for checking which carts have a product)
    List<CartItem> findByProductId(Long productId);

    // Delete all items in a cart
    void deleteByCartId(Long cartId);

    // Delete specific item from cart
    void deleteByCartIdAndProductId(Long cartId, Long productId);

    // Count items in cart
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.cart.id = :cartId")
    Long countItemsInCart(@Param("cartId") Long cartId);

    // Check if product exists in cart
    boolean existsByCartIdAndProductId(Long cartId, Long productId);
}

