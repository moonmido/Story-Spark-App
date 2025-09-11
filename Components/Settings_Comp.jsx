import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import url from './URL/all_urls.json';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsService from '../services/SettingsService'; // Adjust the path as needed

const {width, height} = Dimensions.get("window");

// Languages list
const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', name: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', name: 'Português', flag: '🇵🇹' },
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'ko', name: '한국어', flag: '🇰🇷' },
  { id: 'zh', name: '中文', flag: '🇨🇳' },
  { id: 'ar', name: 'العربية', flag: '🇸🇦' },
  { id: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

const SettingsItem = ({ icon, title, subtitle, onPress, large = false, iconSize = 24, showArrow = false, disabled = false }) => (
  <TouchableOpacity 
    style={[styles.settingsItem, large && styles.settingsItemLarge]} 
    onPress={onPress}
    disabled={disabled}
    activeOpacity={disabled ? 1 : 0.6}
  >
    <View style={[styles.settingsIcon, large && styles.settingsIconLarge]}>
      <Ionicons name={icon} size={iconSize} color={disabled ? "#666666" : "#FFFFFF"} />
    </View>
    <View style={styles.settingsContent}>
      <Text style={[styles.settingsTitle, disabled && styles.disabledText]}>{title}</Text>
      {subtitle && <Text style={[styles.settingsSubtitle, disabled && styles.disabledSubtitle]}>{subtitle}</Text>}
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={20} color={disabled ? "#666666" : "#96c5a9"} />
    )}
  </TouchableOpacity>
);

const LogoutItem = ({ onPress, disabled = false }) => (
  <TouchableOpacity 
    style={styles.logoutItem} 
    onPress={onPress}
    disabled={disabled}
    activeOpacity={disabled ? 1 : 0.6}
  >
    <View style={styles.logoutIcon}>
      <Ionicons name="log-out-outline" size={24} color={disabled ? "#AA6666" : "#FF4444"} />
    </View>
    <View style={styles.settingsContent}>
      <Text style={[styles.logoutTitle, disabled && styles.disabledLogoutTitle]}>Logout</Text>
      <Text style={[styles.logoutSubtitle, disabled && styles.disabledLogoutSubtitle]}>Sign out of your account</Text>
    </View>
  </TouchableOpacity>
);

const ProfileItem = ({ onPress }) => (
  <TouchableOpacity style={styles.profileItem} onPress={onPress}>
    <Image
      source={{
        uri: url.profile_pic
      }}
      style={styles.profileImage}
    />
    <View style={styles.profileContent}>
      <Text style={styles.profileTitle}>Profile</Text>
      <Text style={styles.profileSubtitle}>Manage your profile</Text>
    </View>
  </TouchableOpacity>
);

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setInitialLoading(true);
            const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        await loadUserLanguage(storedUserId);
      } else {
        // Handle case where userId is not found
        console.log('No userId found in storage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadUserLanguage = async (userIdToUse) => {
    try {
      const profile = await SettingsService.getProfile(userIdToUse);
      const languageCode = SettingsService.mapLanguageNameToCode(profile.preferredLanguage);
      setSelectedLanguage(languageCode);
      
      // Also save to AsyncStorage for offline use
      await AsyncStorage.setItem('selectedLanguage', languageCode);
    } catch (error) {
      console.error('Error loading user language:', error);
      // If profile doesn't exist, use default language
      if (!error.message.includes('Profile not found')) {
        // Only show alert for unexpected errors
        Alert.alert('Info', 'Using default language settings');
      }
    }
  };

  const handleBackPress = () => {
    navigation.navigate("welcome");
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    navigation.navigate("profile"); // Navigate to profile screen
  };

  const handleLanguagePress = () => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to change language settings');
      return;
    }
    setShowLanguageModal(true);
  };

  const handleLanguageSelect = async (language) => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to change language settings');
      return;
    }

    try {
      setLoading(true);
      setShowLanguageModal(false);
      
      // Update language in backend
      const languageName = SettingsService.mapLanguageCodeToName(language.id);
      await SettingsService.changeLanguage(userId, languageName);
      
      // Update local state
      setSelectedLanguage(language.id);
      
      // Save to AsyncStorage for offline use
      await AsyncStorage.setItem('selectedLanguage', language.id);
      
      console.log('Language changed to:', language.name);
      Alert.alert('Success', `Language changed to ${language.name}`);
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert('Error', 'Failed to update language. Please try again.');
      
      // Revert to previous selection on error
      try {
        const profile = await SettingsService.getProfile(userId);
        const currentLanguageCode = SettingsService.mapLanguageNameToCode(profile.preferredLanguage);
        setSelectedLanguage(currentLanguageCode);
      } catch (revertError) {
        console.error('Error reverting language:', revertError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.id === selectedLanguage) || LANGUAGES[0];
  };

  const handleHelpPress = () => {
    console.log('Help pressed');
    // Navigate to help screen
    Alert.alert('Help', 'Help feature coming soon!');
  };

  const handleContactPress = () => {
    console.log('Contact Us pressed');
    // Navigate to contact screen
    Alert.alert('Contact Us', 'Contact feature coming soon!');
  };

  const handleLogoutPress = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              console.log('User logged out');
              
              // Clear all stored data
              await AsyncStorage.multiRemove(['access_token', 'userId', 'selectedLanguage']);
              
              // Navigate to signin
              navigation.navigate("signin");
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout properly. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#122118" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#38e07b" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#122118" />
      
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#38e07b" />
          <Text style={styles.loadingText}>Updating...</Text>
        </View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SectionHeader title="Account" />
        <ProfileItem onPress={handleProfilePress} />

        {/* Preferences Section */}
        <SectionHeader title="Preferences" />
        <SettingsItem
          icon="globe-outline"
          title="Audio Language"
          subtitle={`${getCurrentLanguage().flag} ${getCurrentLanguage().name}`}
          onPress={handleLanguagePress}
          large={true}
          showArrow={true}
          disabled={loading || !userId}
        />

        {/* Support Section */}
        <SectionHeader title="Support" />
        <SettingsItem
          icon="help-circle-outline"
          title="Help"
          onPress={handleHelpPress}
          iconSize={24}
        />
        <SettingsItem
          icon="mail-outline"
          title="Contact Us"
          onPress={handleContactPress}
          iconSize={24}
        />

        {/* Logout Section */}
        <SectionHeader title="Account Actions" />
        <LogoutItem onPress={handleLogoutPress} disabled={loading} />
        
        {/* Add some bottom padding */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity 
                onPress={() => setShowLanguageModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageItem,
                    selectedLanguage === item.id && styles.selectedLanguageItem
                  ]}
                  onPress={() => handleLanguageSelect(item)}
                  disabled={loading}
                >
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                  <Text style={[styles.languageName, loading && styles.disabledText]}>{item.name}</Text>
                  {selectedLanguage === item.id && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

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
    paddingHorizontal: 25,
    paddingVertical: 13,
    paddingBottom: 10,
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
    marginLeft: 6,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    marginLeft: width * 0.02,
    flex: 1,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: -0.015,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122118',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 82,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  profileContent: {
    flex: 1,
    justifyContent: 'center',
  },
  profileTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  profileSubtitle: {
    color: '#96c5a9',
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 18,
    marginTop: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122118',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 56,
  },
  settingsItemLarge: {
    minHeight: 72,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#264532',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsIconLarge: {
    width: 48,
    height: 48,
  },
  settingsContent: {
    flex: 1,
    justifyContent: 'center',
  },
  settingsTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  settingsSubtitle: {
    color: '#96c5a9',
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 18,
    marginTop: 2,
  },
  // Logout specific styles
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122118',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 56,
  },
  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  logoutTitle: {
    color: '#FF4444',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 20,
  },
  logoutSubtitle: {
    color: '#FF8888',
    fontSize: 15,
    fontWeight: 'normal',
    lineHeight: 18,
    marginTop: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#122118',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedLanguageItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '500',
    flex: 1,
  },
  // Loading and disabled states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#122118',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 33, 24, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
  disabledText: {
    color: '#666666',
  },
  disabledSubtitle: {
    color: '#555555',
  },
  disabledLogoutTitle: {
    color: '#AA6666',
  },
  disabledLogoutSubtitle: {
    color: '#996666',
  },
});