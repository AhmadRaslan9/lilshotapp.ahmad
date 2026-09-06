import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

export default function AuthNavigator() {
  const [screen, setScreen] = useState('welcome');
  if (screen === 'signin') return <SignInScreen onCancel={() => setScreen('welcome')} onSwitch={() => setScreen('signup')} />;
  if (screen === 'signup') return <SignUpScreen onCancel={() => setScreen('welcome')} onSwitch={() => setScreen('signin')} />;
  return <WelcomeScreen onSignIn={() => setScreen('signin')} onSignUp={() => setScreen('signup')} />;
}
