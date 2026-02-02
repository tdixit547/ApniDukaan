package coldblooded.project.prototype.controller;

import coldblooded.project.prototype.dto.auth.AuthRequestDto;
import coldblooded.project.prototype.dto.auth.AuthResponseDto;
import coldblooded.project.prototype.dto.auth.RegisterRequestDto;
import coldblooded.project.prototype.dto.user.UserDto;
import coldblooded.project.prototype.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerRequest) {
        try {
            UserDto user = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDto loginRequest) {
        try {
            AuthResponseDto response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

