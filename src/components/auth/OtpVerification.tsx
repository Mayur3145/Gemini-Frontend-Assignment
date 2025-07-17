'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OtpFormValues } from '@/utils/validationSchemas';
import { useAppDispatch, useAppSelector } from '@/store';
import { verifyOTP, resetOtpState } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export default function OtpVerification({ 
  onBack, 
  onVerified 
}: { 
  onBack: () => void;
  onVerified: () => void;
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const phoneNumber = useAppSelector((state) => state.auth.user?.phoneNumber || '');
  const countryCode = useAppSelector((state) => state.auth.user?.countryCode || '');

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only take the first character
    setOtp(newOtp);

    // Update form value
    setValue('otp', newOtp.join(''));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle form submission
  const onSubmit = async (data: OtpFormValues) => {
    try {
      await dispatch(verifyOTP({
        otp: data.otp,
        phoneNumber,
        countryCode,
      })).unwrap();
      
      toast.success('OTP verified successfully');
      onVerified();
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    dispatch(resetOtpState());
    onBack();
    toast.success('You can now request a new OTP');
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      handleSubmit(onSubmit)();
    }
  }, [otp]);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify OTP</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            ))}
          </div>
          
          {errors.otp && (
            <p className="text-red-500 text-xs mt-1 text-center">{errors.otp.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          <div className="flex justify-between text-sm">
            <button
              type="button"
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Change Phone Number
            </button>
            
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 