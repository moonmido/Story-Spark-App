package com.Story_Spark.story_spark.Story_Generation.Services;

import com.Story_Spark.story_spark.Story_Generation.Models.MyStory;
import com.Story_Spark.story_spark.Story_Generation.Models.StoryDetails;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.ContentNotValideException;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.ProfileDosntExistException;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.SavingNewStoryOnDBFailedException;
import com.Story_Spark.story_spark.Story_Generation.MyExceptions.StoryGenerationFailedException;
import com.Story_Spark.story_spark.Story_Generation.Outputs.GeneratedStory;
import com.Story_Spark.story_spark.Story_Generation.Prompts.GenerationSysPrompt;
import com.Story_Spark.story_spark.Story_Generation.Prompts.ValidatingStoryContentPrompt;
import com.Story_Spark.story_spark.Story_Generation.Repositories.MyStoryRepo;
import com.Story_Spark.story_spark.UserProfile.Services.ProfileService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.EmptyStackException;
import java.util.List;

@Service
public class StoryService {

    private final MyStoryRepo repo;

    private final ChatClient chatClient;

    private final ProfileService profileService;

    public StoryService(MyStoryRepo repo, ChatClient.Builder builder, ProfileService profileService) {
        this.repo = repo;
        this.chatClient = builder
                .build();
        this.profileService = profileService;
    }

    @Transactional
    public GeneratedStory createStory(String userId, StoryDetails storyDetails){
        if(userId==null||storyDetails==null) throw new IllegalArgumentException();

        String language;
        try {
            language = profileService.GetStoryLanguage(userId);
        } catch (ProfileDosntExistException | IllegalArgumentException e) {
            language = "English";
        }

        String userPrompt = """
Please create a children-friendly story with the following details:

- Character Name: %s
- Character Type: %s
- Story World: %s
- Story Language: %s

Return ONLY JSON that matches the structure of GeneratedStory.
""".formatted(
                storyDetails.characterName(),
                storyDetails.characterType(),
                storyDetails.StoryWorld(),
                language
        );
        GeneratedStory entity = chatClient.prompt()
                .user(userPrompt)
                .system(GenerationSysPrompt.SystemPrompt)
                .call()
                .entity(GeneratedStory.class);

            if(entity==null) throw new StoryGenerationFailedException();
            if(!ValidateContent(entity.getStory(),entity.getStoryTitle())) throw new ContentNotValideException();


        String s = profileService.GetStoryLanguage(userId);


        MyStory myStory = new MyStory(
                    userId,
                    storyDetails.characterType(),
                    storyDetails.characterName(),
                    entity.getStory(),
                    entity.getStoryTitle(),
                    new Date(),
                    storyDetails.StoryWorld(),
                    language
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

    public void publishStory(MyStory myStory) {
        if (myStory == null) {
            throw new IllegalArgumentException("Story cannot be null");
        }
        try {
             repo.save(myStory);
        } catch (Exception e) {
            throw new SavingNewStoryOnDBFailedException("Failed to save story", e);
        }
    }

public List<MyStory> GetAllStories(String userId){
        if(userId==null) throw new IllegalArgumentException();
    List<MyStory> allByUserId = repo.findAllByUserId(userId);
    if(allByUserId.isEmpty()) throw new ContentNotValideException();
    return allByUserId;
}


}
