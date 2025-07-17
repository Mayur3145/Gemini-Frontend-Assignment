/**
 * Simulates sending an OTP to a phone number
 * In a real app, this would call an API endpoint
 */
export const simulateSendOTP = async (
  phoneNumber: string,
  countryCode: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Always succeed in demo mode
  return {
    success: true,
    message: `OTP sent to ${countryCode} ${phoneNumber}`,
  };
};

/**
 * Simulates verifying an OTP
 * In a real app, this would call an API endpoint
 */
export const simulateVerifyOTP = async (
  otp: string,
  phoneNumber: string,
  countryCode: string
): Promise<{ success: boolean; message: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, any 6-digit code is valid
  if (otp.length === 6) {
    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }
  
  return {
    success: false,
    message: 'Invalid OTP. Please try again.',
  };
}; 