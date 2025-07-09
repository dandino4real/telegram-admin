'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPasswordMutation } from '@/store/api';
import { z } from 'zod';
import { forgotPasswordSchema } from '@/lib/schemas';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  onSubmitSuccess,
  onBackToLogin,
  ...props
}: React.ComponentProps<'form'> & {
  onSubmitSuccess: (email: string) => void;
  onBackToLogin: () => void;
}) {
  type ForgotPasswordError = {
    data?: {
      message?: string;
    };
    status?: number;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [forgotPassword, { isLoading, isError, error }] = useForgotPasswordMutation();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();
      onSubmitSuccess(data.email);
    } catch (err) {
      console.log('Forgot password error', err);
    }
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email to receive a one-time password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          {isError && (
            <p className="text-red-500 text-sm mt-1">
              {(error as ForgotPasswordError)?.data?.message || 'Failed to send OTP'}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
          {isLoading || isSubmitting ? 'Sending OTP...' : 'Send OTP'}
        </Button>
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-center text-sm underline-offset-4 hover:underline"
        >
          Back to login
        </button>
      </div>
    </form>
  );
}