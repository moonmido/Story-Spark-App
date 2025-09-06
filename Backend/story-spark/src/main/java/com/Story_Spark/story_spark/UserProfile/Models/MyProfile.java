package com.Story_Spark.story_spark.UserProfile.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class MyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    private String userId;
    private String email;
    private String firstname;
    private String lastname;
    private String preferredLanguage = "English";
    private Long totalStories;


    public MyProfile() {
    }

    public MyProfile( String userId, String email, String firstname, String lastname, String preferredLanguage, Long totalStories) {
        this.userId = userId;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.preferredLanguage = preferredLanguage;
        this.totalStories = totalStories;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public Long getTotalStories() {
        return totalStories;
    }

    public void setTotalStories(Long totalStories) {
        this.totalStories = totalStories;
    }
}
