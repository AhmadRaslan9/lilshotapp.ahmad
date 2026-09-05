import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import GlassButton from '../../components/ui/GlassButton';
import { useAuth } from '../../context/AuthContext';

const backgroundImg = require('../../assets/CoffeeShop.png');
const logoImg = require('../../assets/Logolilshot1.png');

export default function WelcomeScreen({ onSignIn, onSignUp }) {
  const { enterAsGuest, isFirebaseConfigured } = useAuth();

  const handleStart = () => {
    if (!isFirebaseConfigured) enterAsGuest();
    else onSignUp();
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImg} style={styles.background} resizeMode="cover">
        <LinearGradient
          colors={['rgba(18,14,11,0.05)', 'rgba(18,14,11,0.35)', 'rgba(18,14,11,0.92)']}
          style={StyleSheet.absoluteFill}
        />

        <SafeAreaView style={styles.safe}>
          <Image source={logoImg} style={styles.logo} contentFit="contain" />

          <View style={styles.bottom}>
            <Text style={styles.headline}>
              Revolutionizing Your{'\n'}Shots, One{' '}
              <Text style={styles.accent}>Cup</Text>
              {'\n'}at a Time.
            </Text>

            <GlassButton
              title="Start now    >>>"
              variant="cta"
              onPress={handleStart}
            />

            <Text style={styles.hint} onPress={onSignIn}>
              Already have an account?{' '}
              <Text style={styles.link}>Log in</Text>
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120E0C' },
  background: { flex: 1 },
  safe: { flex: 1, justifyContent: 'space-between' },
  logo: { width: 88, height: 88, marginTop: 12, marginLeft: 24 },
  bottom: { paddingHorizontal: 24, paddingBottom: 36, gap: 16 },
  headline: {
    color: '#FFF8F2',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  accent: { color: '#E9A66B' },
  hint: {
    color: 'rgba(255,248,242,0.7)',
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 8,
  },
  link: { color: '#E9A66B', fontWeight: '700' },
});