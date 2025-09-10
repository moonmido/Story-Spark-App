import { View, Text, SafeAreaView, Dimensions, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Button_comp from '../Static-Components/Button_comp';

const {width,height} = Dimensions.get('window');

// API Configuration
const API_BASE_URL = 'http://192.168.100.7:8080'; 
const USER_ID = localStorage.getItem("userId"); 

const input_details = () => {
  const navigation = useNavigation();
  const [charName,setCharName]=useState("");
  const [charType,setCharType]=useState("");
  const [storyWorld,setStoryWorld] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateStory = async () => {
    // Validation
    if (!charName.trim() || !charType.trim() || !storyWorld.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields to generate your story.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare story details payload
      const storyDetails = {
        characterName: charName.trim(),
        characterType: charType.trim(),
        storyWorld: storyWorld.trim()
      };

      // API call to create story
      const response = await fetch(`${API_BASE_URL}/api/stories/create?userId=${USER_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(storyDetails)
      });

      if (response.ok) {
  const generatedStory = await response.json();
  
  // Success - navigate to Show_Story screen
  Alert.alert('Success!', 'Your story has been generated successfully!', [
    {
      text: 'View Story',
      onPress: () => {
        // Navigate to Show_Story screen and pass the generated story
        navigation.navigate('show_story', { 
          story: generatedStory,
          characterName: charName,
          characterType: charType,
          storyWorld: storyWorld
        });
      }
    }
  ]);
  
  // Clear form
  setCharName("");
  setCharType("");
  setStoryWorld("");
} else {
        // Handle different error responses
        const errorText = await response.text();
        let errorMessage = 'Failed to generate story. Please try again.';
        
        switch (response.status) {
          case 400:
            errorMessage = 'Please provide valid story details.';
            break;
          case 405:
            errorMessage = 'Please verify your email account first. Check your email for verification link.';
            break;
          case 422:
            errorMessage = 'The generated story content is not valid. Please try again.';
            break;
          case 500:
            errorMessage = 'Story generation failed. Please try again later.';
            break;
          default:
            errorMessage = errorText || errorMessage;
        }
        
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert(
        'Connection Error', 
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{margin:width*0.05}}>
        <View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
          <TouchableOpacity onPress={()=>navigation.navigate("welcome")}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={{color:"white",fontSize:20,fontWeight:"700",marginLeft:width*0.2}}>Create Your Story</Text>
        </View>

        <View style={{marginTop:height*0.05,display:"flex",flexDirection:"column"}}>
          <View style={{marginBottom:height*0.04}}>
            <Text style={{color:"white",fontSize:17}}>Character Name</Text>
            <TextInput 
              onChangeText={(e)=>setCharName(e)} 
              value={charName} 
              placeholder='Enter character name' 
              placeholderTextColor={"#96c5a9"} 
              style={styles.text_inp_container}
              editable={!isLoading}
            />
          </View>

          <View style={{marginBottom:height*0.04}}>
            <Text style={{color:"white",fontSize:17}}>Character Type</Text>
            <TextInput 
              onChangeText={(e)=>setCharType(e)} 
              value={charType} 
              placeholder='Enter character type' 
              placeholderTextColor={"#96c5a9"} 
              style={styles.text_inp_container}
              editable={!isLoading}
            />
          </View>

          <View style={{marginBottom:height*0.04}}>
            <Text style={{color:"white",fontSize:17}}>Story World</Text>
            <TextInput 
              onChangeText={(e)=>setStoryWorld(e)} 
              value={storyWorld} 
              placeholder='Enter story world' 
              placeholderTextColor={"#96c5a9"} 
              style={styles.text_inp_container}
              editable={!isLoading}
            />
          </View>
        </View>

        <View style={{marginTop:height*0.1,marginLeft:width*0.02}}>
          <Button_comp 
            title={isLoading ? "Generating..." : "Generate Story"} 
            color={"#38E07A"} 
            fontColor={"black"} 
            job={generateStory}
            disabled={isLoading}
          />
        </View>
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
  text_inp_container:{
    backgroundColor:"#366348",
    width:width*0.9,
    height:height*0.08,
    marginTop:height*0.02,
    borderRadius:15,
    paddingLeft:15,
    fontSize:17,
    borderWidth:1,
    borderColor:"#96c5a9",
    color:"white"
  }
});

export default input_details