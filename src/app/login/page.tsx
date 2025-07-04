

"use client"

import { Bot } from 'lucide-react';
import { LoginForm } from '@/components/login-form';
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { OTPForm } from '@/components/otp-form';
import { ResetPasswordForm } from '@/components/reset-password-form'; 
import Link from 'next/link';
import loginImage from '@/app/assets/login.avif';
import Image from 'next/image';
import { useState } from 'react';

export default function LoginPage() {
  type FormState = 'login' | 'forgot' | 'otp' | 'reset';
  const [formState, setFormState] = useState<FormState>('login');
  const [email, setEmail] = useState<string>('');

  const handleForgotPassword = () => {
    setFormState('forgot');
  };

  const handleForgotPasswordSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setFormState('otp');
  };

  const handleOTPVerificationSuccess = () => {
    setFormState('reset'); 
  };

  const handleResetPasswordSuccess = () => {
    setFormState('login'); 
    setEmail('');
  };

  const handleBackToLogin = () => {
    setFormState('login');
    setEmail('');
  };

  const handleBackToForgotPassword = () => {
    setFormState('forgot');
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Bot className="size-4" />
            </div>
            Afibie
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {formState === 'login' && (
              <LoginForm onForgotPassword={handleForgotPassword} />
            )}
            {formState === 'forgot' && (
              <ForgotPasswordForm
                onSubmitSuccess={handleForgotPasswordSuccess}
                onBackToLogin={handleBackToLogin}
              />
            )}
            {formState === 'otp' && (
              <OTPForm
                email={email}
                onSubmitSuccess={handleOTPVerificationSuccess}
                onBackToForgotPassword={handleBackToForgotPassword}
              />
            )}
            {formState === 'reset' && (
              <ResetPasswordForm
                email={email}
                onSubmitSuccess={handleResetPasswordSuccess}
                onBackToOTP={() => setFormState('otp')} // Optional back button
              />
            )}
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={loginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}