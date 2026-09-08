import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { BlockingProvider } from './context/BlockingContext';
import RootNavigator from './navigation/RootNavigator.jsx';
import AdminPortal from './admin/AdminPortal.jsx';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProfileProvider><BlockingProvider>{window.location.pathname === '/admin' ? <AdminPortal /> : <RootNavigator />}</BlockingProvider></ProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
