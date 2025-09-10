package com.Story_Spark.story_spark.Story_Generation.Repositories;

import com.Story_Spark.story_spark.Story_Generation.Models.MyStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MyStoryRepo extends JpaRepository<MyStory,Long> {
    long countByUserId(String userId);

    List<MyStory> findAllByUserId(String userId);
}
