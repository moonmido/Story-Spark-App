package com.Story_Spark.story_spark.UserProfile.MyExceptions;

public class ProfileDosntExistException extends RuntimeException {
    public ProfileDosntExistException(String message) {
        super(message);
    }

  public ProfileDosntExistException() {
  }
}
