package coldblooded.project.prototype.service;

import coldblooded.project.prototype.dto.user.UpdateUserDto;
import coldblooded.project.prototype.dto.user.UserDto;
import coldblooded.project.prototype.entity.User;
import coldblooded.project.prototype.enums.Role;
import coldblooded.project.prototype.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get user by ID
    public UserDto getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return convertToDto(user);
    }

    // Get current user (used with authentication)
    public UserDto getCurrentUser(Long userId) {
        return getUserById(userId);
    }

    // Update user profile
    public UserDto updateProfile(Long id, UpdateUserDto updateDto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateDto.getFirstName() != null) {
            user.setFirstName(updateDto.getFirstName());
        }
        if (updateDto.getLastName() != null) {
            user.setLastName(updateDto.getLastName());
        }
        if (updateDto.getPhone() != null) {
            user.setPhone(updateDto.getPhone());
        }

        user = userRepository.save(user);

        return convertToDto(user);
    }

    // Get all users (admin function)
    public java.util.List<UserDto> getAllUsers() {

        java.util.List<User> users = userRepository.findAll();
        java.util.List<UserDto> userDtos = new java.util.ArrayList<>();

        for (User user : users) {
            userDtos.add(convertToDto(user));
        }

        return userDtos;
    }

    // Make user admin (utility function for development)
    public UserDto makeAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(Role.ADMIN);
        userRepository.save(user);

        return convertToDto(user);
    }

    // Delete user
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(userId);
    }

    // Change password - uses PasswordEncoder for secure comparison
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password using bcrypt comparison
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password length
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        // Hash and save new password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Helper method to convert User to DTO
    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setPhone(user.getPhone());
        userDto.setRole(user.getRole());
        return userDto;
    }
}
