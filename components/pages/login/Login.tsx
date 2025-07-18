'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';

import { setCredentials } from '@/redux/userSlice';

import { post } from '@/lib/api';
import { CustomForm } from '@/components/custom/custom-form';
import { CustomInput } from '@/components/custom/custom-input';
import { Card } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  otp: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [requireOtp, setRequireOtp] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      const response = await post(
        '/api/auth/login',
        {
          ...data, userType: "user"
        },
        { withCredentials: true }
      );

      const { responseData } = response;

      if (responseData.require_otp) {
        setRequireOtp(true);
        toast.info('OTP sent. Please enter it to continue.');
      } else {
        const { user, accessToken } = responseData;
        dispatch(
          setCredentials({
            token: accessToken,
            user,
          })
        );
        toast.success('Logged in successfully!', { duration: 800 });
        router.refresh();
      }
    } catch (error) {
      // await clearCookies();
      toast.error('Login failed. Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-72 space-y-4 p-8">
      <h1 className='text-xl font-semibold text-center'>Admin Login</h1>
      <CustomForm form={form} onSubmit={onSubmit} className="space-y-4">
        <CustomInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          disabled={requireOtp} // Disable when OTP required
        />

        <CustomInput
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          disabled={requireOtp} // Disable when OTP required
        />

        {requireOtp && (
          <CustomInput
            name="otp"
            label="OTP"
            type="text"
            placeholder="Enter OTP"
          />
        )}

        <Button
          type="submit"
          className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login'}
        </Button>
      </CustomForm>
    </Card>
  );
}
