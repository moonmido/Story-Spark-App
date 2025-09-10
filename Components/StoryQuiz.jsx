import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button_comp from './Static-Components/Button_comp';
import { useRoute, useNavigation } from '@react-navigation/native';

const StoryQuiz = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // Get the GeneratedStory data from navigation params
  const { generatedStory } = route.params || {};
  
  // Extract questions from the GeneratedStory object
  const apiQuestions = generatedStory?.questions || [];
  
  // Fallback questions if no API data
  const defaultQuestions = [
    {
      id: 'question1',
      title: 'Question 1',
      question: 'What did the brave knight use to defeat the dragon?',
      options: [
        { value: 'sword', label: 'A magic sword' },
        { value: 'shield', label: 'A shield' },
      ],
    },
    {
      id: 'question2',
      title: 'Question 2',
      question: 'Where did the princess find the hidden treasure?',
      options: [
        { value: 'forest', label: 'In the forest' },
        { value: 'castle', label: 'In the castle' },
      ],
    },
    {
      id: 'question3',
      title: 'Question 3',
      question: 'What was the name of the knight\'s loyal horse?',
      options: [
        { value: 'thunder', label: 'Thunder' },
        { value: 'shadow', label: 'Shadow' },
      ],
    },
  ];

  // Use API questions if available, otherwise use default
  const questions = apiQuestions.length > 0 ? apiQuestions : defaultQuestions;

  // Initialize answers state dynamically based on questions
  const initializeAnswers = () => {
    const initialAnswers = {};
    questions.forEach(question => {
      initialAnswers[question.id] = null;
    });
    return initialAnswers;
  };

  const [answers, setAnswers] = useState(initializeAnswers());

  const handleAnswerSelect = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    
    if (unansweredQuestions.length > 0) {
      Alert.alert(
        'Incomplete Quiz',
        'Please answer all questions before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Process the quiz results
    const userAnswers = Object.entries(answers).map(([questionId, selectedValue]) => {
      const question = questions.find(q => q.id === questionId);
      const selectedOption = question?.options.find(option => option.value === selectedValue);
      return {
        questionId,
        question: question?.question,
        selectedValue,
        selectedLabel: selectedOption?.label
      };
    });

    console.log('Quiz Results:', userAnswers);

    Alert.alert(
      'Quiz Submitted!',
      'Thank you for completing the story quiz!',
      [
        { 
          text: 'OK', 
          onPress: () => {
            // Navigate back to story or main screen
            navigation.navigate('Show_Story', { 
              story: generatedStory,
              quizResults: userAnswers 
            });
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    Alert.alert("You Can't Go Back Until you answer all questions");
  };

  const renderQuestion = (questionData) => (
    <View key={questionData.id} style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{questionData.title}</Text>
      <Text style={styles.questionText}>{questionData.question}</Text>
      
      <View style={styles.optionsContainer}>
        {questionData.options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              answers[questionData.id] === option.value && styles.selectedOption,
            ]}
            onPress={() => handleAnswerSelect(questionData.id, option.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                answers[questionData.id] === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#122118" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Story Quiz</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Description */}
      <Text style={styles.description}>Test your knowledge of the story!</Text>

      {/* Questions */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {questions.map(renderQuestion)}
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button_comp 
          title={"Submit"} 
          fontColor={"black"} 
          job={handleSubmit} 
          color={"#38E07A"}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122118',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -0.24,
  },
  headerSpacer: {
    width: 48,
  },
  description: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 15,
  },
  scrollView: {
    flex: 1,
  },
  questionContainer: {
    paddingTop: 40,
  },
  questionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 15,
    letterSpacing: -0.24,
  },
  questionText: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 18,
    paddingTop: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#366348',
    paddingHorizontal: 16,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  selectedOption: {
    borderWidth: 3,
    borderColor: '#38e07b',
    paddingHorizontal: 14, // Adjust padding to account for thicker border
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
  submitContainer: {
    paddingHorizontal: 26,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  submitButton: {
    backgroundColor: '#38e07b',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#122118',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.24,
  },
});

export default StoryQuiz;