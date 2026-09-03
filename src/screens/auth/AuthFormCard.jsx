// src/screens/auth/AuthFormCard.js
import React from 'react';
import { Animated, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GlassCard from '../../components/ui/GlassCard';
import { colors, radius, spacing, typography } from '../../theme';

export default function AuthFormCard({ title, style, children, onCancel }) {
  return (
    <Animated.View style={[styles.wrapper, style]}>
      <GlassCard tone="darkStrong" radius={radius.xxxl} style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{title}</Text>
          {children}
          {onCancel ? (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: spacing.xl, paddingBottom: 25 },
  card: {
    paddingHorizontal: spacing.xxl,
    paddingTop: 28,
    paddingBottom: spacing.xl - 2,
    backgroundColor: 'rgba(20, 20, 25, 0.45)',
  },
  scrollContent: { paddingBottom: 10 },
  title: { ...typography.h2, color: colors.textOnDark, marginBottom: spacing.xxl },
  cancelButton: { alignSelf: 'center', marginTop: spacing.lg, padding: 6 },
  cancelText: { color: colors.textOnDarkMuted, fontSize: 15, fontWeight: '500' },
});
