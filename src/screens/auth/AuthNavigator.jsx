import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import { ScreenTransition } from '../../components/coffee/Motion';

export default function AuthNavigator() {
  const [screen, setScreen] = useState('welcome');
  if (screen === 'signin') return <ScreenTransition screenKey="signin"><SignInScreen onCancel={() => setScreen('welcome')} onSwitch={() => setScreen('signup')} /></ScreenTransition>;
  if (screen === 'signup') return <ScreenTransition screenKey="signup"><SignUpScreen onCancel={() => setScreen('welcome')} onSwitch={() => setScreen('signin')} /></ScreenTransition>;
  return <ScreenTransition screenKey="welcome"><WelcomeScreen onSignIn={() => setScreen('signin')} onSignUp={() => setScreen('signup')} /></ScreenTransition>;
}
