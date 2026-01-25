package coldblooded.project.prototype.config;

import org.springframework.stereotype.Component;

@Component
public class JwtProperties {
    // Secret key for signing JWTs (should be stored securely in env vars in prod)
    // This is a Base64 encoded 256-bit key
    private String secretKey = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    // Token expiration: 24 hours
    private long expiration = 86400000;

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }
}
