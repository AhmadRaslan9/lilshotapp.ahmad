import React from 'react';
import AccountForm from './AccountForm';
export default function SignInScreen(props) {
  return <AccountForm {...props} mode="signin" />;
}
