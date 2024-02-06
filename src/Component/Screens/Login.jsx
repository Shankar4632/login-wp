// Login.js
import React, { useState } from "react";

import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    // Validate email and password
    const { email, password } = formData;
    if (!email || !password) {
      Alert.alert("Please enter email and password");
      return;
    }
    // Your login logic here
    console.log("Attempting login with email:", email); // Add this line
    axios
      .post("https://nxsinfotech.com/server/wp-json/jwt-auth/v1/token", {
        username: email,
        password: password,
      })
      .then((response) => {
        console.log("Login response:", response.data); // Check if response.data contains user data
        if (response.status === 200 && response.statusText === "OK") {
          AsyncStorage.setItem("user", JSON.stringify(response.data))
            .then(() => {
              console.log("User data successfully stored:", response.data);
              navigation.navigate("AddPost", { userData: response.data }); // Ensure this navigation logic is reached
            })
            .catch((error) => {
              console.error("Error storing user data:", error);
            });
        }
      })
      .catch((error) => {
        console.log("AxiosError:", error); // Log detailed AxiosError
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log("Server Response Data:", error.response.data);
          console.log("Server Response Status:", error.response.status);
          console.log("Server Response Headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error setting up the request:", error.message);
        }
        Alert.alert(
          "Network Error",
          "Failed to connect to the server. Please check your network connection."
        );
      });
  };

  const setEmail = (text) => {
    setFormData({ ...formData, email: text });
  };

  const setPassword = (text) => {
    setFormData({ ...formData, password: text });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* <Button title="Login" onPress={() => navigation.navigate("AddPost")} /> */}
      <TouchableOpacity onPress={handleLogin}>
        <Button title="Login" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default Login;
