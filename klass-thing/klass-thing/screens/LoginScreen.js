import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Vibration,
  Keyboard,
  Pressable,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Add import for Haptics
import * as Haptics from 'expo-haptics';

// Colors constant for consistency
const colors = {
  primary: '#4960F9',
  secondary: '#1A1F3D',
  gray: '#888',
  lightGray: '#e0e0e0',
  error: '#e53935',
  white: '#FFFFFF',
  black: '#000000',
  background: '#23283b',
  bypass: '#28a745',  // Color for bypass option
};

// Using require for static assets for better performance
const Logo = require('../assets/logo.jpg');
const BG_PATTERN = require('../assets/bg.jpg');

// Random user credentials for demo
const DEMO_USER = {
  email: "john.smith@example.com",
  password: "Password123!",
};

// Secret bypass key combination
const BYPASS_KEY = "BYPASS2025";
const BYPASS_TAP_COUNT = 5;

// Password strength indicator
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'None', color: '#ccc' };
  
  let score = 0;
  if (password.length > 6) score += 1;
  if (password.length > 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  const strengthMap = [
    { score: 0, label: 'None', color: '#ccc' },
    { score: 1, label: 'Weak', color: '#ff4d4d' },
    { score: 2, label: 'Fair', color: '#ffa64d' },
    { score: 3, label: 'Good', color: '#ffff4d' },
    { score: 4, label: 'Strong', color: '#4dff4d' },
    { score: 5, label: 'Excellent', color: '#00cc00' },
  ];
  
  return strengthMap[score];
};

export default function LoginScreen({ onLogin, onRegister }) {
  // Get dynamic window dimensions for responsive layout
  const { width, height } = useWindowDimensions();
  const isSmallScreen = height < 700;
  const isLandscape = width > height;
  
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [logoText, setLogoText] = useState("LOGIN");
  const [savedUserEmail, setSavedUserEmail] = useState(null);
  
  // Bypass mode state
  const [bypassTapCount, setBypassTapCount] = useState(0);
  const [bypassTimerActive, setBypassTimerActive] = useState(false);
  const [bypassKeyVisible, setBypassKeyVisible] = useState(false);
  const [bypassKey, setBypassKey] = useState('');
  const bypassTimerRef = useRef(null);
  
  // Error states
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const containerScale = useRef(new Animated.Value(1)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const bgOpacity = useRef(new Animated.Value(0.1)).current;
  const passwordStrengthWidth = useRef(new Animated.Value(0)).current;
  const keyboardHeight = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const bypassSlideIn = useRef(new Animated.Value(-100)).current;
  
  // Loading animation for dots
  const loadingDot1 = useRef(new Animated.Value(0.7)).current;
  const loadingDot2 = useRef(new Animated.Value(0.7)).current;
  const loadingDot3 = useRef(new Animated.Value(0.7)).current;

  // Setup loading animation
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingDot1, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(loadingDot2, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(loadingDot3, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(loadingDot1, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(loadingDot2, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(loadingDot3, {
            toValue: 0.7,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isLoading]);
  
  // Check for saved user email on component mount
  useEffect(() => {
    const checkSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedEmail) {
          setSavedUserEmail(savedEmail);
          setEmail(savedEmail);
          setRememberMe(true);
        } else {
          // If no saved email is found, use the demo one
          setSavedUserEmail(DEMO_USER.email);
          setEmail(DEMO_USER.email);
        }
      } catch (error) {
        console.log('Error retrieving saved email:', error);
        // Fallback to default email
        setSavedUserEmail(DEMO_USER.email);
        setEmail(DEMO_USER.email);
      }
    };
    
    checkSavedEmail();
  }, []);
  
  // Track keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeight, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        // Shrink logo when keyboard appears
        Animated.timing(logoAnim, {
          toValue: isSmallScreen ? 0.6 : 0.8,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.timing(keyboardHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
        
        // Restore logo when keyboard hides
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isSmallScreen]);
  
  // Update password strength indicator when password changes
  useEffect(() => {
    const strength = getPasswordStrength(password);
    Animated.timing(passwordStrengthWidth, {
      toValue: strength.score / 5,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [password]);

  // Handle bypass timer
  useEffect(() => {
    if (bypassTimerActive) {
      bypassTimerRef.current = setTimeout(() => {
        setBypassTapCount(0);
        setBypassTimerActive(false);
      }, 3000); // Reset after 3 seconds of inactivity
    }
    
    return () => {
      if (bypassTimerRef.current) {
        clearTimeout(bypassTimerRef.current);
      }
    };
  }, [bypassTimerActive, bypassTapCount]);

  // Input validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Save user email to AsyncStorage
  const saveUserEmail = async (email) => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('userEmail', email);
      } else {
        await AsyncStorage.removeItem('userEmail');
      }
    } catch (error) {
      console.log('Error saving user email:', error);
    }
  };

  // Handle logo tap for bypass activation
  const handleLogoTap = () => {
    const newCount = bypassTapCount + 1;
    setBypassTapCount(newCount);
    setBypassTimerActive(true);
    
    // Provide subtle feedback
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Vibration.vibrate(40);
    }
    
    // Show bypass key input field after the required number of taps
    if (newCount === BYPASS_TAP_COUNT) {
      setBypassKeyVisible(true);
      Animated.timing(bypassSlideIn, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Provide stronger feedback for complete sequence
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Vibration.vibrate([0, 70, 50, 70]);
      }
    }
  };

  // Handle bypass authentication
  const handleBypass = () => {
    if (bypassKey === BYPASS_KEY) {
      // Provide success feedback
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Vibration.vibrate([0, 70, 50, 70, 50, 70]);
      }
      
      // Success animation
      Animated.sequence([
        Animated.timing(containerScale, {
          toValue: 1.03,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(containerScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Use the bypass to directly login
      const bypassUser = {
        email: 'bypass@admin.com',
        password: 'bypassUser',
        admin: true,
        bypass: true
      };
      
      setIsLoading(true);
      
      setTimeout(() => {
        setIsLoading(false);
        onLogin && onLogin(bypassUser);
      }, 1000);
    } else {
      // Error feedback
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Vibration.vibrate(150);
      }
      
      // Shake animation on error
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      setBypassKey('');
    }
  };

  // Hide bypass key input
  const hideBypassInput = () => {
    Animated.timing(bypassSlideIn, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setBypassKeyVisible(false);
      setBypassKey('');
      setBypassTapCount(0);
    });
  };

  // Function to fill in demo credentials
  const fillDemoCredentials = () => {
    setEmail(DEMO_USER.email);
    setPassword(DEMO_USER.password);
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Function to handle forgot password
  const handleForgotPassword = () => {
    if (email && validateEmail(email)) {
      Alert.alert(
        "Password Reset",
        `A password reset link has been sent to ${email}`,
        [{ text: "OK" }]
      );
    } else {
      Alert.alert(
        "Email Required",
        "Please enter a valid email address to reset your password",
        [{ text: "OK" }]
      );
      setEmailError(true);
    }
  };

  // Primary action handler (login or register)
  const handleAction = () => {
    let hasError = false;

    // Reset error states
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);

    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    }

    // Validate password
    if (!password || !validatePassword(password)) {
      setPasswordError(true);
      hasError = true;
    }

    // Check password match for registration
    if (!isLogin && password !== confirmPassword) {
      setConfirmPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      // Provide haptic feedback for error
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Vibration.vibrate(150);
      }
      
      // Shake animation on error
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      Alert.alert('Error', 'Please correct the highlighted fields');
      return;
    }

    // Start loading animation
    setIsLoading(true);
    
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Provide success haptic feedback
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate(80);
    }

    // Animate background
    Animated.timing(bgOpacity, {
      toValue: 0.2,
      duration: 500,
      useNativeDriver: false,
    }).start();

    // Save user email if "Remember me" is selected
    if (isLogin && rememberMe) {
      saveUserEmail(email);
    }

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      
      if (isLogin) {
        // Check if using demo credentials
        if (email === DEMO_USER.email && password === DEMO_USER.password) {
          onLogin && onLogin({ email, password, rememberMe });
        } else {
          // In a real app, you would verify against a server
          // For this demo, we'll allow login with any valid format
          if (validateEmail(email) && validatePassword(password)) {
            onLogin && onLogin({ email, password, rememberMe });
          } else {
            Alert.alert('Login Failed', 'Invalid credentials. Try the demo credentials.');
          }
        }
      } else {
        // Success animation for registration
        Animated.sequence([
          Animated.timing(containerScale, {
            toValue: 1.03,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(containerScale, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        Alert.alert('Success', 'Account created successfully', [
          { text: 'OK', onPress: () => toggleAuthMode() },
        ]);
        
        onRegister && onRegister({ email, password });
      }
      
      // Reset background animation
      Animated.timing(bgOpacity, {
        toValue: 0.1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 1200);
  };

  // Handle social login
  const handleSocialLogin = (platform) => {
    Alert.alert(
      `${platform} Login`,
      `${platform} login is not implemented in this demo`,
      [{ text: "OK" }]
    );
  };

  // Toggle between login and register modes
  const toggleAuthMode = () => {
    // Reset bypass state if active
    if (bypassKeyVisible) {
      hideBypassInput();
    }
    
    // Reset error states and form values
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    
    // Fade out the text first
    Animated.timing(textOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Update text value while it's invisible
      setLogoText(isLogin ? "SIGN UP" : "LOGIN");
      
      // Fade text back in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
    
    // Logo animation during transition
    Animated.sequence([
      Animated.timing(logoRotate, {
        toValue: isLogin ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Form transition animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: isLogin ? -30 : 30,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change state after fade out
      setIsLogin(!isLogin);
      setEmail(isLogin ? '' : savedUserEmail || '');
      setPassword('');
      setConfirmPassword('');
      slideAnim.setValue(isLogin ? 30 : -30);

      // Animate back in with new form
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Dynamic sizing based on screen size
  const getDynamicStyles = () => {
    return {
      logoSize: {
        width: isSmallScreen ? 100 : (isLandscape ? 110 : 140),
        height: isSmallScreen ? 100 : (isLandscape ? 110 : 140),
        borderRadius: isSmallScreen ? 50 : (isLandscape ? 55 : 70),
      },
      logoTextSize: {
        fontSize: isSmallScreen ? 12 : 14,
      },
      logoContainer: {
        marginBottom: isSmallScreen ? 15 : (isLandscape ? 10 : 25),
      },
      containerPadding: {
        padding: isSmallScreen ? 15 : (isLandscape ? 20 : 25),
      },
      floatingContainerHeight: {
        // Dynamically adjust height based on login/register and screen size
        height: isSmallScreen 
          ? (isLogin ? 480 : 550) 
          : (isLogin ? 520 : 580)
      },
      scrollViewPadding: {
        paddingVertical: isSmallScreen ? 20 : (isLandscape ? 15 : 30),
        paddingHorizontal: isLandscape ? 20 : 0,
      },
      inputContainerHeight: {
        height: isSmallScreen ? 80 : 90,
      },
      placeholderHeight: {
        height: isSmallScreen ? 80 : 90,
      }
    };
  };

  const dynamicStyles = getDynamicStyles();

  // Implementation of missing renderSavedUser function
  const renderSavedUser = () => {
    if (isLogin && savedUserEmail) {
      return (
        <View style={styles.savedUserContainer}>
          <Text style={styles.savedUserText}>
            Demo user: <Text style={styles.savedUserEmail}>{savedUserEmail}</Text>
          </Text>
          <TouchableOpacity 
            style={styles.useDemoButton}
            onPress={fillDemoCredentials}
          >
            <Text style={styles.useDemoText}>Use demo credentials</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  // Render bypass key input
  const renderBypassInput = () => {
    if (!bypassKeyVisible) return null;
    
    return (
      <Animated.View 
        style={[
          styles.bypassContainer,
          { transform: [{ translateX: bypassSlideIn }] }
        ]}
      >
        <View style={styles.bypassInputContainer}>
          <TextInput
            style={styles.bypassInput}
            placeholder="Enter bypass key"
            value={bypassKey}
            onChangeText={setBypassKey}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
          <View style={styles.bypassButtons}>
            <TouchableOpacity 
              style={[styles.bypassButton, styles.bypassSubmitButton]} 
              onPress={handleBypass}
            >
              <Text style={styles.bypassButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bypassButton, styles.bypassCancelButton]} 
              onPress={hideBypassInput}
            >
              <Text style={styles.bypassCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  // Reusable input field renderer
  const renderInputField = (
    label,
    value,
    setValue,
    placeholder,
    isSecure = false,
    showSecureText = false,
    toggleSecureText = null,
    keyboardType = 'default',
    hasError = false,
    errorMessage = '',
    icon = null,
    onFocus = null,
    onBlur = null
  ) => (
    <View style={[styles.inputContainer, dynamicStyles.inputContainerHeight]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>
      <View style={{ 
        position: 'relative', 
        width: '100%',
        borderWidth: 1,
        borderColor: hasError ? colors.error : (value ? colors.primary : '#e0e0e0'),
        borderRadius: 12,
        backgroundColor: hasError 
          ? 'rgba(229, 57, 53, 0.05)'
          : value ? 'rgba(100, 120, 240, 0.05)' : '#f9f9f9',
        overflow: 'hidden'
      }}>
        {icon && (
          <View style={styles.inputIcon}>
            {icon}
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            isSmallScreen && { height: 50 },
            icon && { paddingLeft: 45 }
          ]}
          placeholder={placeholder}
          secureTextEntry={isSecure && !showSecureText}
          value={value}
          onChangeText={setValue}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
          placeholderTextColor="#aaa"
          onFocus={() => {
            if (onFocus) onFocus();
            // Subtle feedback
            if (Platform.OS === 'ios' && Haptics) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
          onBlur={() => {
            if (onBlur) onBlur();
          }}
        />
        {isSecure && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={toggleSecureText}
            activeOpacity={0.7}>
            <Ionicons
              name={showSecureText ? 'eye-off' : 'eye'}
              size={24}
              color={value ? colors.primary : colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
      
      {/* Password strength meter */}
      {isSecure && value && !hasError && (
        <View style={styles.passwordStrengthContainer}>
          <View style={styles.passwordStrengthBG}>
            <Animated.View 
              style={[
                styles.passwordStrengthIndicator,
                { width: passwordStrengthWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: passwordStrengthWidth.interpolate({
                    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    outputRange: ['#ccc', '#ff4d4d', '#ffa64d', '#ffff4d', '#4dff4d', '#00cc00']
                  })
                }
              ]}
            />
          </View>
          <Text style={styles.passwordStrengthText}>
            {getPasswordStrength(value).label}
          </Text>
        </View>
      )}
    </View>
  );

  // Placeholder component for consistent form size
  const renderConfirmPasswordPlaceholder = () => {
    if (isLogin) {
      return <View style={[styles.placeholderContainer, dynamicStyles.placeholderHeight]} />;
    }
    return null;
  };

  // Social login buttons
  const renderSocialLogin = () => (
    <View style={styles.socialLoginContainer}>
      <TouchableOpacity 
        style={styles.socialButton} 
        activeOpacity={0.8}
        onPress={() => handleSocialLogin('Google')}
      >
        <FontAwesome5 name="google" size={20} color="#EA4335" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.socialButton} 
        activeOpacity={0.8}
        onPress={() => handleSocialLogin('Facebook')}
      >
        <FontAwesome5 name="facebook" size={20} color="#3b5998" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.socialButton} 
        activeOpacity={0.8}
        onPress={() => handleSocialLogin('Apple')}
      >
        <FontAwesome5 name="apple" size={20} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.socialButton} 
        activeOpacity={0.8}
        onPress={() => handleSocialLogin('Twitter')}
      >
        <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
      </TouchableOpacity>
    </View>
  );

  
  // Translate Y for logo based on keyboard visibility
  const translateY = keyboardHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isSmallScreen ? -40 : -50],
  });

  // Rotate animation for logo
  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Background Image */}
      <Image 
        source={BG_PATTERN} 
        style={[
          styles.backgroundImage,
          { opacity: bgOpacity }
        ]} 
        resizeMode="cover" 
      />
      
      {/* Bypass key input */}
      {renderBypassInput()}
      
      {/* Main container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollViewContent, dynamicStyles.scrollViewPadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.floatingContainer, 
              dynamicStyles.containerPadding,
              dynamicStyles.floatingContainerHeight,
              { 
                opacity: fadeAnim,
                transform: [
                  { translateX: slideAnim },
                  { scale: containerScale }
                ] 
              }
            ]}
          >
            {/* Logo and Title */}
            <Pressable 
              onPress={handleLogoTap}
              style={[styles.logoContainer, dynamicStyles.logoContainer]}
            >
              <Animated.View
                style={[
                  dynamicStyles.logoSize,
                  {
                    transform: [
                      { scale: logoAnim },
                      { translateY },
                      { rotate: spin }
                    ]
                  }
                ]}
              >
                <Image
                  source={Logo}
                  style={[styles.logo, dynamicStyles.logoSize]}
                  resizeMode="cover"
                />
              </Animated.View>
              <Animated.Text 
                style={[
                  styles.logoText, 
                  dynamicStyles.logoTextSize,
                  { opacity: textOpacity }
                ]}
              >
                {logoText}
              </Animated.Text>
            </Pressable>

            {/* Saved User Info */}
            {renderSavedUser()}
            
            {/* Form Fields */}
            <Animated.View style={{ width: '100%' }}>
              {/* Email Input */}
              {renderInputField(
                'Email',
                email,
                setEmail,
                'Enter your email',
                false,
                false,
                null,
                'email-address',
                emailError,
                'Please enter a valid email',
                <MaterialCommunityIcons name="email-outline" size={24} color={emailError ? colors.error : colors.gray} />,
              )}
              
              {/* Password Input */}
              {renderInputField(
                'Password',
                password,
                setPassword,
                'Enter your password',
                true,
                showPassword,
                () => setShowPassword(!showPassword),
                'default',
                passwordError,
                'Password must be at least 6 characters',
                <MaterialCommunityIcons name="lock-outline" size={24} color={passwordError ? colors.error : colors.gray} />,
                () => setPasswordFocused(true),
                () => setPasswordFocused(false)
              )}
              
              {/* Confirm Password (Registration only) */}
              {!isLogin ? (
                renderInputField(
                  'Confirm Password',
                  confirmPassword,
                  setConfirmPassword,
                  'Confirm your password',
                  true,
                  showConfirmPassword,
                  () => setShowConfirmPassword(!showConfirmPassword),
                  'default',
                  confirmPasswordError,
                  'Passwords do not match',
                  <MaterialCommunityIcons name="lock-check-outline" size={24} color={confirmPasswordError ? colors.error : colors.gray} />
                )
              ) : renderConfirmPasswordPlaceholder()}

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <View style={styles.rememberForgotContainer}>
                  <TouchableOpacity 
                    style={styles.rememberContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxChecked
                    ]}>
                      {rememberMe && (
                        <Ionicons name="checkmark" size={14} color={colors.white} />
                      )}
                    </View>
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={handleForgotPassword}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {/* Primary Action Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    isLoading && styles.buttonDisabled
                  ]}
                  onPress={handleAction}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={[styles.loadingDot, { opacity: loadingDot1 }]} />
                      <Animated.View style={[styles.loadingDot, { opacity: loadingDot2 }]} />
                      <Animated.View style={[styles.loadingDot, { opacity: loadingDot3 }]} />
                    </View>
                  ) : (
                    <View style={styles.buttonContentContainer}>
                      <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Create Account'}</Text>
                      <Ionicons name="arrow-forward" size={20} color={colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
              
              {/* Social Login Section */}
              <View style={styles.orContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.divider} />
              </View>
              
              {renderSocialLogin()}
              
              {/* Toggle between Login/Register */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </Text>
                <TouchableOpacity onPress={toggleAuthMode} activeOpacity={0.7}>
                  <Text style={styles.toggleButton}>
                    {isLogin ? "Sign Up" : "Login"}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Application styles
const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  logoText: {
    marginTop: 10,
    color: colors.secondary,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  savedUserContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  savedUserText: {
    fontSize: 13,
    color: colors.gray,
    flex: 1,
  },
  savedUserEmail: {
    fontWeight: 'bold',
    color: colors.secondary,
  },
  useDemoButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.primary,
    borderRadius: 6,
    marginLeft: 8,
  },
  useDemoText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  placeholderContainer: {
    width: '100%',
    marginBottom: 15,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  requiredStar: {
    color: colors.error,
    marginLeft: 2,
  },
  input: {
    height: 56,
    paddingHorizontal: 15,
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '400',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 16,
    zIndex: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
    padding: 5,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  passwordStrengthBG: {
    flex: 1,
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    overflow: 'hidden',
  },
  passwordStrengthIndicator: {
    height: '100%',
  },
  passwordStrengthText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15, 
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  rememberText: {
    fontSize: 14,
    color: colors.secondary,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: `${colors.primary}80`,
  },
  buttonContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginHorizontal: 3,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  orText: {
    marginHorizontal: 15,
    color: colors.gray,
    fontWeight: '500',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: colors.white,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleText: {
    color: colors.gray,
    fontSize: 14,
  },
  toggleButton: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  bypassContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 100,
    width: '90%',
  },
  bypassInputContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bypassInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: colors.white,
    marginRight: 10,
  },
  bypassButtons: {
    flexDirection: 'row',
  },
  bypassButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 5,
  },
  bypassSubmitButton: {
    backgroundColor: colors.bypass,
  },
  bypassCancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bypassButtonText: {
    color: colors.white,
    fontWeight: '500',
  },
  bypassCancelText: {
    color: colors.white,
    fontWeight: '500',
  }
});