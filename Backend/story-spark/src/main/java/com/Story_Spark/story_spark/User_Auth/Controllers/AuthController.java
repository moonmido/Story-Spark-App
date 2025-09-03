package com.Story_Spark.story_spark.User_Auth.Controllers;

import com.Story_Spark.story_spark.User_Auth.Models.MyUser;
import com.Story_Spark.story_spark.User_Auth.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody MyUser myUser) {
        try {
            boolean success = authService.register(myUser);

            if (success) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(Map.of(
                                "success", true,
                                "message", "User registered successfully. Please check your email for verification.",
                                "username", myUser.getUsername()
                        ));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "success", false,
                                "message", "Registration failed. User may already exist."
                        ));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", "Invalid input: " + e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Internal server error occurred"
                    ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of(
                                "success", false,
                                "message", "Email is required"
                        ));
            }

            boolean success = authService.ResetPassword(email);

            if (success) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Password reset email sent successfully"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "success", false,
                                "message", "User not found with the provided email"
                        ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to send password reset email"
                    ));
        }
    }

    @DeleteMapping("/deactivate/{userId}")
    public ResponseEntity<Map<String, Object>> deactivateAccount(@PathVariable String userId) {
        try {
            authService.deactivateAccount(userId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Account deactivated successfully"
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of(
                            "success", false,
                            "message", "Invalid user ID"
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to deactivate account"
                    ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Auth service is running",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
