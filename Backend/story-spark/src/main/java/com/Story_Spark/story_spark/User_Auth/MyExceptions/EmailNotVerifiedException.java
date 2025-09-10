package com.Story_Spark.story_spark.User_Auth.MyExceptions;

public class EmailNotVerifiedException extends RuntimeException {
    public EmailNotVerifiedException(String message) {
        super(message);
    }

  public EmailNotVerifiedException() {
  }
}
