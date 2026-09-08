import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import AuthNavigator from '../screens/auth/AuthNavigator';
import MainTabs from './MainTabs';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import AccountBlockedScreen from '../screens/AccountBlockedScreen';
import { coffee as c } from '../theme/coffee';

export default function RootNavigator() {
  const { isAuthenticated, initializing, isFirebaseConfigured } = useAuth();
  const { profile, loading: profileLoading, error: profileError, retry } = useProfile();

  if (initializing && isFirebaseConfigured) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={c.accent} accessibilityLabel="جارٍ فتح LilShot" />
      </View>
    );
  }

  if (!isAuthenticated) return <AuthNavigator />;
  if (profileLoading) return <View style={styles.loading}><ActivityIndicator size="large" color={c.accent} /></View>;
  if (profileError) return <View style={styles.loading}><Text style={styles.error}>تعذّر تحميل ملف الحساب. تأكد من نشر قواعد Firestore.</Text><TouchableOpacity onPress={retry} style={styles.retry}><Text style={styles.retryText}>إعادة المحاولة</Text></TouchableOpacity></View>;
  if (profile?.accountStatus === 'banned') return <AccountBlockedScreen />;
  return profile ? <MainTabs /> : <ProfileSetupScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.bg,
  },
  error: { color: c.text, textAlign: 'center', maxWidth: 300, lineHeight: 23 },
  retry: { marginTop: 18, backgroundColor: c.dark, borderRadius: 24, paddingHorizontal: 24, paddingVertical: 13 },
  retryText: { color: c.onPhoto, fontWeight: '700' },
});
