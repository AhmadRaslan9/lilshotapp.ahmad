import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { BlockingProvider } from './context/BlockingContext';
import RootNavigator from './navigation/RootNavigator.jsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProfileProvider><BlockingProvider><RootNavigator /></BlockingProvider></ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
