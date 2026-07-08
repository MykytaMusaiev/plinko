'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/model/auth.store';
import { formatCredits, parseCredits, MIN_BET, MAX_BET } from '@/shared/lib/bigint';
import type { GameConfig, Risk } from '@/shared/types/api.types';
import type {
  AutoRuntime,
  AutoSettings,
} from './autoMode.types';
import { getAutoStopReasonLabel } from './autoMode.utils';
import { useGameStore, type GameMode, type PlaybackMode } from './game.store';
import { useAutoMode } from './useAutoMode';
import { usePlaceBet } from './usePlaceBet';

export const RISKS: Risk[] = ['LOW', 'MEDIUM', 'HIGH'];
export const MODES: GameMode[] = ['manual', 'auto'];
export const PLAYBACK_MODES: PlaybackMode[] = ['normal', 'fast'];

export interface BetControlsModel {
  betAmount: bigint;
  displayValue: string;
  userBalanceLabel: string;
  risk: Risk;
  selectedRows: number;
  mode: GameMode;
  playbackMode: PlaybackMode;
  rowValues: number[];
  rowMin: number;
  rowMax: number;
  isDisabled: boolean;
  isBetDisabled: boolean;
  areControlsDisabled: boolean;
  isPending: boolean;
  isAutoActive: boolean;
  isAutoSettingsLocked: boolean;
  autoSettings: AutoSettings;
  autoRuntime: AutoRuntime;
  autoProgressLabel: string;
  autoStopReasonLabel: string;
  setEditingAmount: (value: string) => void;
  handleAmountBlur: () => void;
  setToMin: () => void;
  half: () => void;
  double: () => void;
  max: () => void;
  setRisk: (risk: Risk) => void;
  setSelectedRows: (rows: number) => void;
  setMode: (mode: GameMode) => void;
  setPlaybackMode: (mode: PlaybackMode) => void;
  setAutoNumberOfBets: (value: number) => void;
  setAutoStopOnProfit: (value: string) => void;
  setAutoStopOnLoss: (value: string) => void;
  handleBet: () => void;
  handleStartAuto: () => Promise<boolean>;
  handleStopAuto: () => void;
}

interface UseBetControlsModelInput {
  config: GameConfig;
}

export function useBetControlsModel({ config }: UseBetControlsModelInput): BetControlsModel {
  const user = useAuthStore((s) => s.user);

  const {
    betAmount,
    risk,
    selectedRows,
    mode,
    playbackMode,
    isBetRequestInFlight,
    activeVisualRounds,
    autoSettings,
    autoRuntime,
    setBetAmount,
    setRisk,
    setSelectedRows,
    setMode,
    setPlaybackMode,
    setAutoNumberOfBets,
    setAutoStopOnProfit,
    setAutoStopOnLoss,
  } = useGameStore();

  const [editingAmount, setEditingAmount] = useState<string | null>(null);
  const displayValue = editingAmount ?? formatCredits(betAmount.toString());

  const { mutate, isPending } = usePlaceBet({
    onError: (err) => toast.error(err.message || 'Bet failed. Try again.'),
  });
  const { startAuto, stopAuto, isAutoActive } = useAutoMode({
    config,
    onError: (err) => toast.error(err.message || 'Auto mode stopped.'),
  });

  const configMax = config.maxBet ? BigInt(config.maxBet) : MAX_BET;
  const configMin = config.minBet ? BigInt(config.minBet) : MIN_BET;
  const userBalance = user?.balance ? BigInt(user.balance) : BigInt(0);
  const effectiveMax = userBalance < configMax ? userBalance : configMax;
  const rowValues = config.rows;
  const rowMin = config.rows[0] ?? 8;
  const rowMax = config.rows[config.rows.length - 1] ?? 16;
  const hasActiveVisualRounds = activeVisualRounds.length > 0;
  const isBetDisabled = isBetRequestInFlight || isAutoActive;
  const areControlsDisabled =
    isBetRequestInFlight || hasActiveVisualRounds || isAutoActive;
  const isDisabled = areControlsDisabled;
  const isAutoSettingsLocked = isBetRequestInFlight || isAutoActive;
  const autoTargetCount =
    autoRuntime.targetCount > 0 ? autoRuntime.targetCount : autoSettings.numberOfBets;
  const autoProgressLabel = `${autoRuntime.resolvedCount}/${autoTargetCount}`;
  const autoStopReasonLabel = getAutoStopReasonLabel(autoRuntime.stopReason);

  const clamp = (value: bigint) =>
    value < configMin ? configMin : value > effectiveMax ? effectiveMax : value;

  const commitEditingAmount = () => {
    if (editingAmount === null) {
      return betAmount;
    }

    try {
      const nextAmount = clamp(parseCredits(editingAmount));
      setBetAmount(nextAmount);
      setEditingAmount(null);
      return nextAmount;
    } catch {
      setEditingAmount(null);
      return betAmount;
    }
  };

  const setAmount = (amount: bigint) => {
    setEditingAmount(null);
    setBetAmount(amount);
  };

  const handleAmountBlur = () => {
    commitEditingAmount();
  };

  const setToMin = () => {
    setAmount(configMin);
  };

  const half = () => {
    setAmount(clamp(betAmount / BigInt(2)));
  };

  const double = () => {
    setAmount(clamp(betAmount * BigInt(2)));
  };

  const max = () => {
    setAmount(effectiveMax);
  };

  const handleBet = () => {
    if (isBetDisabled || useGameStore.getState().isBetRequestInFlight) {
      return;
    }

    const amount = commitEditingAmount();

    mutate({ amount: Number(amount), rows: selectedRows, risk });
  };

  const handleStartAuto = async () => {
    if (isAutoSettingsLocked) {
      return false;
    }

    const amount = commitEditingAmount();
    setMode('auto');

    return startAuto({ amount, rows: selectedRows, risk });
  };

  const handleStopAuto = () => {
    stopAuto();
  };

  return {
    betAmount,
    displayValue,
    userBalanceLabel: formatCredits(userBalance.toString()),
    risk,
    selectedRows,
    mode,
    playbackMode,
    rowValues,
    rowMin,
    rowMax,
    isDisabled,
    isBetDisabled,
    areControlsDisabled,
    isPending,
    isAutoActive,
    isAutoSettingsLocked,
    autoSettings,
    autoRuntime,
    autoProgressLabel,
    autoStopReasonLabel,
    setEditingAmount,
    handleAmountBlur,
    setToMin,
    half,
    double,
    max,
    setRisk,
    setSelectedRows,
    setMode,
    setPlaybackMode,
    setAutoNumberOfBets,
    setAutoStopOnProfit,
    setAutoStopOnLoss,
    handleBet,
    handleStartAuto,
    handleStopAuto,
  };
}
