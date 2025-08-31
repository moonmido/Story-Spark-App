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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const stories = [
  {
    id: 1,
    title: 'The Magical Treehouse Adventure',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdGqH-YsFEwDKblqxcvp9icEr5WsVctmuTLw37VUnb7G4qDr_C9KKl36xX1EtgpegZ6JEZpkCGYV9h5ZHw9SIZBWc5rxVSlMKlnEX9qaNIUr4yVdy6jnMjHnw8R5E4AINc9DlLyEZcx5HjzPNhcgH_QwMJKpc5pX8E5tbIS674qfVNZCLAt0SOVSwr5hb78UI1IWAefTBuuzI6Ud-tCxw6G28vHwFwES-6C1yy806onCr0EPPyQVIiKnVqak-PUrIjclfRLg8Zw',
  },
  {
    id: 2,
    title: 'The Mystery of the Missing Toy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcFc6CMk-bW9MP6ewytlUunCsnM6qlslq_2KwMcnvXc4Yp7nqcRl5b8mEbUiTleNaze-0n2Xxr5r6LemYTRp7BkeL-EEQtoPDMnDC2hb2k71itc7VMKss8PkzrHYLk5YknLjlaGYrF5deXrAx_HB3-iAUd44hBhpSvfQl7mJvEy3QWK2uvMCUblI5kONB7Qp_GkfTO_IYhvZtq6t9_Lf3E-DQSxImS_lIp4A2kn797cWLmpKyLzjkjxu4eFBvOoTswUgj7o7Z1Cw',
  },
  {
    id: 3,
    title: 'The Day I Met a Talking Squirrel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3eleLBBQ8Oy0tUbp1P-T76DGcDQBMW9L4NznSpr8c6AlfHPObyFozRTP9AVRTXIKsczZ8kiHZpnvU4GUG22aYqdwISTBGdXZlX6mxz_KlYgFi9nIagNQpR-ckpQuyLlPbEskaNYP4a-dfiVPsxbg4SQQUXsm1K4KgJ6JhNRsqZZlvrE6ClXMZXHnnKZTqUD3xUUYC3lH3L8tpci1AnOMT_2SCGxwb8vEu_Z20xcQHLjI_rLKj-D195Kdk-kBXgDoBrI8Hd8eIvw',
  },
  {
    id: 4,
    title: 'The Secret of the Hidden Treasure',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbnb-YaAwCe1k8WzyHtmJBO9KEcoEEuUrt6ifUVM8Gyfnyn6xjeGddWM15nEAuW786AEOTrc0dmD1fLDWrBeOyOnpoH5IAV9Oqkbet8v_yt2Gg7NY7jKVWMAQexWbwv-s36OnyDp-Rw-UIjjTINURyeB9ynHhFwg2pcw0u4UN-R90pmwHMe_yb_nWTdqyAG2shU2uaFcR0rZtkueIUZNHTxtZBE9-mVXFJg4g88c__KPqSahn7nGf-RBQ8YjP4sioUe3ZZCuDkxQ',
  },
];

const StoryCard = ({ story, onPress }) => (
  <TouchableOpacity style={styles.storyCard} onPress={onPress}>
    <Image source={{ uri: story.image }} style={styles.storyImage} />
    <Text style={styles.storyTitle}>{story.title}</Text>
  </TouchableOpacity>
);


export default function App() {
    const navigation = useNavigation();
  const [activeTab, setActiveTab] = React.useState('Library');

  const handleStoryPress = (story) => {
    console.log('Story pressed:', story.title);
    // Navigate to story detail or handle story selection
  };

  const handleAddPress = () => {
navigation.navigate("story_details")
};

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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.storiesGrid}>
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onPress={() => handleStoryPress(story)}
            />
          ))}
        </View>
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
    paddingBottom: 12,
  }
});