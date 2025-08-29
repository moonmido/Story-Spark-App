import { View, Text, SafeAreaView, Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Button_comp from '../Static-Components/Button_comp';
const {width,height} = Dimensions.get('window');



const input_details = () => {

const [selected,setSelected] = useState("java");
const navigation = useNavigation();

const [charName,setCharName]=useState("");
const [charType,setCharType]=useState("");
const [storyWorld,setStoryWorld] = useState("");

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
<TextInput onChangeText={(e)=>setCharName(e)} value={charName} placeholder='Enter character name' placeholderTextColor={"#96c5a9"} style={{backgroundColor:"#366348",width:width*0.9,height:height*0.08,marginTop:height*0.02,borderRadius:15,paddingLeft:15,fontSize:17,borderWidth:1,borderColor:"#96c5a9"}}/>
</View>

<View style={{marginBottom:height*0.04}}>
<Text style={{color:"white",fontSize:17}}>Character Type</Text>
<TextInput onChangeText={(e)=>setCharType(e)} value={charType} placeholder='Enter character type' placeholderTextColor={"#96c5a9"} style={{backgroundColor:"#366348",width:width*0.9,height:height*0.08,marginTop:height*0.02,borderRadius:15,paddingLeft:15,fontSize:17,borderWidth:1,borderColor:"#96c5a9"}}/>
</View>

<View style={{marginBottom:height*0.04}}>
<Text style={{color:"white",fontSize:17}}>Story World</Text>
<TextInput onChangeText={(e)=>setStoryWorld(e)} value={storyWorld} placeholder='Enter story world' placeholderTextColor={"#96c5a9"} style={{backgroundColor:"#366348",width:width*0.9,height:height*0.08,marginTop:height*0.02,borderRadius:15,paddingLeft:15,fontSize:17,borderWidth:1,borderColor:"#96c5a9"}}/>
</View>

</View>
<View style={{marginTop:height*0.1,marginLeft:width*0.02}}>
<Button_comp title={"Generate Story"} color={"#38E07A"} fontColor={"black"} job={""}/>
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
  }
});


export default input_details