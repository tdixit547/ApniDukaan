package coldblooded.project.prototype.dto.auth;

public class RegisterRequestDto {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String name; // Combined name from frontend
    private String phone;
    private String phoneNumber; // Alias for frontend compatibility
    private String address;

    // Default constructor
    public RegisterRequestDto() {
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        // If firstName is not set but name is, parse from name
        if (firstName == null && name != null) {
            String[] parts = name.trim().split("\\s+", 2);
            return parts[0];
        }
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        // If lastName is not set but name is, parse from name
        if (lastName == null && name != null) {
            String[] parts = name.trim().split("\\s+", 2);
            return parts.length > 1 ? parts[1] : "";
        }
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone != null ? phone : phoneNumber;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhoneNumber() {
        return phoneNumber != null ? phoneNumber : phone;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
