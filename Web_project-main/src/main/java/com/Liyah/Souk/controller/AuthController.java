package com.Liyah.Souk.controller;

import com.Liyah.Souk.model.UserModel;
import com.Liyah.Souk.repository.UserRepository;
import com.Liyah.Souk.request.LoginRequest;
import com.Liyah.Souk.request.RegisterRequest;
import com.Liyah.Souk.security.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());
        
        // 1) Find user by email
        Optional<UserModel> maybeUser = userRepository.findByEmail(loginRequest.getEmail());
        if (maybeUser.isEmpty()) {
            System.out.println("User not found with email: " + loginRequest.getEmail());
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        UserModel user = maybeUser.get();
        System.out.println("User found: " + user.getEmail() + ", Role: " + user.getRole());

        // 2) Compare password (using hashed comparison)
        boolean passwordMatch = PasswordEncoder.verifyPassword(loginRequest.getPassword(), user.getPassword());
        System.out.println("Password match: " + passwordMatch);
        
        if (!passwordMatch) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        // 3) Success → return role
        String role = user.getRole();  // e.g. "ADMIN" or "CUSTOMER"
        System.out.println("Login successful for role: " + role);
        return ResponseEntity
                .ok("Login successful as " + role);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        // 1) Check if user already exists
        Optional<UserModel> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity
                    .status(400)
                    .body("User with this email already exists");
        }

        // 2) Hash the password
        String hashedPassword = PasswordEncoder.hashPassword(registerRequest.getPassword());

        // 3) Create new user (always CUSTOMER role for registration form)
        UserModel newUser = new UserModel(
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                hashedPassword,
                "CUSTOMER", // Always CUSTOMER for registration form
                registerRequest.getFirstName(),
                registerRequest.getLastName(),
                registerRequest.getPhone()
        );

        // 4) Save user to database
        try {
            userRepository.save(newUser);
            return ResponseEntity
                    .ok("Registration successful! Please login with your credentials.");
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Registration failed: " + e.getMessage());
        }
    }





    @GetMapping("/users")
    public ResponseEntity<String> getAllUsers() {
        try {
            List<UserModel> users = userRepository.findAll();
            StringBuilder response = new StringBuilder("Users in database:\n");
            for (UserModel user : users) {
                response.append("ID: ").append(user.getId())
                        .append(", Email: ").append(user.getEmail())
                        .append(", Role: ").append(user.getRole())
                        .append(", Username: ").append(user.getUsername())
                        .append("\n");
            }
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching users: " + e.getMessage());
        }
    }
}
