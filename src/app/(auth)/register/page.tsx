import Link from 'next/link';
import { CircleDot } from 'lucide-react';
import { RegisterForm } from '@/features/auth/ui/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl bg-[#162032] p-8 shadow-2xl">
        <div className="mb-7 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30">
            <CircleDot className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Plinko</h1>
          <p className="text-sm text-gray-400">Create your account</p>
        </div>

        <RegisterForm />

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}