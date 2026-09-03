// src/screens/auth/SignInScreen.js
import React, { useState } from 'react';
import { View, Animated, ImageBackground, KeyboardAvoidingView, Platform, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthHeader from './AuthHeader';
import AuthFormCard from './AuthFormCard';
import FormField from '../../components/ui/FormField';
import GlassButton from '../../components/ui/GlassButton';
import { useAuth } from '../../context/AuthContext';
import { useEntranceAnimation } from '../../hooks/useEntranceAnimation';
import { colors, spacing } from '../../theme';

const backgroundImg = require('../../../assets/CoffeeShop.png');

export default function SignInScreen({ onCancel, onAppleSignIn }) {
  const { signIn, authError, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { opacity, translateY } = useEntranceAnimation('signin');

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (e) {
      // authError مضبوط بالفعل داخل الـ context ويُعرض أسفل الأزرار
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

            <AuthFormCard title="Welcome back" style={{ opacity, transform: [{ translateY }] }} onCancel={onCancel}>
              {!isFirebaseConfigured ? (
                <Text style={styles.notice}>
                  وضع تجريبي: لم يتم ربط Firebase بعد، لذا سيبقى تسجيل الدخول معطلاً حتى تعبئة .env
                </Text>
              ) : null}

              <FormField label="EMAIL" icon="mail" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
              <FormField label="PASSWORD" icon="key" placeholder="••••••" secureTextEntry value={password} onChangeText={setPassword} />

              {authError ? <Text style={styles.error}>{authError}</Text> : null}

              <GlassButton title="Sign In" variant="glass" onPress={handleSubmit} loading={submitting} style={{ marginTop: spacing.sm }} />
              <GlassButton title="Continue with Apple" variant="glass" onPress={onAppleSignIn} style={{ marginTop: spacing.md }} />
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
