'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { AutoSettings } from './AutoSettings';
import type { BetControlsModel } from '../model/useBetControlsModel';

interface MobileAutoSheetProps {
  model: BetControlsModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileAutoSheet({
  model,
  open,
  onOpenChange,
}: MobileAutoSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[82dvh] overflow-y-auto rounded-t-xl border-t border-white/10 bg-[#141924] px-4 pb-5 pt-3 text-white shadow-[0_-22px_48px_rgba(0,0,0,0.46)] lg:hidden">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-black uppercase tracking-wide">
              Auto Mode
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Configure automatic Plinko bets and start or stop Auto Mode.
            </Dialog.Description>
            <Dialog.Close
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950/80 text-neutral-400 transition-colors hover:text-white"
              aria-label="Close Auto Mode"
            >
              <X size={16} aria-hidden />
            </Dialog.Close>
          </div>

          <AutoSettings model={model} onStarted={() => onOpenChange(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
