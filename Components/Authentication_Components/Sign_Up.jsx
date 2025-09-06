import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import url from '../URL/all_urls.json';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

const Sign_Up = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = async () => {
  if (formData.password !== formData.confirmPassword || formData.password.length < 6) {
    alert("Passwords do not match or password is too short (min 6 characters)");
    return;
  }

  try {
    const response = await fetch("http://192.168.100.7:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: formData.email,
        firstname: formData.firstName,
        lastname: formData.lastName,
        password: formData.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    const data = await response.json();
    const status = data.message;
    alert(status)
    navigation.navigate("signin")
    
  } catch (error) {
    alert("Error: " + error.message);
  }
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
          <Text style={styles.title}>Sign up</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Enter your first name'
              placeholderTextColor={"gray"}
              style={styles.textInput}
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
            />

            <TextInput
              placeholder='Enter your last name'
              placeholderTextColor={"gray"}
              style={styles.textInput}
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
            />

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

            <TextInput
              placeholder='Confirm your password'
              placeholderTextColor={"gray"}
              style={styles.textInput}
              secureTextEntry={true}
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
            />
          </View>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={()=>navigation.navigate("signin")}>
              <Text style={styles.loginLink}>Login</Text>
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
  signUpButton: {
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
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  loginText: {
    color: 'gray',
    fontSize: 16
  },
  loginLink: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default Sign_Up