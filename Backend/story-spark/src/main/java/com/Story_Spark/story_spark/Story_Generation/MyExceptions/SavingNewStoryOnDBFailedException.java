package com.Story_Spark.story_spark.Story_Generation.MyExceptions;

public class SavingNewStoryOnDBFailedException extends RuntimeException {
    public SavingNewStoryOnDBFailedException(String message) {
        super(message);
    }

  public SavingNewStoryOnDBFailedException() {
  }

    public SavingNewStoryOnDBFailedException(String failedToSaveStory, Exception e) {
    }
}
