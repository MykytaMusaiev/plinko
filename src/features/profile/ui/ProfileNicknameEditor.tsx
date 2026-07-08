import { Edit2, RefreshCw, Save, X } from "lucide-react";

interface ProfileNicknameEditorProps {
    email: string;
    isBusy: boolean;
    isEditing: boolean;
    isUpdating: boolean;
    nickname: string;
    nicknameDraft: string;
    onCancel: () => void;
    onDraftChange: (value: string) => void;
    onEdit: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ProfileNicknameEditor({
    email,
    isBusy,
    isEditing,
    isUpdating,
    nickname,
    nicknameDraft,
    onCancel,
    onDraftChange,
    onEdit,
    onSubmit,
}: ProfileNicknameEditorProps) {
    return (
        <div className="min-w-0">
            {isEditing ? (
                <form
                    onSubmit={onSubmit}
                    className="flex min-w-0 flex-col gap-2 sm:max-w-sm"
                >
                    <label htmlFor="profile-nickname" className="sr-only">
                        Nickname
                    </label>
                    <input
                        id="profile-nickname"
                        value={nicknameDraft}
                        onChange={(event) => onDraftChange(event.target.value)}
                        disabled={isUpdating}
                        maxLength={32}
                        className="min-w-0 rounded-md border border-white/10 bg-neutral-950/75 px-3 py-2 text-base font-semibold text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 disabled:opacity-60"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={isBusy}
                            className="inline-flex h-9 items-center gap-2 rounded-md bg-emerald-500 px-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUpdating ? (
                                <RefreshCw
                                    size={15}
                                    className="animate-spin"
                                    aria-hidden
                                />
                            ) : (
                                <Save size={15} aria-hidden />
                            )}
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isUpdating}
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-white/10 bg-transparent px-3 text-sm font-semibold text-neutral-300 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <X size={15} aria-hidden />
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex min-w-0 items-center gap-2">
                    <h1 className="truncate text-2xl font-bold tracking-normal text-white">
                        {nickname}
                    </h1>
                    <button
                        type="button"
                        onClick={onEdit}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                        aria-label="Edit nickname"
                    >
                        <Edit2 size={16} aria-hidden />
                    </button>
                </div>
            )}

            <p className="mt-1 truncate text-sm text-neutral-400">{email}</p>
        </div>
    );
}
