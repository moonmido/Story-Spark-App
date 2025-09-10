import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import url from '../URL/all_urls.json';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import scheduleTokenRefresh from './AuthService/scheduleTokenRefresh';


const {width, height} = Dimensions.get("window");

const Sign_In = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignIn = async () => {
  if (!formData.email || !formData.password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(
      "http://192.168.100.7:8181/realms/story-spark/protocol/openid-connect/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "spark-client",      // public client (no secret)
          grant_type: "password",
          username: formData.email,
          password: formData.password,
        }).toString(),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Login failed:", err);
      alert("Invalid credentials or server error");
      return;
    }

    const data = await response.json();
    
    const decoded = jwtDecode(data.access_token);
    const userId = decoded.sub; 
    const refreshToken = data.refresh_token;

    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("userId",userId)

    scheduleTokenRefresh(data.expires_in);

    alert("Login success 🎉");
     navigation.navigate("welcome");
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error: " + error.message);
  }
};


  const handleForgotPassword = () => {
navigation.navigate("forgot")
};
  const navigation = useNavigation();

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
          <Text style={styles.title}>Sign in</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Enter your email'
              placeholderTextColor={"gray"}
              style={styles.textInput}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />

            <TextInput
              placeholder='Enter your password'
              placeholderTextColor={"gray"}
              style={styles.textInput}
              secureTextEntry={true}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
          </View>

          <TouchableOpacity 
            style={styles.forgotPasswordContainer} 
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.signUpLinkContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={()=>navigation.navigate("signup")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: height * 0.04
  },
  inputContainer: {
    gap: 20
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 15
  },
  forgotPasswordText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '500'
  },
  signInButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: height * 0.04,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  signUpLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  signUpText: {
    color: 'gray',
    fontSize: 16
  },
  signUpLink: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default Sign_In