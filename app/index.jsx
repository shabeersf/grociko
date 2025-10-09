import theme from '@/utils/theme';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.1)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.sequence([
      Animated.delay(200), // Small delay for better UX
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navigate to home after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.background.gradient.splash}
        translucent={false}
      />

      {/* Full Screen Splash Image */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../assets/company/splash.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View
            style={[
              styles.loadingBar,
              {
                opacity: fadeAnim,
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  // Image Container
  imageContainer: {
    flex: 1,
    width: width,
    height: height,
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },

  // Loading Indicator
  loadingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? theme.spacing['6xl'] : theme.spacing['5xl'],
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingTrack: {
    width: 100,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
  },
  loadingBar: {
    width: '70%',
    height: '100%',
    backgroundColor: theme.colors.text.white,
    borderRadius: theme.borderRadius.sm,
    opacity: theme.opacity[90],
  },
});