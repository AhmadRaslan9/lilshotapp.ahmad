import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function AppFonts({ children }) {
  const [fontsLoaded] = useFonts({
    Kufam: require('../assets/fonts/Kufam-Regular.ttf'),
    'Kufam-SemiBold': require('../assets/fonts/Kufam-SemiBold.ttf'),
    'Kufam-Bold': require('../assets/fonts/Kufam-Bold.ttf'),
    Pacifico: require('../assets/fonts/Pacifico-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F2F7' }}>
      <ActivityIndicator size="small" color="#1C1C1E" />
    </View>;
  }
  return children;
}
