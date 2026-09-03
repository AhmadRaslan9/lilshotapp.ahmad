// src/screens/auth/SignUpScreen.js
import React, { useState } from 'react';
import { View, ImageBackground, KeyboardAvoidingView, Platform, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthHeader from './AuthHeader';
import AuthFormCard from './AuthFormCard';
import FormField from '../../components/ui/FormField';
import GlassButton from '../../components/ui/GlassButton';
import { useAuth } from '../../context/AuthContext';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { colors, spacing } from '../../theme';

const backgroundImg = require('../../../assets/CoffeeShop.png');

export default function SignUpScreen({ onCancel }) {
  const { signUp, authError, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { opacity, translateY } = useEntranceAnimation('signup');

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await signUp(email, password, username);
    } catch (e) {
      // authError مضبوط بالفعل داخل الـ context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImg} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.formScreen}
          >
            <AuthHeader compact />

            <AuthFormCard title="New Account" style={{ opacity, transform: [{ translateY }] }} onCancel={onCancel}>
              {!isFirebaseConfigured ? (
                <Text style={styles.notice}>
                  وضع تجريبي: لم يتم ربط Firebase بعد، لذا سيبقى إنشاء الحساب معطلاً حتى تعبئة .env
                </Text>
              ) : null}

              <FormField label="EMAIL" icon="mail" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <FormField label="USERNAME" icon="user" placeholder="Alice" value={username} onChangeText={setUsername} />
              <FormField label="PASSWORD" icon="key" placeholder="••••••" secureTextEntry value={password} onChangeText={setPassword} />

              {authError ? <Text style={styles.error}>{authError}</Text> : null}

              <GlassButton title="Sign Up" variant="glass" onPress={handleSubmit} loading={submitting} style={{ marginTop: spacing.sm }} />
            </AuthFormCard>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  formScreen: { flex: 1, justifyContent: 'flex-end' },
  error: { color: '#FFB4AC', fontSize: 13, fontWeight: '600', marginBottom: spacing.sm },
  notice: {
    color: colors.textOnDarkMuted,
    fontSize: 12,
    marginBottom: spacing.lg,
    lineHeight: 17,
  },
});
