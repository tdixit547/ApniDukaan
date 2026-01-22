package coldblooded.project.prototype.dto.auth;

import coldblooded.project.prototype.dto.user.UserDto;
import java.time.Instant;

public class AuthResponseDto {

    private String token;
    private String tokenType;
    private Instant expiresAt;
    private UserDto user;

    // Default constructor
    public AuthResponseDto() {
        this.tokenType = "Bearer";
    }

    // Constructor with fields
    public AuthResponseDto(String token, String tokenType, Instant expiresAt, UserDto user) {
        this.token = token;
        this.tokenType = tokenType;
        this.expiresAt = expiresAt;
        this.user = user;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
