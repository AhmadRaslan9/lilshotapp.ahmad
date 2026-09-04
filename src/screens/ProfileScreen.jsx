// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GlassCard from '../components/ui/GlassCard';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { colors, radius, spacing, typography } from '../theme';

const backgroundImg = require('../assets/CoffeeShop.png');

const MENU_ITEMS = [
  { id: '1', title: 'My Orders', icon: 'shopping-bag' },
  { id: '2', title: 'Payment Methods', icon: 'credit-card' },
  { id: '3', title: 'Delivery Address', icon: 'map-pin' },
  { id: '4', title: 'Settings', icon: 'sliders' },
];

export default function ProfileScreen() {
  const { user, signOut, isFirebaseConfigured } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Guest';
  const email = user?.email || (isFirebaseConfigured ? 'Not signed in' : 'Demo mode — Firebase not connected');

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImg} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.section}>
              <GlassCard tone="dark" intensity={75} radius={radius.xxxl} style={styles.profileCard}>
                <Avatar name={displayName} />
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userEmail}>{email}</Text>

                <TouchableOpacity>
                  <GlassCard tone="light" radius={radius.md} style={styles.editButton}>
                    <Feather name="edit-2" size={14} color={colors.textOnDark} />
                    <Text style={styles.editText}>Edit Profile</Text>
                  </GlassCard>
                </TouchableOpacity>
              </GlassCard>
            </View>

            <View style={styles.section}>
              <GlassCard tone="dark" radius={radius.xxl} style={styles.menuCard}>
                {MENU_ITEMS.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, index !== MENU_ITEMS.length - 1 && styles.menuItemBorder]}
                  >
                    <View style={styles.menuLeft}>
                      <GlassCard tone="light" radius={radius.md} style={styles.menuIcon}>
                        <Feather name={item.icon} size={18} color={colors.textOnDark} />
                      </GlassCard>
                      <Text style={styles.menuTitle}>{item.title}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.textOnDarkFaint} />
                  </TouchableOpacity>
                ))}
              </GlassCard>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
              <GlassCard tone="dark" radius={radius.lg} style={styles.logoutInner}>
                <Feather name="log-out" size={18} color={colors.danger} />
                <Text style={styles.logoutText}>Log Out</Text>
              </GlassCard>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: {
    paddingHorizontal: spacing.xxl,
    marginTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: spacing.lg,
  },
  headerTitle: { ...typography.h2, color: colors.textOnDark },
  section: { paddingHorizontal: spacing.xxl, marginBottom: spacing.xl },
  profileCard: { alignItems: 'center', padding: spacing.xxl },
  userName: { fontSize: 22, fontWeight: '800', color: colors.textOnDark, marginTop: spacing.md },
  userEmail: { fontSize: 13, color: colors.textOnDarkMuted, marginTop: 2, marginBottom: spacing.lg },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 6,
  },
  editText: { color: colors.textOnDark, fontSize: 13, fontWeight: '600' },
  menuCard: { paddingVertical: spacing.sm },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg + 2,
    paddingVertical: spacing.md + 2,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md + 2 },
  menuIcon: { padding: spacing.sm },
  menuTitle: { fontSize: 15, fontWeight: '600', color: colors.textOnDark },
  logoutButton: { marginHorizontal: spacing.xxl, borderRadius: radius.lg, overflow: 'hidden' },
  logoutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
    borderColor: 'rgba(225, 88, 75, 0.4)',
  },
  logoutText: { color: colors.danger, fontSize: 16, fontWeight: '700' },
});
