// src/screens/HomeScreen.js
import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import IconButton from '../components/ui/IconButton';
import TourCard from '../components/TourCard';
import { useTours } from '../hooks/useTours';
import { colors, spacing } from '../theme';

const logoImg = require('../assets/coffeecup.png');

export default function HomeScreen() {
  const { tours } = useTours();
  const validTours = useMemo(() => tours.filter((t) => t && t.id), [tours]);

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <Image source={logoImg} style={styles.logo} contentFit="contain" />
        <IconButton onPress={() => {}}>
          <Ionicons name="search-outline" size={22} color={colors.textPrimary} />
        </IconButton>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {validTours.map((item) => (
          <TourCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl - 4,
    paddingVertical: spacing.md,
  },
  logo: { width: 38, height: 38 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
});
