import { View, Text, SafeAreaView, StyleSheet, Dimensions, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import url from './URL/all_urls.json';
import Button_comp from './Static-Components/Button_comp';
import { useNavigation, useRoute } from '@react-navigation/native';

const {width,height} = Dimensions.get('window');

const Show_Story = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the story data from navigation params
  const { story, characterName, characterType, storyWorld } = route.params || {};
  
  // Default fallback story if no data is passed
  const defaultStory = "Once upon a time, in a land filled with candy clouds and chocolate rivers, lived a little girl named Lily. Lily loved to explore, and one sunny morning, she decided to go on an adventure. She packed a bag with her favorite teddy bear, Mr. Snuggles, and a map that her grandma had given her. The map showed a path to the legendary Rainbow Waterfall, a place said to grant wishes to those who found it.";
  
  // Extract story content - adjust these property names based on your API response structure
  const storyContent = story?.content || story?.storyText || story?.text || defaultStory;
  const storyTitle = story?.title || `${characterName}'s Adventure` || "Story Time";
  
 const handleContinue = () => {
  // Check if the story has questions for quiz
  if (story?.questions && story.questions.length > 0) {
    // Navigate to StoryQuiz if questions are available
    navigation.navigate("story_quiz", { 
      generatedStory: story
    });
  } else {
    // Navigate back to input screen to create a new story
    navigation.navigate("story_details");
  }
};

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'}/>
      <View style={{margin:width*0.05}}>
        <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={{color:"white",fontSize:20,fontWeight:"700",marginLeft:width*0.27}}>
            {storyTitle}
          </Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={{marginTop:height*0.04, maxHeight: height*0.75}}
        >
          <View style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            
            {/* Story Details Header */}
            {(characterName || characterType || storyWorld) && (
              <View style={styles.storyDetailsContainer}>
                {characterName && (
                  <Text style={styles.storyDetailText}>
                    <Text style={styles.detailLabel}>Character:</Text> {characterName}
                  </Text>
                )}
                {characterType && (
                  <Text style={styles.storyDetailText}>
                    <Text style={styles.detailLabel}>Type:</Text> {characterType}
                  </Text>
                )}
                {storyWorld && (
                  <Text style={styles.storyDetailText}>
                    <Text style={styles.detailLabel}>World:</Text> {storyWorld}
                  </Text>
                )}
              </View>
            )}

            {/* Main Story Content */}
            <Text style={styles.text_container}>
              {storyContent}
            </Text>

            {/* Story Image */}
            <View style={{marginTop:height*0.04}}>
              <Image 
                source={{uri:url.show_story_back}} 
                style={{width:width*0.9,height:height*0.3,borderRadius:25}}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
            </View>

            {/* Action Buttons */}
            <View style={{marginTop:height*0.05, width: width*0.9}}>
              <Button_comp 
                title={story?.questions && story.questions.length > 0 ? "Take Quiz" : "Create New Story"} 
                fontColor={"black"} 
                job={handleContinue} 
                color={"#38E07A"}
                />
              
            
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width,
    height:"100%",
    backgroundColor:"#122117"
  },
  text_container:{
    color:"white",
    fontSize:18,
    fontWeight:"500",
    lineHeight: 26,
    textAlign: "justify",
    marginHorizontal: width*0.02
  },
  storyDetailsContainer: {
    backgroundColor: "#366348",
    padding: 15,
    borderRadius: 15,
    marginBottom: height*0.03,
    width: width*0.9,
    borderWidth: 1,
    borderColor: "#96c5a9"
  },
  storyDetailText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5
  },
  detailLabel: {
    color: "#96c5a9",
    fontWeight: "700"
  },
  
});

export default Show_Story