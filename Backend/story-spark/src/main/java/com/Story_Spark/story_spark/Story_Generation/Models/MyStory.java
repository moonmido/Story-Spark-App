package com.Story_Spark.story_spark.Story_Generation.Models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class MyStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long storyId;



    private String userId;
    private String characterType;
    private String characterName;
    private String story;
    private String storyTitle;
    private String storyWorld;
    private String storyLanguage;
    private Date CreatedAt;

    public MyStory(String userId, String characterType, String characterName, String story, String storyTitle, Date createdAt, String storyWorld, String storyLanguage) {
        this.userId = userId;
        this.characterType = characterType;
        this.characterName = characterName;
        this.story = story;
        this.storyTitle = storyTitle;
        CreatedAt = createdAt;
        this.storyWorld = storyWorld;
        this.storyLanguage = storyLanguage;
    }
    public MyStory() {
    }
    public Long getStoryId() {
        return storyId;
    }

    public void setStoryId(Long storyId) {
        this.storyId = storyId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCharacterType() {
        return characterType;
    }

    public void setCharacterType(String characterType) {
        this.characterType = characterType;
    }

    public String getCharacterName() {
        return characterName;
    }

    public void setCharacterName(String characterName) {
        this.characterName = characterName;
    }

    public String getStory() {
        return story;
    }

    public void setStory(String story) {
        this.story = story;
    }

    public String getStoryTitle() {
        return storyTitle;
    }

    public void setStoryTitle(String storyTitle) {
        this.storyTitle = storyTitle;
    }

    public String getStoryLanguage() {
        return storyLanguage;
    }

    public void setStoryLanguage(String storyLanguage) {
        this.storyLanguage = storyLanguage;
    }

    public String getStoryWorld() {
        return storyWorld;
    }

    public void setStoryWorld(String storyWorld) {
        this.storyWorld = storyWorld;
    }

    public Date getCreatedAt() {
        return CreatedAt;
    }

    public void setCreatedAt(Date createdAt) {
        CreatedAt = createdAt;
    }
}
