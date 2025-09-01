import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, StatusBar, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import url from '../URL/all_urls.json';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

const Forgot_Password = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendVerification = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Add your forgot password API call here
      // Example: await forgotPasswordAPI(email);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
        setIsEmailSent(true);
      }, 2000);
      
      console.log('Verification email sent to:', email);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to send verification email. Please try again.');
    }
  };

  const handleResendEmail = () => {
    setIsEmailSent(false);
    handleSendVerification();
  };

  const handleBackToLogin = () => {
navigation.navigate("signin")
};

const navigation = useNavigation();

  if (isEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"dark-content"}/>
        
        <View style={styles.mainContainer}>
          <View>
            <Image 
              source={{uri: url.welcome_page_back}} 
              style={styles.backgroundImage}
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Check Your Email</Text>
            
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>
                We've sent a password reset link to:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.instructionText}>
                Please check your email and follow the instructions to reset your password.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={handleResendEmail}
            >
              <Text style={styles.buttonText}>Resend Email</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBackToLogin}
            >
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"}/>
      
      <View style={styles.mainContainer}>
        <View>
          <Image 
            source={{uri: url.welcome_page_back}} 
            style={styles.backgroundImage}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Forgot Password</Text>
          
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Enter your email'
              placeholderTextColor={"gray"}
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.sendButton, 
              isLoading && styles.disabledButton
            ]} 
            onPress={handleSendVerification}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Sending...' : 'Send Verification Email'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backToSignInContainer} 
            onPress={handleBackToLogin}
          >
            <Text style={styles.backToSignInText}>
              Remember your password? 
            </Text>
            <Text style={styles.backToSignInLink}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#122118',
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  backgroundImage: {
    height: height * 0.35,
    width,
    marginTop: -height * 0.04
  },
  formContainer: {
    marginTop: height * 0.03,
    paddingHorizontal: 30,
    width: '100%'
  },
  title: {
    color: "white",
    fontSize: 27,
    fontWeight: "bold",
    textAlign: 'center',
    marginBottom: 20
  },
  subtitle: {
    color: 'lightgray',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: height * 0.04,
    lineHeight: 22
  },
  inputContainer: {
    marginBottom: 20
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.6)'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  backToSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    alignItems: 'center'
  },
  backToSignInText: {
    color: 'gray',
    fontSize: 16
  },
  backToSignInLink: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold'
  },
  // Success screen styles
  messageContainer: {
    alignItems: 'center',
    marginBottom: height * 0.04
  },
  messageText: {
    color: 'lightgray',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10
  },
  emailText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20
  },
  instructionText: {
    color: 'lightgray',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20
  },
  resendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15
  },
  backButton: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50'
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default Forgot_Password