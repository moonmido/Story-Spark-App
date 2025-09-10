package com.Story_Spark.story_spark.UserProfile.Services;

import com.Story_Spark.story_spark.Story_Generation.Repositories.MyStoryRepo;
import com.Story_Spark.story_spark.UserProfile.Inputs.UserDetails;
import com.Story_Spark.story_spark.UserProfile.Models.MyProfile;
import com.Story_Spark.story_spark.UserProfile.MyExceptions.ProfileDosntExistException;
import com.Story_Spark.story_spark.UserProfile.Repositories.MyProfileRepo;
import com.Story_Spark.story_spark.User_Auth.Models.MyUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    private final MyProfileRepo repo;

    private final MyStoryRepo myStoryRepo;

    public ProfileService(MyProfileRepo repo, MyStoryRepo myStoryRepo) {
        this.repo = repo;
        this.myStoryRepo = myStoryRepo;
    }


    public MyProfile CreateProfile(UserDetails userDetails,String userId){
        if(userDetails==null) throw new IllegalArgumentException();

        MyProfile profile = new MyProfile(
                userId,
                userDetails.email(),
                userDetails.firstname(),
                userDetails.lastname(),
                userDetails.language(),
                CalculateNumberOfStories(userId)
        );
        return repo.save(profile);
    }

    public Long CalculateNumberOfStories(String userId){
        if(userId==null) throw new IllegalArgumentException();
try {
    return myStoryRepo.countByUserId(userId);
} catch (Exception e) {
    return 0L;
}
    }

    public MyProfile GetProfileStatus(String userId){
        if(userId==null) throw new IllegalArgumentException();
        return repo.findByUserId(userId)
                .orElseThrow(ProfileDosntExistException::new);
    }

    public boolean updateProfile(String userId, UserDetails userDetails) {
        if (userId == null) throw new IllegalArgumentException();

        Optional<MyProfile> profileOpt = repo.findByUserId(userId);
        if (profileOpt.isEmpty()) return false;

        MyProfile profile = profileOpt.get();
        profile.setEmail(userDetails.email());
        profile.setFirstname(userDetails.firstname());
        profile.setLastname(userDetails.lastname());
        repo.save(profile);

        return true;
    }


    public boolean ChangeLanguage(String userId , String newLanguage){
        if(userId==null ||newLanguage==null) throw new IllegalArgumentException();
        Optional<MyProfile> byUserId = repo.findByUserId(userId);
        if(byUserId.isEmpty()) return false;
        byUserId.get()
                .setPreferredLanguage(newLanguage);
        repo.save(byUserId.get());

        return true;
    }

    public String GetStoryLanguage(String userId){
        if(userId==null) throw new IllegalArgumentException();
        Optional<MyProfile> byUserId = repo.findByUserId(userId);
        if(byUserId.isEmpty()) throw new ProfileDosntExistException();
        return byUserId.get().getPreferredLanguage();
        }


}
