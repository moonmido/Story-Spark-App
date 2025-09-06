package com.Story_Spark.story_spark.Story_Generation.Outputs;

import java.util.List;
import java.util.Map;

public class GeneratedStory {

    private String storyTitle;
    private String story;
    private List<Question> questions;

    public String getStoryTitle() {
        return storyTitle;
    }

    public void setStoryTitle(String storyTitle) {
        this.storyTitle = storyTitle;
    }

    public String getStory() {
        return story;
    }

    public void setStory(String story) {
        this.story = story;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}
