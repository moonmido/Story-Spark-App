import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProfileService from '../services/ProfileService'; // Adjust the path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';

const InputField = ({ label, value, onChangeText, placeholder, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#96c5a9"
      {...props}
    />
  </View>
);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const userId = AsyncStorage.getItem("userId"); 

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setInitialLoading(true);
      const profile = await ProfileService.getProfile(userId);
      setEmail(profile.email || '');
      setFirstName(profile.firstname || '');
      setLastName(profile.lastname || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      // If profile doesn't exist, keep the fields empty for user to fill
      if (!error.message.includes('Profile not found')) {
        Alert.alert('Error', 'Failed to load profile data');
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.navigate("settings");
  };

  const handleUpdateProfile = async () => {
    console.log('Update Profile pressed');
    console.log('Profile data:', { email, firstName, lastName });
    
    // Basic validation
    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Try to update the profile first
      try {
        await ProfileService.updateProfile(userId, {
          email: email.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
        Alert.alert('Success', 'Profile updated successfully!');
      } catch (error) {
        if (error.message.includes('Profile not found')) {
          // If profile doesn't exist, create a new one
          try {
            await ProfileService.createProfile(userId, {
              email: email.trim(),
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              language: 'English' // Default language
            });
            Alert.alert('Success', 'Profile created successfully!');
          } catch (createError) {
            console.error('Error creating profile:', createError);
            Alert.alert('Error', 'Failed to create profile. Please try again.');
          }
        } else {
          console.error('Error updating profile:', error);
          Alert.alert('Error', 'Failed to update profile. Please try again.');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    console.log('Delete Account pressed');
    
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Account deletion confirmed');
            // Note: You'll need to implement a delete endpoint in your backend
            // and add it to the ProfileService if you want full delete functionality
            Alert.alert('Info', 'Account deletion feature will be implemented soon.');
          },
        },
      ]
    );
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#122118" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38e07b" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#122118" />
      
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <InputField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              autoCapitalize="words"
              editable={!loading}
            />

            <InputField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.updateButton, loading && styles.updateButtonDisabled]} 
              onPress={handleUpdateProfile}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#122118" />
              ) : (
                <Text style={styles.updateButtonText}>Update Profile</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleDeleteAccount}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={[styles.deleteButtonText, loading && styles.deleteButtonTextDisabled]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomSpacer} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122118',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
    backgroundColor: '#122118',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  formContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 480,
    alignSelf: 'stretch',
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 20,
    paddingBottom: 12,
  },
  input: {
    backgroundColor: '#264532',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 20,
    borderWidth: 0,
  },
  bottomContainer: {
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
    gap: 12,
  },
  updateButton: {
    backgroundColor: '#38e07b',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  updateButtonDisabled: {
    backgroundColor: '#2a6b43',
  },
  updateButtonText: {
    color: '#122118',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.015,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.015,
  },
  deleteButtonTextDisabled: {
    color: '#888888',
  },
  bottomSpacer: {
    height: 20,
    backgroundColor: '#122118',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#122118',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
});