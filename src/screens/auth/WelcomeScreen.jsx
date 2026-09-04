// src/screens/auth/WelcomeScreen.js
import React from 'react';
import { View, Animated, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthHeader from './AuthHeader';
import GlassButton from '../../components/ui/GlassButton';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { spacing } from '../../theme';

const backgroundImg = require('../../assets/CoffeeShop.png');

export default function WelcomeScreen({ onSignIn, onSignUp, onAppleSignIn }) {
  const { opacity, translateY } = useEntranceAnimation('welcome');

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImg} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
            <AuthHeader />

            <View style={styles.buttons}>
              <GlassButton title="Sign In" variant="glass" onPress={onSignIn} />
              <GlassButton title="Continue with Apple" variant="glass" onPress={onAppleSignIn} />
              <GlassButton title="Create Account" variant="outline" onPress={onSignUp} />
            </View>
          </Animated.View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  content: { flex: 1, justifyContent: 'space-between', paddingBottom: 35 },
  buttons: { paddingHorizontal: spacing.xxl, gap: spacing.lg - 2 },
});
