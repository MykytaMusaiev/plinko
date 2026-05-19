'use client';

interface PegGridProps {
  rows: number;
}

export function PegGrid({ rows }: PegGridProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3">
          {Array.from({ length: rowIndex + 2 }, (_, pegIndex) => (
            <span
              key={pegIndex}
              className="h-2 w-2 rounded-full bg-neutral-500"
            />
          ))}
        </div>
      ))}
    </div>
  );
}