import React from 'react';
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
} from 'react-native';
import url from './URL/all_urls.json';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const {width,height} = Dimensions.get("window");

const SettingsItem = ({ icon, title, subtitle, onPress, large = false, iconSize = 24 }) => (
  <TouchableOpacity style={[styles.settingsItem, large && styles.settingsItemLarge]} onPress={onPress}>
    <View style={[styles.settingsIcon, large && styles.settingsIconLarge]}>
      <Ionicons name={icon} size={iconSize} color="#FFFFFF" />
    </View>
    <View style={styles.settingsContent}>
      <Text style={styles.settingsTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
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
  const handleBackPress = () => {
navigation.navigate("welcome")
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    // Navigate to profile screen
  };

  const handleLanguagePress = () => {
    console.log('Audio Language pressed');
    // Navigate to language settings
  };

  const handleHelpPress = () => {
    console.log('Help pressed');
    // Navigate to help screen
  };

  const handleContactPress = () => {
    console.log('Contact Us pressed');
    // Navigate to contact screen
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
          subtitle="Choose your preferred language"
          onPress={handleLanguagePress}
          large={true}
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
});