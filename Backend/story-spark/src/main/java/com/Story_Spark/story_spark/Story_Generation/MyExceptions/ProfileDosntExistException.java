package com.Story_Spark.story_spark.Story_Generation.MyExceptions;

public class ProfileDosntExistException extends RuntimeException {
    public ProfileDosntExistException(String message) {
        super(message);
    }

  public ProfileDosntExistException() {
  }
}
