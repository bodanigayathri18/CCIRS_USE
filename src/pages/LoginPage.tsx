import React from 'react';
import { SignInPage } from './SignInPage';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  return <SignInPage onNavigate={onNavigate} />;
};
