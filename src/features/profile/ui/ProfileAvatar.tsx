import Image from "next/image";
import { Camera, RefreshCw } from "lucide-react";

interface ProfileAvatarProps {
    avatarUrl: string | null;
    initial: string;
    isUploading: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onAvatarButtonClick: () => void;
    onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({
    avatarUrl,
    initial,
    isUploading,
    inputRef,
    onAvatarButtonClick,
    onAvatarChange,
}: ProfileAvatarProps) {
    return (
        <div className="relative h-24 w-24 shrink-0 sm:h-28 sm:w-28">
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt=""
                    width={112}
                    height={112}
                    unoptimized
                    className="h-full w-full rounded-full border border-emerald-400/30 object-cover"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-emerald-500 text-4xl font-black text-white">
                    {initial}
                </div>
            )}
            <button
                type="button"
                onClick={onAvatarButtonClick}
                disabled={isUploading}
                aria-label="Upload avatar"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-emerald-500 text-neutral-950 shadow-lg transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isUploading ? (
                    <RefreshCw size={16} className="animate-spin" aria-hidden />
                ) : (
                    <Camera size={16} aria-hidden />
                )}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAvatarChange}
            />
        </div>
    );
}
