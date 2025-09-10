import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'http://192.168.100.7:8080'; 
const USER_ID =  AsyncStorage.getItem("userId"); 

// Default placeholder image for stories without images
const DEFAULT_STORY_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdGqH-YsFEwDKblqxcvp9icEr5WsVctmuTLw37VUnb7G4qDr_C9KKl36xX1EtgpegZ6JEZpkCGYV9h5ZHw9SIZBWc5rxVSlMKlnEX9qaNIUr4yVdy6jnMjHnw8R5E4AINc9DlLyEZcx5HjzPNhcgH_QwMJKpc5pX8E5tbIS674qfVNZCLAt0SOVSwr5hb78UI1IWAefTBuuzI6Ud-tCxw6G28vHwFwES-6C1yy806onCr0EPPyQVIiKnVqak-PUrIjclfRLg8Zw';

const StoryCard = ({ story, onPress }) => (
  <TouchableOpacity style={styles.storyCard} onPress={onPress}>
    <Image 
      source={{ uri: story.image || DEFAULT_STORY_IMAGE }} 
      style={styles.storyImage} 
      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
    />
    <Text style={styles.storyTitle}>{story.storyTitle || story.title}</Text>
    {story.characterName && (
      <Text style={styles.storySubtitle}>Character: {story.characterName}</Text>
    )}
    {story.createdAt && (
      <Text style={styles.storyDate}>
        {new Date(story.createdAt).toLocaleDateString()}
      </Text>
    )}
  </TouchableOpacity>
);

export default function MyStories() {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch stories from API
  const fetchStories = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/stories/get-story?userId=${USER_ID}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userStories = await response.json();
        
        // Transform MyStory objects to match UI expectations
        const transformedStories = userStories.map(story => ({
          id: story.storyId,
          storyId: story.storyId,
          title: story.storyTitle,
          storyTitle: story.storyTitle,
          story: story.story,
          characterName: story.characterName,
          characterType: story.characterType,
          storyWorld: story.storyWorld,
          storyLanguage: story.storyLanguage,
          userId: story.userId,
          createdAt: story.createdAt,
          image: DEFAULT_STORY_IMAGE 
        }));

        setStories(transformedStories);
      } else {
        // Handle different error responses
        let errorMessage = 'Failed to load stories';
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid user ID';
            break;
          case 404:
            errorMessage = 'No stories found';
            setStories([]); // Set empty array for no stories
            break;
          case 405:
            errorMessage = 'Please verify your email account first';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
        }
        
        setError(errorMessage);
        
        if (response.status !== 404) {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (networkError) {
      console.error('Network error:', networkError);
      const errorMsg = 'Unable to connect to server. Please check your internet connection.';
      setError(errorMsg);
      Alert.alert('Connection Error', errorMsg);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Load stories when component mounts
  useEffect(() => {
    fetchStories();
  }, []);

  // Refresh stories when screen comes into focus (useful when returning from story creation)
  useFocusEffect(
    useCallback(() => {
      fetchStories();
    }, [])
  );

  // Pull to refresh
  const onRefresh = () => {
    fetchStories(true);
  };

  const handleStoryPress = (story) => {
    console.log('Story pressed:', story.storyTitle);
    
    // Navigate to Show_Story screen with the selected story
    navigation.navigate('Show_Story', {
      story: {
        storyTitle: story.storyTitle,
        story: story.story,
        // Add other story properties as needed
      },
      characterName: story.characterName,
      characterType: story.characterType,
      storyWorld: story.storyWorld
    });
  };

  const handleAddPress = () => {
    navigation.navigate("story_details");
  };

  // Loading state
  if (isLoading && stories.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#122118" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate("welcome")}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Stories</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Ionicons name="add" size={34} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#38E07A" />
          <Text style={styles.loadingText}>Loading your stories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#122118" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.navigate("welcome")}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Stories</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Ionicons name="add" size={34} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#38E07A']}
            tintColor="#38E07A"
            title="Pull to refresh"
            titleColor="#FFFFFF"
          />
        }
      >
        {stories.length === 0 && !isLoading ? (
          <View style={styles.centerContainer}>
            <Ionicons name="book-outline" size={64} color="#96c5a9" />
            <Text style={styles.emptyStateText}>No stories yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Create your first story by tapping the + button
            </Text>
          </View>
        ) : (
          <View style={styles.storiesGrid}>
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(story)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122118',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 35,
    backgroundColor: '#122118',
  },
  headerSpacer: {
    width: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  storyCard: {
    width: '48%',
    marginBottom: 16,
  },
  storyImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  storyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    paddingBottom: 4,
  },
  storySubtitle: {
    color: '#96c5a9',
    fontSize: 14,
    fontWeight: '400',
    paddingBottom: 4,
  },
  storyDate: {
    color: '#96c5a9',
    fontSize: 12,
    fontWeight: '400',
    paddingBottom: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    color: '#96c5a9',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});