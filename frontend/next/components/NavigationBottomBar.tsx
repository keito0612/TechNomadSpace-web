"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, Settings, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";



interface NavItemData {
    label: string;
    href: string;
    icon: LucideIcon;
}

const NavContainer = ({ children }: { children: ReactNode }) => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
        {children}
    </nav>
);

const NavBody = ({ children }: { children: ReactNode }) => (
    <ul className="flex items-center justify-around px-4 py-2">
        {children}
    </ul>
);

const NavItem = ({ item, isActive }: { item: NavItemData; isActive: boolean }) => {
    const Icon = item.icon;
    return (
        <li>
            <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                    "flex flex-col items-center rounded-xl px-3 py-1 text-xs font-medium transition-all duration-200",
                    isActive
                        ? "scale-105 bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground active:scale-95"
                )}
            >
                <Icon
                    className={cn(
                        "mb-0.5 h-6 w-6 transition-transform duration-200",
                        isActive && "scale-110"
                    )}
                />
                <span>{item.label}</span>
            </Link>
        </li>
    );
};

// --- Main Component ---

const NAV_ITEMS: NavItemData[] = [
    { label: "検索", href: "/home", icon: Search },
    { label: "お気に入り", href: "/favorites", icon: Heart },
    { label: "プロフィール", href: "/profile", icon: User },
    { label: "設定", href: "/setting", icon: Settings },
];

export default function NavigationBottomBar() {
    const pathname = usePathname();

    return (
        <NavContainer>
            <NavBody>
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                    />
                ))}
            </NavBody>
        </NavContainer>
    );
}
