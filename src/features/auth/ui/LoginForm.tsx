'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useLogin } from '../model/useLogin';

const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useLogin({
    onInvalidCredentials: () =>
      setError('email', { message: 'Invalid credentials' }),
    onUnexpectedError: () =>
      toast.error('Something went wrong. Please try again.'),
  });

  return (
    <form
      onSubmit={handleSubmit((values) => mutate(values))}
      noValidate
      className="flex flex-col gap-4"
    >
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
      <Button type="submit" isLoading={isPending} className="mt-2">
        Sign In
      </Button>
    </form>
  );
}