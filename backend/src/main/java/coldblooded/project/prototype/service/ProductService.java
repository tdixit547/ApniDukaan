package coldblooded.project.prototype.service;

import coldblooded.project.prototype.dto.product.ProductCreateDto;
import coldblooded.project.prototype.dto.product.ProductResponseDto;
import coldblooded.project.prototype.dto.product.ProductUpdateDto;
import coldblooded.project.prototype.entity.Category;
import coldblooded.project.prototype.entity.Product;
import coldblooded.project.prototype.repository.CategoryRepository;
import coldblooded.project.prototype.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Create new product
    public ProductResponseDto createProduct(ProductCreateDto productDto) {

        // Check if category exists
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // Check if SKU already exists
        if (productDto.getSku() != null && productRepository.existsBySku(productDto.getSku())) {
            throw new RuntimeException("SKU already exists");
        }

        // Create product
        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setSku(productDto.getSku());
        product.setBasePrice(productDto.getBasePrice());
        product.setTax(productDto.getTax() != null ? productDto.getTax() : BigDecimal.ZERO);
        product.setDiscount(productDto.getDiscount() != null ? productDto.getDiscount() : BigDecimal.ZERO);
        product.setStock(productDto.getStock() != null ? productDto.getStock() : 0);
        product.setCategory(category);

        // Save product
        product = productRepository.save(product);

        // Convert to DTO and return
        return convertToDto(product);
    }

    // Get all products with pagination
    public Page<ProductResponseDto> listProducts(Pageable pageable) {

        Page<Product> products = productRepository.findAll(pageable);

        // Convert each product to DTO
        return products.map(this::convertToDto);
    }

    // Get products by category
    public Page<ProductResponseDto> listProductsByCategory(Long categoryId, Pageable pageable) {

        Page<Product> products = productRepository.findByCategoryId(categoryId, pageable);

        return products.map(this::convertToDto);
    }

    // Search products by name
    public Page<ProductResponseDto> searchProducts(String searchTerm, Pageable pageable) {

        Page<Product> products = productRepository.findByNameContainingIgnoreCase(searchTerm, pageable);

        return products.map(this::convertToDto);
    }

    // Get single product by ID
    public ProductResponseDto getProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return convertToDto(product);
    }

    // Update product
    public ProductResponseDto updateProduct(Long id, ProductUpdateDto updateDto) {

        // Find product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update fields if provided
        if (updateDto.getName() != null) {
            product.setName(updateDto.getName());
        }
        if (updateDto.getDescription() != null) {
            product.setDescription(updateDto.getDescription());
        }
        if (updateDto.getBasePrice() != null) {
            product.setBasePrice(updateDto.getBasePrice());
        }
        if (updateDto.getTax() != null) {
            product.setTax(updateDto.getTax());
        }
        if (updateDto.getDiscount() != null) {
            product.setDiscount(updateDto.getDiscount());
        }
        if (updateDto.getStock() != null) {
            product.setStock(updateDto.getStock());
        }
        if (updateDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(updateDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        if (updateDto.getImagePath() != null) {
            product.setImagePath(updateDto.getImagePath());
        }

        // Save updated product
        product = productRepository.save(product);

        return convertToDto(product);
    }

    // Delete product
    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }

        productRepository.deleteById(id);
    }

    // Helper method to convert Product entity to DTO
    private ProductResponseDto convertToDto(Product product) {

        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setSku(product.getSku());
        dto.setBasePrice(product.getBasePrice());
        dto.setTax(product.getTax());
        dto.setDiscount(product.getDiscount());

        // Calculate final price using entity method
        dto.setFinalPrice(product.getFinalPrice());

        dto.setStock(product.getStock());
        dto.setImageUrl(product.getImagePath());

        // Add category info if available
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }

        return dto;
    }

    // Restore stock for all products (utility method)
    public void restoreAllStock(int quantity) {
        java.util.List<Product> allProducts = productRepository.findAll();
        for (Product product : allProducts) {
            product.setStock(quantity);
            productRepository.save(product);
        }
    }
}
