import { Suspense } from 'react';
import Link from 'next/link';
import { CircleDot } from 'lucide-react';
import { LoginForm } from '@/features/auth/ui/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl bg-[#162032] p-8 shadow-2xl">
        <div className="mb-7 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30">
            <CircleDot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Plinko</h1>
          <p className="text-sm text-gray-400">Welcome back!</p>
        </div>

        {/* Suspense needed for useSearchParams inside LoginForm */}
        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Sign Up
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-600">
          By continuing, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </main>
  );
}