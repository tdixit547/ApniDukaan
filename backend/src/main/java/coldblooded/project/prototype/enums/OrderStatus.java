package coldblooded.project.prototype.enums;

public enum OrderStatus {
    PLACED,      // Order created, payment pending
    CONFIRMED,   // Payment successful
    SHIPPED,     // Order dispatched
    DELIVERED,   // Final successful state
    CANCELLED    // Order cancelled by user/admin
}

