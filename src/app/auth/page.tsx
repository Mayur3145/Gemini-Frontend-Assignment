'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhoneLogin from '@/components/auth/PhoneLogin';
import OtpVerification from '@/components/auth/OtpVerification';
import { useAppSelector } from '@/store';

export default function AuthPage() {
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const router = useRouter();
  const { user, otpSent } = useAppSelector((state) => state.auth);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user?.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Show OTP verification if OTP was sent
  useEffect(() => {
    if (otpSent) {
      setShowOtpVerification(true);
    }
  }, [otpSent]);

  // Handle OTP verification success
  const handleVerified = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {showOtpVerification ? (
          <OtpVerification 
            onBack={() => setShowOtpVerification(false)} 
            onVerified={handleVerified}
          />
        ) : (
          <PhoneLogin onOtpSent={() => setShowOtpVerification(true)} />
        )}
      </div>
    </div>
  );
} 