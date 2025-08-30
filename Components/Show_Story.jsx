import { View, Text, SafeAreaView, StyleSheet, Dimensions, StatusBar, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import url from './URL/all_urls.json';
import Button_comp from './Static-Components/Button_comp';
import { useNavigation } from '@react-navigation/native';

const {width,height} = Dimensions.get('window');


const Show_Story = () => {
    const navigation = useNavigation();
  return (
<SafeAreaView style={styles.container}>
<StatusBar barStyle={'light-content'}/>
<View style={{margin:width*0.05}}>

<View style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
<TouchableOpacity onPress={()=>navigation.navigate("story_details")}>
<Ionicons name="arrow-back" size={28} color="white" />
</TouchableOpacity>
<Text style={{color:"white",fontSize:20,fontWeight:"700",marginLeft:width*0.27}}>Story Time</Text>
</View>


<View style={{marginTop:height*0.04}}>

<View style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
    <Text style={styles.text_container}>Once upon a time, in a land filled with candy clouds and chocolate rivers, lived a little girl named Lily. Lily loved to explore, and one sunny morning, she decided to go
          on an adventure. She packed a bag with her favorite teddy bear, Mr. Snuggles, and a map that her grandma had given her. The map showed a path to the legendary Rainbow
          Waterfall, a place said to grant wishes to those who found it.
</Text>

<View style={{marginTop:height*0.04}}>
<Image source={{uri:url.show_story_back}} style={{width:width*0.9,height:height*0.3,borderRadius:25}}/>
</View>

<View style={{marginTop:height*0.05}}>
    <Button_comp title={"Continue"} fontColor={"black"} job={""} color={"#38E07A"}/>
</View>

</View>

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
  text_container:{
    color:"white",
    fontSize:18,
    fontWeight:"500"
  }
});



export default Show_Story