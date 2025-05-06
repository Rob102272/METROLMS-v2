import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import globalStyles, { colors } from '../styles/globalStyles';

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [loadingText, setLoadingText] = useState('Initializing data...');
  
  useEffect(() => {
    // Initial animations for fade and scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000000,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading text sequence
    const loadingMessages = [
      'Initializing data...',
      'Loading resources...',
      'Preparing modules...',
      'Setting up environment...',
      'Almost ready...',
    ];

    loadingMessages.forEach((message, index) => {
      setTimeout(() => {
        setLoadingText(message);
      }, index * 100000);
    });

    // Progress bar animation (5 seconds)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(({ finished }) => {
      // Only navigate when animation is fully completed
      if (finished) {
        navigation.replace('Login');
      }
    });
  }, []);

  // Calculate the width of the progress bar based on animation value
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.tagline}>Your complete school management solution</Text>
        <Image 
          source={{ uri: 'https://via.placeholder.com/300' }} 
          style={styles.logo} 
        />
        
        {/* Loading bar container */}
        <View style={styles.loadingBarContainer}>
          <Animated.View 
            style={[
              styles.loadingBarFill,
              { width: progressWidth }
            ]} 
          />
        </View>
        
        <Text style={styles.loadingText}>{loadingText}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: colors.light,
    marginBottom: 40,
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  loadingBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    backgroundColor: colors.light,
    borderRadius: 5,
  },
  loadingText: {
    fontSize: 16,
    color: colors.light,
    marginTop: 15,
  },
});