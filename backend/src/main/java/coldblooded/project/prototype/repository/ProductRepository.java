package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find products by category with pagination
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    // Find product by SKU
    Optional<Product> findBySku(String sku);

    // Pessimistic lock for stock updates (prevents overselling)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> lockByIdForUpdate(@Param("id") Long id);

    // Search products by name
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Find products within price range
    Page<Product> findByBasePriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Find products with stock greater than 0
    Page<Product> findByStockGreaterThan(Integer stock, Pageable pageable);

    // Find products by category and price range
    Page<Product> findByCategoryIdAndBasePriceBetween(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    // Search products by name and category
    Page<Product> findByNameContainingIgnoreCaseAndCategoryId(String name, Long categoryId, Pageable pageable);

    // Find all products in stock
    List<Product> findByStockGreaterThanEqual(Integer stock);

    // Check if SKU exists
    boolean existsBySku(String sku);
}

