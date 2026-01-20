package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find category by slug (URL-friendly identifier)
    Optional<Category> findBySlug(String slug);

    // Find category by name
    Optional<Category> findByName(String name);

    // Check if category name already exists
    boolean existsByName(String name);

    // Check if slug already exists
    boolean existsBySlug(String slug);

    // Find categories by name containing search term
    List<Category> findByNameContainingIgnoreCase(String name);
}

