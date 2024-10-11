import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    require("../assets/images/slide1.webp"),
    require("../assets/images/slide2.webp"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {images.map((image, index) => (
        <Image
          key={index}
          source={image}
          style={[
            styles.image,
            {
              transform: [
                {
                  translateX: width * (index - currentImage),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150, // Make banner shorter
    width: width * 0.9, // Make it a bit smaller than the screen width
    alignSelf: "center", // Center the banner horizontally
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Align the content horizontally
    overflow: "hidden",
    marginVertical: 20, // Add vertical space to center it within the screen
  },
  image: {
    position: "absolute",
    width: width * 0.9, // Adjust width to match the container
    height: "100%",
    resizeMode: "cover",
  },
});

export default Banner;
