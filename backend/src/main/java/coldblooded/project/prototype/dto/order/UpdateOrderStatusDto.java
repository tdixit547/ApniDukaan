package coldblooded.project.prototype.dto.order;

import coldblooded.project.prototype.enums.OrderStatus;

public class UpdateOrderStatusDto {

    private OrderStatus status;

    // Default constructor
    public UpdateOrderStatusDto() {
    }

    // Getters and Setters
    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}

