package coldblooded.project.prototype.dto.category;

public class CategoryRequestDto {

    private String name;
    private String description;

    // Default constructor
    public CategoryRequestDto() {
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

