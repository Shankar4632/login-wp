// AddPost.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddPost = ({ route }) => {
  // const { user } = route.params;
  const { userData } = route.params;
  console.log("User prop:", userData);

  const [post, setPost] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChangepost = (name, value) => {
    setPost({
      ...post,
      [name]: value,
    });
  };
  AsyncStorage.getItem("user")
    .then((user) => {
      if (user !== null) {
        console.log("User data:", user);
        const userData = JSON.parse(user);
        console.log("Token:", userData.token);
      } else {
        console.log("No user data found");
      }
    })
    .catch((error) => {
      console.error("Error retrieving user data:", error);
    });

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AsyncStorage.getItem("user");
      console.log("Fetched user:", user);
    };

    fetchUser();
  }, []);

  const handleSubmitPost = () => {
    setLoading(true);
    const { token } = userData ? JSON.parse(userData).token : {};

    if (!token) {
      console.error("Error: Authentication token is missing.");
      setLoading(false);
      return;
    }

    const data = {
      ...post,
      status: "publish",
    };

    axios
      .post("https://nxsinfotech.com/server/wp-json/wp/v2/posts", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Post submitted successfully:", res.data);
        // Handle success response
      })
      .catch((err) => {
        console.error("Error submitting post:", err);
        // Handle error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Add New Post
      </Text>
      <TextInput
        style={{
          width: "80%",
          padding: 10,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
        }}
        onChangeText={(text) => handleChangepost("title", text)}
        value={post.title}
        placeholder="Title"
      />
      <TextInput
        style={{
          width: "80%",
          height: 150,
          padding: 10,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 20,
        }}
        onChangeText={(text) => handleChangepost("content", text)}
        value={post.content}
        multiline={true}
        placeholder="Content"
      />
      <Button
        title="Submit Post"
        onPress={handleSubmitPost}
        // disabled={loading}
      />
      {/* {loading && (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="#0000ff"
        />
      )} */}
    </View>
  );
};

export default AddPost;
