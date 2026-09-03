// src/screens/auth/AuthNavigator.js
//
// بديل AssetExample.js القديم — نفس الفكرة (تبديل شاشة محلي بدون
// مكتبة تنقل) لكن مقسّمة لملفات مستقلة وموصولة فعلياً بـ Firebase Auth
// عبر AuthContext، بدل زر "onFinish" الذي كان يتجاوز تسجيل الدخول بالكامل.

import React, { useState } from 'react';
import { Alert } from 'react-native';
import WelcomeScreen from './WelcomeScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

export default function AuthNavigator() {
  const [screen, setScreen] = useState('welcome');

  const handleAppleSignIn = () => {
    Alert.alert('Apple Sign In', 'يتطلب هذا الخيار تفعيل Sign in with Apple على مشروع Firebase.');
  };

  if (screen === 'signin') {
    return <SignInScreen onCancel={() => setScreen('welcome')} onAppleSignIn={handleAppleSignIn} />;
  }

  if (screen === 'signup') {
    return <SignUpScreen onCancel={() => setScreen('welcome')} />;
  }

  return (
    <WelcomeScreen
      onSignIn={() => setScreen('signin')}
      onSignUp={() => setScreen('signup')}
      onAppleSignIn={handleAppleSignIn}
    />
  );
}
