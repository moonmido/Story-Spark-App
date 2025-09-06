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

    @Autowired
    private static MyProfileRepo repo;

    @Autowired
    private MyStoryRepo myStoryRepo;


    public MyProfile CreateProfile(UserDetails userDetails,String userId){
        if(userDetails==null) throw new IllegalArgumentException();

        MyProfile profile = new MyProfile(
                userId,
                userDetails.email(),
                userDetails.firstname(),
                userDetails.lastname(),
                userDetails.Language(),
                CalculateNumberOfStories(userId)
        );
        return repo.save(profile);
    }

    public Long CalculateNumberOfStories(String userId){
        if(userId==null) throw new IllegalArgumentException();
        return myStoryRepo.countByUserId(userId);
    }

    public MyProfile GetProfileStatus(String userId){
        if(userId==null) throw new IllegalArgumentException();
        return repo.findByUserId(userId)
                .orElseThrow(ProfileDosntExistException::new);
    }

    public boolean updateProfile(String userId,UserDetails userDetails){
        if(userId==null) throw new IllegalArgumentException();

        Optional<MyProfile> byUserId = repo.findByUserId(userId);
        if(byUserId.isEmpty()) return false;
        byUserId.get().setEmail(userDetails.email());
        byUserId.get().setFirstname(userDetails.firstname());
        byUserId.get().setLastname(userDetails.lastname());
        return true;
    }

    public boolean ChangeLanguage(String userId , String newLanguage){
        if(userId==null ||newLanguage==null) throw new IllegalArgumentException();
        Optional<MyProfile> byUserId = repo.findByUserId(userId);
        if(byUserId.isEmpty()) return false;
        byUserId.get()
                .setPreferredLanguage(newLanguage);
        return true;
    }

    public static  String GetStoryLanguage(String userId){
        if(userId==null) throw new IllegalArgumentException();
        Optional<MyProfile> byUserId = repo.findByUserId(userId);
        if(byUserId.isEmpty()) throw new ProfileDosntExistException();
        return byUserId.get().getPreferredLanguage();
        }


}
