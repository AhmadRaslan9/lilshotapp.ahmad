// src/screens/auth/AuthHeader.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing } from '../../theme';

const logo = require('../../assets/logo-mark.png');

export default function AuthHeader({ compact }) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.logoWrap}><Image source={logo} style={styles.logo} contentFit="contain" /></View>
      <Text style={styles.title}>Your world.{'\n'}Your little shot.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xxl + 4,
    marginTop: Platform.OS === 'android' ? 30 : 10,
    marginBottom: spacing.sm,
  },
  compact: { marginBottom: spacing.xs },
  logoWrap: { width: 82, height: 82, borderRadius: 25, backgroundColor: '#090909', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  logo: { width: 64, height: 64 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textOnDark,
    lineHeight: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
