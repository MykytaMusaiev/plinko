'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../model/auth.store';
import { ApiError } from '@/shared/lib/apiFetch';

const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const data = await authApi.login(values.email, values.password);
      setAuth(data);
      router.push(searchParams.get('from') ?? '/game');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setError('email', { message: 'Invalid credentials' });
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Sign In
      </Button>
    </form>
  );
}