'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../model/auth.store';
import { ApiError } from '@/shared/lib/apiFetch';

const schema = z
  .object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'At least 8 characters')
      .refine((v) => /[a-zA-Z]/.test(v), 'Must contain a letter')
      .refine((v) => /[0-9]/.test(v), 'Must contain a digit'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const data = await authApi.register(values.email, values.password);
      setAuth(data);
      router.push('/game');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 409) {
        setError('email', { message: 'Email already registered' });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="your@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Create Account
      </Button>
    </form>
  );
}