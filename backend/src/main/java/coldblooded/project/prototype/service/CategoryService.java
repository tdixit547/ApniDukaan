package coldblooded.project.prototype.service;

import coldblooded.project.prototype.dto.category.CategoryDto;
import coldblooded.project.prototype.dto.category.CategoryRequestDto;
import coldblooded.project.prototype.entity.Category;
import coldblooded.project.prototype.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Create new category
    public CategoryDto createCategory(CategoryRequestDto categoryRequest) {

        // Check if category name already exists
        if (categoryRepository.existsByName(categoryRequest.getName())) {
            throw new RuntimeException("Category with this name already exists");
        }

        // Create category
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());

        // Generate slug from name
        category.setSlug(generateSlug(categoryRequest.getName()));

        // Save category
        category = categoryRepository.save(category);

        return convertToDto(category);
    }

    // Get all categories
    public List<CategoryDto> getAllCategories() {

        List<Category> categories = categoryRepository.findAll();

        // Convert to DTOs
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Get category by ID
    public CategoryDto getCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return convertToDto(category);
    }

    // Get category by slug
    public CategoryDto getCategoryBySlug(String slug) {

        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return convertToDto(category);
    }

    // Update category
    public CategoryDto updateCategory(Long id, CategoryRequestDto categoryRequest) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Update fields
        if (categoryRequest.getName() != null) {
            // Check if new name is unique
            if (!category.getName().equals(categoryRequest.getName()) &&
                categoryRepository.existsByName(categoryRequest.getName())) {
                throw new RuntimeException("Category with this name already exists");
            }
            category.setName(categoryRequest.getName());
            category.setSlug(generateSlug(categoryRequest.getName()));
        }

        if (categoryRequest.getDescription() != null) {
            category.setDescription(categoryRequest.getDescription());
        }

        // Save updated category
        category = categoryRepository.save(category);

        return convertToDto(category);
    }

    // Delete category
    public void deleteCategory(Long id) {

        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found");
        }

        categoryRepository.deleteById(id);
    }

    // Helper method to generate slug from name
    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll(" ", "-")
                .replaceAll("[^a-z0-9-]", "");
    }

    // Helper method to convert Category to DTO
    private CategoryDto convertToDto(Category category) {

        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setSlug(category.getSlug());
        dto.setDescription(category.getDescription());

        return dto;
    }
}

