import React from 'react';
import AccountForm from './AccountForm';
export default function SignUpScreen(props) {
  return <AccountForm {...props} mode="signup" />;
}
