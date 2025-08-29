import { View, Text,TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
const {width,height} = Dimensions.get('window');

const Button_comp = ({color,title,job,fontColor}) => {
  return (
<TouchableOpacity style={{backgroundColor:color,width:width*0.85,height:height*0.07,borderRadius:30,display:"flex",flexDirection:"column",justifyContent:"center"}}>
    <Text style={[styles.text_container,{fontSize:20,fontWeight:"700",color:fontColor}]}>{title}</Text>
</TouchableOpacity>
  )
}

export default Button_comp


const styles = StyleSheet.create({
text_container:{
     textAlign:"center",
    color:"white"
}


})