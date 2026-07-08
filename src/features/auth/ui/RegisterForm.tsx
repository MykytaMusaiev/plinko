'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useRegister } from '../model/useRegister';

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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useRegister({
    onEmailTaken: () =>
      setError('email', { message: 'Email already registered' }),
    onUnexpectedError: () =>
      toast.error('Something went wrong. Please try again.'),
  });

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => mutate({ email, password }))}
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
      <Button type="submit" isLoading={isPending} className="mt-2">
        Create Account
      </Button>
    </form>
  );
}