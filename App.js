import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome_Page from './Components/Welcome_Page';
import input_details from './Components/CreateNewStory/input_details';

export default function App() {

const Stack = createStackNavigator();  
  return (
<NavigationContainer>
<Stack.Navigator initialRouteName='story_details'>
<Stack.Screen name='welcome' component={Welcome_Page} options={{headerShown:false}}/>
<Stack.Screen name='story_details' component={input_details} options={{headerShown:false}}/>

</Stack.Navigator>


</NavigationContainer>


  );
}


