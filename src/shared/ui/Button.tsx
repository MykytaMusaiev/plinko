import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        'inline-flex w-full items-center justify-center rounded-md py-2.5',
        'text-sm font-semibold transition-all focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-green-500',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' &&
        'bg-green-500 text-white hover:bg-green-400 active:bg-green-600',
        variant === 'ghost' &&
        'border border-[#2a3a4a] bg-transparent text-gray-300 hover:bg-[#1a2535]',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading…
        </span>
      ) : (
        children
      )}
    </button>
  );
}