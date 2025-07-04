'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyOTPMutation } from '@/store/api';
import { z } from 'zod';
import { otpSchema } from '@/lib/schemas';

type OTPFormData = z.infer<typeof otpSchema>;

export function OTPForm({
  className,
  email,
  onSubmitSuccess,
  onBackToForgotPassword,
  ...props
}: React.ComponentProps<'form'> & {
  email: string;
  onSubmitSuccess: () => void;
  onBackToForgotPassword: () => void;
}) {
  type OTPError = {
    data?: {
      message?: string;
    };
    status?: number;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const [verifyOTP, { isLoading, isError, error }] = useVerifyOTPMutation();

  const onSubmit = async (data: OTPFormData) => {
    try {
      await verifyOTP({ email, otp: data.otp }).unwrap();
      onSubmitSuccess();
    } catch (err) {
      console.log('OTP verification error', err);
    }
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Enter OTP</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter the 6-digit code sent to {email}
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="otp">One-Time Password</Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            {...register('otp')}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
          )}
          {isError && (
            <p className="text-red-500 text-sm mt-1">
              {(error as OTPError)?.data?.message || 'Invalid OTP'}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? 'Verifying...' : 'Verify OTP'}
        </Button>
        <button
          type="button"
          onClick={onBackToForgotPassword}
          className="text-center text-sm underline-offset-4 hover:underline"
        >
          Back to forgot password
        </button>
      </div>
    </form>
  );
}