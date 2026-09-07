import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import RootNavigator from './navigation/RootNavigator.jsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProfileProvider><RootNavigator /></ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
