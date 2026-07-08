import { AppHeader } from "./_components/AppHeader";
import { BottomNavigation } from "./_components/BottomNavigation";

export default function GameShellLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-dvh min-h-screen flex-col overflow-hidden bg-neutral-950 text-white">
            <AppHeader />
            <div className="min-h-0 flex-1 overflow-auto">{children}</div>
            <BottomNavigation />
        </div>
    );
}
