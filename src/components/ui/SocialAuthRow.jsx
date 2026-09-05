import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { colors } from '../../theme';

export default function SocialAuthRow({ onFacebook, onGoogle, onApple }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.btn} onPress={onFacebook} activeOpacity={0.8}>
        <FontAwesome name="facebook" size={22} color="#1877F2" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onGoogle} activeOpacity={0.8}>
        <AntDesign name="google" size={22} color="#EA4335" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onApple} activeOpacity={0.8}>
        <FontAwesome name="apple" size={22} color="#1A1410" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, justifyContent: 'center' },
  btn: {
    flex: 1,
    maxWidth: 110,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.authCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.authLine,
  },
});