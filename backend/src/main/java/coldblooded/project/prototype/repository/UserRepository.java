package coldblooded.project.prototype.repository;

import coldblooded.project.prototype.entity.User;
import coldblooded.project.prototype.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used for login and registration)
    Optional<User> findByEmail(String email);

    // Check if email already exists
    boolean existsByEmail(String email);

    // Find all users by role (admin functionality)
    List<User> findByRole(Role role);

    // Find users by first name (search functionality)
    List<User> findByFirstNameContainingIgnoreCase(String firstName);

    // Find users by last name
    List<User> findByLastNameContainingIgnoreCase(String lastName);
}

