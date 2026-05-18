import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm text-gray-400">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            'w-full rounded-md border bg-[#0f172a] px-3 py-2 text-sm text-white',
            'placeholder:text-gray-600 outline-none transition-colors',
            'focus:border-green-500 focus:ring-1 focus:ring-green-500/40',
            error ? 'border-red-500' : 'border-[#2a3a4a]',
            className,
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';