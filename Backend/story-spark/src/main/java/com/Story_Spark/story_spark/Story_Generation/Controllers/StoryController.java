package com.Story_Spark.story_spark.Story_Generation.Controllers;

import com.Story_Spark.story_spark.Story_Generation.Models.MyStory;
import com.Story_Spark.story_spark.Story_Generation.Models.StoryDetails;
import com.Story_Spark.story_spark.Story_Generation.Outputs.GeneratedStory;
import com.Story_Spark.story_spark.Story_Generation.Services.StoryService;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.ContentNotValideException;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.SavingNewStoryOnDBFailedException;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.StoryGenerationFailedException;
import com.Story_Spark.story_spark.User_Auth.MyExceptions.EmailNotVerifiedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryService storyService;

    @Autowired
    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    /**
     * Endpoint to create a new story.
     * @param userId The ID of the user creating the story.
     * @param storyDetails The details of the story to create.
     * @return The generated story.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createStory(
            @RequestParam String userId,
            @RequestBody StoryDetails storyDetails) {
        try {
            GeneratedStory generatedStory = storyService.createStory(userId, storyDetails);
            return ResponseEntity.ok(generatedStory);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("User  ID and story details must be provided.");
        } catch (StoryGenerationFailedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Story generation failed.");
        } catch (ContentNotValideException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Generated story content is not valid.");
        }
        catch (EmailNotVerifiedException em) {
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("We need to verify your account first ,Please check your email");
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }


    @GetMapping("/get-story")
    public ResponseEntity<?> GetStories(@RequestParam String userId){
        try {
            return ResponseEntity.ok(storyService.GetAllStories(userId));
        } catch (IllegalArgumentException i) {
   return ResponseEntity.badRequest().body("userId is null = "+i);
        }
     catch (ContentNotValideException c) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empty List");
    }
        catch (EmailNotVerifiedException em) {
            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body("We need to verify your account first ,Please check your email");
        }
        catch (Exception e) {
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error");
    }
    }



}
