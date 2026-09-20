package com.sms.config;

import com.sms.entity.User;
import com.sms.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("No users found. Seeding default administrator account...");
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("admin123"),
                    "Administrator",
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
            log.info("Default administrator seeded: Username: 'admin' | Password: 'admin123'");
        }
    }
}
