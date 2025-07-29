'use client';

import { CustomForm } from '@/components/custom/custom-form';
import { CustomInput } from '@/components/custom/custom-input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { post } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const changePassSchema = z.object({
  email: z.string().email('Invalid email address'),
  oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['user', 'corporate', 'developer']),
  otp: z.string().optional(),
});

const userTypeOptions = [
  { label: 'Agent', value: 'user' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Developer', value: 'developer' },
];

type ChangePassFormValues = z.infer<typeof changePassSchema>;

const ChangePassword = () => {
  const [qrCode, setQrCode] = useState<boolean>(true);
  const [step, setStep] = useState(1); // To track the step in the form (1 for first step, 2 for second, etc.)
  const form = useForm<ChangePassFormValues>({
    resolver: zodResolver(changePassSchema),
    defaultValues: {
      email: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      userType: 'user',
    },
  });

  const handleSubmit = async () => {
    try {
      const payload = {
        email: form.getValues('email'),
        otp: form.getValues('otp'),
        newPassword: form.getValues('newPassword'),
      };
      const res = await post('/api/auth/verify-password-reset-otp', payload);
      if (res.responseData.qr_code) {
        setQrCode(res.responseData.qr_code);
        toast.success('Password reset successful.');
        setStep(3); // Move to OTP verification step
      } else {
        toast.success('Password changed successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error changing password');
    }
  };

  const callForgetPass = async () => {
    try {
      await post('/api/auth/forget-password', {
        email: form.getValues('email'),
      });
      toast.success('Enter OTP sent to your email');
      setStep(2);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.responseStatus?.message || 'Some error occured',
        );
      }
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      callForgetPass();
    }
  };

  return (
    <Card className="w-1/3 space-y-4 p-8">
    <CustomForm form={form} onSubmit={handleSubmit} className='space-y-4'>
        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-300">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${(step - 1) * 33.33}%` }}
          />
        </div>
        {/* Step 1 - User Info */}
        {step === 1 && (
          <>
            <CustomInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
            <div className="flex justify-end">
            <Button type="button" onClick={handleNextStep}>
              Next
            </Button>
            </div>
          </>
        )}

        {/* Step 2 - Password Inputs
        {step === 3 && (
          <>
            <FormInput
              form={form}
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
            />
            <FormInput
              form={form}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
            />
            <Button type="submit">Change Password</Button>
          </>
        )} */}

        {/* Step 3 - OTP (if required) */}
        {step === 2 && (
          <>
            <CustomInput
              name="otp"
              label="OTP"
              type="text"
              placeholder="Enter OTP"
            />
            <CustomInput
              name="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
            />
            <CustomInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
            />
            <Button onClick={handleSubmit}>Change Password</Button>
            {/* <Button type="button" onClick={handleNextStep}>
              Next
            </Button> */}
          </>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
              <h3 className="text-xl font-semibold text-white">
                Registration Complete!
              </h3>
              <p className="text-gray-400">
                Scan the QR code below with your authenticator app to complete
                the setup.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="rounded-lg bg-white p-4">
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code for authenticator setup"
                  className="h-48 w-48"
                />
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <p>
                • Open your authenticator app (Google Authenticator, Authy,
                etc.)
              </p>
              <p>• Scan this QR code</p>
              <p>• Save the generated codes for future logins</p>
            </div>

            <Button
              onClick={() => (window.location.href = '/login')}
              className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
            >
              Continue to Login
            </Button>
          </div>
        )}
    </CustomForm>
    </Card>
  );
};

export default ChangePassword;
