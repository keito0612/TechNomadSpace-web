'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    variant?: 'default' | 'primary';
    onClick?: () => void;
    mobile?: boolean;
}

const NavLink = ({ href, children, variant = 'default', onClick, mobile = false }: NavLinkProps) => {
    const baseClass = mobile
        ? "block w-full text-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200"
        : "rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200";

    const variantClass = variant === 'primary'
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white";

    return (
        <Link href={href} onClick={onClick} className={`${baseClass} ${variantClass}`}>
            {children}
        </Link>
    );
};


const LandingNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavClick = (callback?: () => void) => {
        setIsMenuOpen(false);
        callback?.();
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50">
            <div className="bg-black border-b border-gray-800">
                <div className="relative flex h-14 lg:h-16 items-center justify-between px-4 md:px-5">
                    {/* ロゴ */}
                    <Link href="/" className="flex items-center">
                        <span className="text-white font-bold text-base md:text-lg">TechNomadSpace</span>
                    </Link>

                    {/* デスクトップナビ */}
                    <div className="hidden md:flex items-center space-x-2">
                        <NavLink href="/login">ログイン</NavLink>
                        <NavLink href="/register" >新規登録</NavLink>
                    </div>

                    {/* モバイルメニューボタン */}
                    <button
                        className="md:hidden p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="メニュー"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* モバイルメニュー */}
                {isMenuOpen && (
                    <div className="md:hidden bg-black border-t border-gray-800 px-4 py-4 space-y-2">
                        <NavLink href="/login" onClick={() => handleNavClick()} mobile>ログイン</NavLink>
                        <NavLink href="/register" onClick={() => handleNavClick()} mobile>新規登録</NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default LandingNavbar;
