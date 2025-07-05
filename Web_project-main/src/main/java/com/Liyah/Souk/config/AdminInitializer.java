package com.Liyah.Souk.config;

import com.Liyah.Souk.model.UserModel;
import com.Liyah.Souk.repository.UserRepository;
import com.Liyah.Souk.security.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin if it doesn't exist
        createDefaultAdmin();
    }

    private void createDefaultAdmin() {
        // Check if admin already exists
        Optional<UserModel> existingAdmin = userRepository.findByEmail("admin@souk.com");
        
        if (existingAdmin.isEmpty()) {
            // Create default admin user
            String hashedPassword = PasswordEncoder.hashPassword("admin123");
            UserModel adminUser = new UserModel(
                    "admin",
                    "admin@souk.com",
                    hashedPassword,
                    "ADMIN",
                    "System",
                    "Administrator",
                    "1234567890"
            );

            try {
                userRepository.save(adminUser);
                System.out.println("✅ Default admin user created successfully!");
                System.out.println("📧 Email: admin@souk.com");
                System.out.println("🔑 Password: admin123");
                System.out.println("👤 Role: ADMIN");
            } catch (Exception e) {
                System.err.println("❌ Failed to create default admin: " + e.getMessage());
            }
        } else {
            System.out.println("ℹ️  Admin user already exists in database");
        }
    }
} 