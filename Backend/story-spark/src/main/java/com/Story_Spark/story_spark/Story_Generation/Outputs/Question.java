package com.Story_Spark.story_spark.Story_Generation.Outputs;

import java.util.List;

public class Question {
    private String id;
    private String title;
    private String question;
    private List<Option> options;

    public Question() {}

    public Question(String id, String title, String question, List<Option> options) {
        this.id = id;
        this.title = title;
        this.question = question;
        this.options = options;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public List<Option> getOptions() { return options; }
    public void setOptions(List<Option> options) { this.options = options; }
}

