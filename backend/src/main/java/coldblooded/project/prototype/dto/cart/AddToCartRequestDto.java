package coldblooded.project.prototype.dto.cart;

public class AddToCartRequestDto {

    private Long productId;
    private Integer quantity;

    // Default constructor
    public AddToCartRequestDto() {
        this.quantity = 1;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

