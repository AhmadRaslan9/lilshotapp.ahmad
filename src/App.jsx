import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import RootNavigator from './navigation/RootNavigator.jsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavoritesProvider>
          <RootNavigator />
        </FavoritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}