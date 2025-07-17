'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneSchema, PhoneFormValues } from '@/utils/validationSchemas';
import { fetchCountries, Country } from '@/utils/countryApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { sendOTP } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function PhoneLogin({ onOtpSent }: { onOtpSent: () => void }) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { isLoading: isAuthLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '+1', // Default to US
      phoneNumber: '',
    },
  });

  // Fetch countries on component mount
  useEffect(() => {
    const getCountries = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCountries();
        setCountries(data);
        
        // Set default country (US)
        const defaultCountry = data.find(country => country.dialCode === '+1');
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
          setValue('countryCode', defaultCountry.dialCode);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        toast.error('Failed to load country data');
      } finally {
        setIsLoading(false);
      }
    };

    getCountries();
  }, [setValue]);

  // Handle form submission
  const onSubmit = async (data: PhoneFormValues) => {
    try {
      const result = await dispatch(sendOTP({
        phoneNumber: data.phoneNumber,
        countryCode: data.countryCode,
      })).unwrap();
      
      toast.success(`OTP sent to ${data.countryCode} ${data.phoneNumber}`);
      onOtpSent();
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setValue('countryCode', country.dialCode);
    setIsCountryDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Gemini</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Enter your phone number to continue
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Phone Number
          </label>
          
          <div className="flex">
            {/* Country Code Dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-sm"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              >
                {selectedCountry ? (
                  <div className="flex items-center">
                    {selectedCountry.flag && (
                      <div className="w-5 h-3 mr-2 overflow-hidden">
                        <img 
                          src={selectedCountry.flag} 
                          alt={`${selectedCountry.name} flag`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <span>{selectedCountry.dialCode}</span>
                  </div>
                ) : (
                  <span>+1</span>
                )}
                <svg 
                  className="w-4 h-4 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Country Dropdown */}
              {isCountryDropdownOpen && (
                <div className="absolute z-10 mt-1 w-64 bg-gray-50 dark:bg-gray-700 shadow-lg rounded-md max-h-60 overflow-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-sm"
                      placeholder="Search countries..."
                      onChange={(e) => {
                        // Filter countries based on search input
                        // This would be implemented in a real app
                      }}
                    />
                  </div>
                  <ul className="py-1">
                    {countries.map((country) => (
                      <li key={country.code}>
                        <button
                          type="button"
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleCountrySelect(country)}
                        >
                          {country.flag && (
                            <div className="w-5 h-3 mr-3 overflow-hidden">
                              <img 
                                src={country.flag} 
                                alt={`${country.name} flag`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <span className="mr-2">{country.name}</span>
                          <span className="text-gray-500 dark:text-gray-300 ml-auto">
                            {country.dialCode}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <input
                type="hidden"
                {...register('countryCode')}
              />
            </div>

            {/* Phone Number Input */}
            <input
              id="phoneNumber"
              type="tel"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter phone number"
              {...register('phoneNumber')}
            />
          </div>
          
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
          {errors.countryCode && (
            <p className="text-red-500 text-xs mt-1">{errors.countryCode.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isAuthLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthLoading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </div>
  );
} 