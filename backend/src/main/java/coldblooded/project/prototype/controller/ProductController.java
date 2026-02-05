package coldblooded.project.prototype.controller;

import coldblooded.project.prototype.dto.product.ProductCreateDto;
import coldblooded.project.prototype.dto.product.ProductResponseDto;
import coldblooded.project.prototype.dto.product.ProductUpdateDto;
import coldblooded.project.prototype.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Get all products with pagination (PUBLIC)
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductResponseDto> products = productService.listProducts(pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get product by ID (PUBLIC)
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        try {
            ProductResponseDto product = productService.getProduct(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Get products by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductResponseDto> products = productService.listProductsByCategory(categoryId, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Search products by name
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ProductResponseDto> products = productService.searchProducts(query, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Create product (ADMIN ONLY)
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateDto productRequest) {
        try {
            ProductResponseDto product = productService.createProduct(productRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Update product (ADMIN ONLY)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
            @RequestBody ProductUpdateDto productRequest) {
        try {
            ProductResponseDto product = productService.updateProduct(id, productRequest);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Delete product (ADMIN ONLY)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Restore stock for all products (ADMIN UTILITY)
    @PostMapping("/restore-stock")
    public ResponseEntity<?> restoreStock(@RequestParam(defaultValue = "50") int quantity) {
        try {
            productService.restoreAllStock(quantity);
            return ResponseEntity.ok("Stock restored to " + quantity + " for all products");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
