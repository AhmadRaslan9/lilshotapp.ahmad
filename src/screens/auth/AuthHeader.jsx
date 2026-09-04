// src/screens/auth/AuthHeader.js
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing } from '../../theme';

const logo = require('../../assets/Logolilshot1.png');

export default function AuthHeader({ compact }) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Image source={logo} style={styles.logo} contentFit="contain" />
      <Text style={styles.title}>Revolutionizing{'\n'}Your Shots</Text>
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
  logo: { width: 95, height: 95, marginBottom: spacing.sm, alignSelf: 'flex-start' },
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
