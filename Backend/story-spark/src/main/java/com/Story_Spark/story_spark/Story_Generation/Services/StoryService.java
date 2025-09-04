package com.Story_Spark.story_spark.Story_Generation.Services;

import com.Story_Spark.story_spark.Story_Generation.Models.MyStory;
import com.Story_Spark.story_spark.Story_Generation.Models.StoryDetails;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.ContentNotValideException;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.SavingNewStoryOnDBFailedException;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.StoryGenerationFailedException;
import com.Story_Spark.story_spark.Story_Generation.Outputs.GeneratedStory;
import com.Story_Spark.story_spark.Story_Generation.Prompts.GenerationSysPrompt;
import com.Story_Spark.story_spark.Story_Generation.Prompts.ValidatingStoryContentPrompt;
import com.Story_Spark.story_spark.Story_Generation.Repositories.MyStoryRepo;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.EmptyStackException;

@Service
public class StoryService {

    @Autowired
    private MyStoryRepo repo;

    private final ChatClient chatClient;

    public StoryService(ChatClient.Builder builder) {
        this.chatClient = builder
                .build();
    }

    @Transactional
    public GeneratedStory createStory(String userId, StoryDetails storyDetails){
        if(userId==null||storyDetails==null) throw new IllegalArgumentException();

        String userPrompt = """
    Please create a children-friendly story with the following details:

    - Character Name: %s
    - Character Type: %s
    - Story World: %s
    """.formatted(
                storyDetails.characterName(),
                storyDetails.characterType(),
                storyDetails.StoryWorld()
        );
        GeneratedStory entity = chatClient.prompt()
                .user(userPrompt)
                .system(GenerationSysPrompt.SystemPrompt)
                .call()
                .entity(GeneratedStory.class);
            if(entity==null) throw new StoryGenerationFailedException();
            if(!ValidateContent(entity.getStory(),entity.getStoryTitle())) throw new ContentNotValideException();

            MyStory myStory = new MyStory(
                    userId,
                    storyDetails.characterType(),
                    storyDetails.characterName(),
                    entity.getStory(),
                    entity.getStoryTitle(),
                    new Date(),
                    storyDetails.StoryWorld(),
                    storyDetails.storyLanguage()
            );
            publishStory(myStory);
            return entity;
    }

    public boolean ValidateContent(String story,String storyTitle){
        if(story.isEmpty() || storyTitle.isEmpty()) return false;
        String userPrompt = """
        Story Title: %s
        Story Content: %s
        """.formatted(storyTitle, story);

        Boolean isValid = chatClient.prompt()
                .system(ValidatingStoryContentPrompt.SysPrompt)
                .user(userPrompt)
                .call()
                .entity(new ParameterizedTypeReference<Boolean>() {});

        return isValid != null && isValid;
    }

    public boolean publishStory(MyStory myStory) {
        if (myStory == null) {
            throw new IllegalArgumentException("Story cannot be null");
        }

        try {
            MyStory saved = repo.save(myStory);
            return saved.getStoryId() != null;
        } catch (Exception e) {
            throw new SavingNewStoryOnDBFailedException("Failed to save story", e);
        }
    }




}
