'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({
    onSearch,
    placeholder = '場所を検索...',
    className,
}: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(query);
    };

    const handleClear = () => {
        setQuery('');
        onSearch?.('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                'flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 transition-all focus-within:bg-white/20 focus-within:border-white/40',
                className
            )}
        >
            <Search className="h-5 w-5 text-white/70 shrink-0" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm min-w-0"
            />
            {query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                    <X className="h-4 w-4 text-white/70" />
                </button>
            )}
        </form>
    );
}
