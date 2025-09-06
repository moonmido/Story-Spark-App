import React, { useState } from 'react';
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
} from 'react-native';
import url from './URL/all_urls.json';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const {width,height} = Dimensions.get("window");

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

const SettingsItem = ({ icon, title, subtitle, onPress, large = false, iconSize = 24, showArrow = false }) => (
  <TouchableOpacity style={[styles.settingsItem, large && styles.settingsItemLarge]} onPress={onPress}>
    <View style={[styles.settingsIcon, large && styles.settingsIconLarge]}>
      <Ionicons name={icon} size={iconSize} color="#FFFFFF" />
    </View>
    <View style={styles.settingsContent}>
      <Text style={styles.settingsTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={20} color="#96c5a9" />
    )}
  </TouchableOpacity>
);

const LogoutItem = ({ onPress }) => (
  <TouchableOpacity style={styles.logoutItem} onPress={onPress}>
    <View style={styles.logoutIcon}>
      <Ionicons name="log-out-outline" size={24} color="#FF4444" />
    </View>
    <View style={styles.settingsContent}>
      <Text style={styles.logoutTitle}>Logout</Text>
      <Text style={styles.logoutSubtitle}>Sign out of your account</Text>
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
  
  const handleBackPress = () => {
    navigation.navigate("welcome")
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    // Navigate to profile screen
  };

  const handleLanguagePress = () => {
    setShowLanguageModal(true);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language.id);
    setShowLanguageModal(false);
    console.log('Language changed to:', language.name);
    // Add your language change logic here
    // Save to AsyncStorage, update app language, etc.
  };

  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.id === selectedLanguage) || LANGUAGES[0];
  };

  const handleHelpPress = () => {
    console.log('Help pressed');
    // Navigate to help screen
  };

  const handleContactPress = () => {
    console.log('Contact Us pressed');
    // Navigate to contact screen
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
          onPress: () => {
            console.log('User logged out');
             AsyncStorage.removeItem("access_token")
            navigation.navigate("signin"); 
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#122118" />
      
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
        <LogoutItem onPress={handleLogoutPress} />
        
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
                >
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                  <Text style={styles.languageName}>{item.name}</Text>
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
    marginLeft:6,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    marginLeft:width*0.02,
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
});