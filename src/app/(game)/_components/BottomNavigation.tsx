"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDot, History, Trophy, User } from "lucide-react";
import { clsx } from "clsx";

const NAV_ITEMS = [
    { href: "/game", label: "Game", icon: CircleDot },
    { href: "/history", label: "History", icon: History },
    { href: "/progression", label: "Progress", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
] as const;

function isActiveRoute(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavigation() {
    const pathname = usePathname();

    return (
        <footer className="shrink-0 border-t border-white/10 bg-[#111722]/98 px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_36px_rgba(0,0,0,0.24)]">
            <nav
                aria-label="Primary"
                className="mx-auto grid w-full max-w-xl grid-cols-4 gap-1 lg:max-w-2xl"
            >
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = isActiveRoute(pathname, href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={clsx(
                                "flex h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 text-[11px] font-semibold transition-colors",
                                active
                                    ? "bg-emerald-400 text-neutral-950"
                                    : "text-neutral-400 hover:bg-white/5 hover:text-white",
                            )}
                        >
                            <Icon size={17} aria-hidden />
                            <span className="truncate">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </footer>
    );
}
