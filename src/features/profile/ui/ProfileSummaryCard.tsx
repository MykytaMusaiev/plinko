"use client";

import { useRef, useState } from "react";
import { Flame, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useUpdateProfile } from "../model/useUpdateProfile";
import { useUploadAvatar } from "../model/useUploadAvatar";
import { getAvatarInitial } from "../model/profileViewModel";
import type { ProfileResponse } from "../types/profile.types";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileLevelProgress } from "./ProfileLevelProgress";
import { ProfileNicknameEditor } from "./ProfileNicknameEditor";

export function ProfileSummaryCard({ profile }: { profile: ProfileResponse }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [nicknameDraft, setNicknameDraft] = useState("");

    const updateProfile = useUpdateProfile();
    const uploadAvatar = useUploadAvatar();

    const initial = getAvatarInitial(profile.nickname, profile.email);
    const isBusy = updateProfile.isPending || uploadAvatar.isPending;

    const startEditing = () => {
        setNicknameDraft(profile.nickname);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setNicknameDraft("");
        setIsEditing(false);
    };

    const submitNickname = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nickname = nicknameDraft.trim();
        if (!nickname) {
            toast.error("Nickname cannot be empty.");
            return;
        }

        if (nickname === profile.nickname) {
            cancelEditing();
            return;
        }

        updateProfile.mutate(
            { nickname },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setNicknameDraft("");
                    toast.success("Nickname updated.");
                },
                onError: () => {
                    toast.error("Could not update nickname.");
                },
            },
        );
    };

    const handleAvatarChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const image = event.target.files?.[0];
        event.target.value = "";
        if (!image) return;

        uploadAvatar.mutate(image, {
            onSuccess: () => {
                toast.success("Avatar updated.");
            },
            onError: () => {
                toast.error("Avatar upload failed.");
            },
        });
    };

    return (
        <section className="rounded-lg border border-white/10 bg-[#151b27] p-4 shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-5">
            <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
                <ProfileAvatar
                    avatarUrl={profile.avatarUrl}
                    initial={initial}
                    isUploading={uploadAvatar.isPending}
                    inputRef={fileInputRef}
                    onAvatarButtonClick={() => fileInputRef.current?.click()}
                    onAvatarChange={handleAvatarChange}
                />

                <div className="min-w-0">
                    <ProfileNicknameEditor
                        email={profile.email}
                        isBusy={isBusy}
                        isEditing={isEditing}
                        isUpdating={updateProfile.isPending}
                        nickname={profile.nickname}
                        nicknameDraft={nicknameDraft}
                        onCancel={cancelEditing}
                        onDraftChange={setNicknameDraft}
                        onEdit={startEditing}
                        onSubmit={submitNickname}
                    />

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 font-semibold text-yellow-300">
                            <Trophy size={15} aria-hidden />
                            Level {profile.progression.level}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 font-semibold text-orange-300">
                            <Flame size={15} aria-hidden />
                            {profile.progression.dailyStreak} day streak
                        </span>
                    </div>
                </div>
            </div>

            <ProfileLevelProgress progression={profile.progression} />
        </section>
    );
}
