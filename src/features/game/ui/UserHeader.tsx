'use client';

import { useEffect, useRef, useState } from 'react';
import { History } from 'lucide-react';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { formatCredits } from '@/shared/lib/bigint';
import { clsx } from 'clsx';

export function UserHeader() {
  const user = useAuthStore((s) => s.user);
  const balance = user?.balance ?? '0';

  const prevBalance = useRef(balance);
  const [flash, setFlash] = useState<'win' | 'loss' | null>(null);

  useEffect(() => {
    if (prevBalance.current === balance) return;
    const prev = BigInt(prevBalance.current);
    const curr = BigInt(balance);
    setFlash(curr > prev ? 'win' : 'loss');
    prevBalance.current = balance;
    const t = setTimeout(() => setFlash(null), 700);
    return () => clearTimeout(t);
  }, [balance]);

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-white/5">
      <span className="text-white font-semibold tracking-wide text-sm">Plinko</span>

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-xs text-neutral-400">Balance:</span>
        <span
          className={clsx(
            'font-mono font-semibold text-sm transition-colors duration-300',
            flash === 'win' && 'text-emerald-400',
            flash === 'loss' && 'text-red-400',
            !flash && 'text-white',
          )}
        >
          {formatCredits(balance)}
        </span>
      </div>

      <button
        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        aria-label="Bet history"
      >
        <History size={14} />
        History
      </button>
    </header>
  );
}