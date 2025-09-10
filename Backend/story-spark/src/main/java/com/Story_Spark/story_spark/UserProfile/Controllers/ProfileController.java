package com.Story_Spark.story_spark.UserProfile.Controllers;

import com.Story_Spark.story_spark.UserProfile.Inputs.UserDetails;
import com.Story_Spark.story_spark.UserProfile.Models.MyProfile;
import com.Story_Spark.story_spark.UserProfile.MyExceptions.ProfileDosntExistException;
import com.Story_Spark.story_spark.UserProfile.Services.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /**
     * Create a new user profile
     * POST /api/profile/{userId}
     */
    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createProfile(
            @PathVariable String userId,
            @RequestBody UserDetails userDetails) {
        try {
            MyProfile createdProfile = profileService.CreateProfile(userDetails, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid input: User details cannot be null");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating profile: " + e.getMessage());
        }
    }

    /**
     * Get user profile by userId
     * GET /api/profile/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable String userId) {
        try {
            MyProfile profile = profileService.GetProfileStatus(userId);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid input: User ID cannot be null");
        } catch (ProfileDosntExistException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Profile not found for user: " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving profile: " + e.getMessage());
        }
    }

    /**
     * Update user profile
     * PUT /api/profile/{userId}
     */
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(
            @PathVariable String userId,
            @RequestBody UserDetails userDetails) {
        try {
            boolean updated = profileService.updateProfile(userId, userDetails);
            if (updated) {
                return ResponseEntity.ok("Profile updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Profile not found for user: " + userId);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid input: User ID cannot be null");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating profile: " + e.getMessage());
        }
    }

    /**
     * Change user's preferred language
     * PATCH /api/profile/{userId}/language
     */
    @PatchMapping("/{userId}/language")
    public ResponseEntity<?> changeLanguage(
            @PathVariable String userId,
            @RequestParam String languageRequest) {
        try {
            boolean updated = profileService.ChangeLanguage(userId,languageRequest);
            if (updated) {
                return ResponseEntity.ok("Language updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Profile not found for user: " + userId);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid input: User ID and language cannot be null");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating language: " + e.getMessage());
        }
    }

}
