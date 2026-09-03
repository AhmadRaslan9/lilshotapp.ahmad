import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AuthNavigator from '../screens/auth/AuthNavigator';
import MainTabs from './MainTabs';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';

export default function RootNavigator() {
  const { isAuthenticated, initializing, isFirebaseConfigured } = useAuth();

  if (initializing && isFirebaseConfigured) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <MainTabs /> : <AuthNavigator />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});