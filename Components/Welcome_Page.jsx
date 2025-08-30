import { View, Text, SafeAreaView,StyleSheet, Dimensions, StatusBar, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import url from './URL/all_urls.json'
import Button_comp from './Static-Components/Button_comp';

const {width,height} = Dimensions.get('window');


const Welcome_Page = () => {
  return (
<SafeAreaView style={styles.container}>
<StatusBar barStyle={'default'}/>
<View style={{display:"flex",flexDirection:"row" , justifyContent:"center",alignItems:"center"}}>

<View>
<Image source={{uri:url.welcome_page_back}} style={{height:height*0.45 , width:width,marginTop:-height*0.05}}/>

<View style={{marginTop:height*0.03}}>
<Text style={[styles.text_container,{fontWeight:"800",fontSize:25}]}>Welcome to Story Spark!</Text>
<Text style={[styles.text_container,{paddingTop:20,fontSize:17}]}>Let's turn your imagination into amazing stories.</Text>
</View>


<View style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:height*0.05}}>
<Button_comp color={"#38E07A"} fontColor={"black"} title={"Create New Story"} job={"story_details"}/>
<View style={{marginTop:20}}>
<Button_comp color={"#264533"} fontColor={"white"} title={"Create New Story"} job={""}/>
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
    textAlign:"center",
    color:"white"
  }
});





export default Welcome_Page