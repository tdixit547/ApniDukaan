package coldblooded.project.prototype.service;

import coldblooded.project.prototype.dto.auth.AuthRequestDto;
import coldblooded.project.prototype.dto.auth.AuthResponseDto;
import coldblooded.project.prototype.dto.auth.RegisterRequestDto;
import coldblooded.project.prototype.dto.user.UserDto;
import coldblooded.project.prototype.entity.Cart;
import coldblooded.project.prototype.entity.User;
import coldblooded.project.prototype.enums.Role;
import coldblooded.project.prototype.repository.CartRepository;
import coldblooded.project.prototype.repository.UserRepository;
import coldblooded.project.prototype.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Register new user
    @Transactional
    public UserDto register(RegisterRequestDto registerDto) {

        // Check if email already exists
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setEmail(registerDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerDto.getPassword()));
        user.setFirstName(registerDto.getFirstName());
        user.setLastName(registerDto.getLastName());
        user.setPhone(registerDto.getPhone());
        user.setRole(Role.CUSTOMER);

        // Save user to database
        user = userRepository.save(user);

        // Create cart for user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        // Convert to DTO and return
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setPhone(user.getPhone());
        userDto.setRole(user.getRole());

        return userDto;
    }

    // Login user
    public AuthResponseDto login(AuthRequestDto authRequest) {

        // Find user by email
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check password
        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate token
        String token = generateToken(user);

        // Create UserDto for response
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setPhone(user.getPhone());
        userDto.setRole(user.getRole());

        // Create response with user data
        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setTokenType("Bearer");
        response.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        response.setUser(userDto);

        return response;
    }

    // Helper method to generate token
    private String generateToken(User user) {
        return jwtTokenProvider.generateToken(user.getEmail());
    }
}
