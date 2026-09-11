import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { BlockingProvider } from './context/BlockingContext';
import { LanguageProvider } from './context/LanguageContext';
import RootNavigator from './navigation/RootNavigator.jsx';
import AppFonts from './components/AppFonts';

export default function App() {
  return (
    <AppFonts><SafeAreaProvider><LanguageProvider>
      <AuthProvider>
        <ProfileProvider><BlockingProvider><RootNavigator /></BlockingProvider></ProfileProvider>
      </AuthProvider>
    </LanguageProvider></SafeAreaProvider></AppFonts>
  );
}
