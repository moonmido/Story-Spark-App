import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome_Page from './Components/Welcome_Page';
import input_details from './Components/CreateNewStory/input_details';
import Show_Story from './Components/Show_Story';
import StoryQuiz from './Components/StoryQuiz';

export default function App() {

const Stack = createStackNavigator();  
  return (
<NavigationContainer>
<Stack.Navigator initialRouteName='story_quiz'>
<Stack.Screen name='welcome' component={Welcome_Page} options={{headerShown:false}}/>
<Stack.Screen name='story_details' component={input_details} options={{headerShown:false}}/>
<Stack.Screen name='show_story' component={Show_Story} options={{headerShown:false}}/>
<Stack.Screen name='story_quiz' component={StoryQuiz} options={{headerShown:false}}/>

</Stack.Navigator>


</NavigationContainer>


  );
}


