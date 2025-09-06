package com.Story_Spark.story_spark.UserProfile.Repositories;

import com.Story_Spark.story_spark.UserProfile.Models.MyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyProfileRepo extends JpaRepository<MyProfile,Long> {
    Optional<MyProfile> findByUserId(String userId);}
