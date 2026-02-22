package coldblooded.project.prototype.controller;

import coldblooded.project.prototype.dto.user.UpdateUserDto;
import coldblooded.project.prototype.dto.user.UserDto;
import coldblooded.project.prototype.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Get current user profile
    // For now, using userId from path parameter (will be from JWT token later)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam Long userId) {
        try {
            UserDto user = userService.getCurrentUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update user profile
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestParam Long userId,
            @RequestBody UpdateUserDto updateRequest) {
        try {
            UserDto user = userService.updateProfile(userId, updateRequest);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user by ID (admin or self)
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserDto user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all users (admin only)
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Make user admin (utility endpoint - for development only)
    @PostMapping("/{id}/make-admin")
    public ResponseEntity<?> makeAdmin(@PathVariable Long id) {
        try {
            UserDto user = userService.makeAdmin(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Change password
    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> passwordRequest) {
        try {
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");
            userService.changePassword(id, currentPassword, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete user (ban)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
