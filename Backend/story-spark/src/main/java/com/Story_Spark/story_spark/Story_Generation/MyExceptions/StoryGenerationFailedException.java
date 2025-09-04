package com.Story_Spark.story_spark.Story_Generation.MyExceptions;

public class StoryGenerationFailedException extends RuntimeException {
    public StoryGenerationFailedException(String message) {
        super(message);
    }

  public StoryGenerationFailedException() {
  }
}
