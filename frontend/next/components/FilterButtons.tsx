'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Coffee, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriceType } from '@/types/types';



interface FilterButtonsProps {
    onFilterChange?: (filter: PriceType | null) => void;
    className?: string;
}

export default function FilterButtons({ onFilterChange, className }: FilterButtonsProps) {
    const [activeFilter, setActiveFilter] = useState<PriceType | null>(null);

    const handleFilterClick = (filter: PriceType | null) => {
        const newFilter = activeFilter === filter ? null : filter;
        setActiveFilter(newFilter);
        onFilterChange?.(newFilter);
    };

    return (
        <div className={cn('flex items-center gap-2 flex-nowrap', className)}>
            {/* 完全無料ボタン */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterClick(0)}
                className={cn(
                    'rounded-full border-yellow-500 px-4 py-2 font-medium transition-all shrink-0',
                    activeFilter === 0
                        ?
                        'border-yellow-300  bg-[#FFFB08]/40 text-yellow-400 hover:bg-[#FFFB08]/40 hover:text-yellow-400 hover:border-yellow-300'
                        : 'border-white/20 bg-white/10 text-white hover:bg-[#FFFB08]/40 hover:text-yellow-400 hover:border-yellow-300'
                )}
            >
                <Star className="mr-1.5 h-4 w-4" />
                完全無料
            </Button>

            {/* ドリンクのみボタン */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterClick(1)}
                className={cn(
                    'rounded-full border px-4 py-2 font-medium transition-all backdrop-blur-md shrink-0',
                    activeFilter === 1
                        ? 'border-amber-600/40 bg-amber-700/40 text-amber-600'
                        : 'border-white/20 bg-white/10 text-white hover:border-amber-600/40 hover:bg-amber-700/40'
                )}
            >
                <Coffee className="mr-1.5 h-4 w-4" />
                ドリンクのみ
            </Button>

            {/* ドロップインボタン */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterClick(2)}
                className={cn(
                    'rounded-full border px-4 py-2 font-medium transition-all backdrop-blur-md shrink-0',
                    activeFilter === 2
                        ? 'bg-[#01C4FF]/20 text-[#01C4FF] border-[#01C4FF] hover:bg-[#01C4FF]/20 hover:text-[#01C4FF] hover:border-[#01C4FF]'
                        : 'border-white/20 bg-white/10  hover:bg-white/20 hover:bg-[#01C4FF]/20 hover:text-[#01C4FF] hover:border-[#01C4FF]'
                )}
            >
                <Zap className="mr-1.5 h-4 w-4 fill-current" />
                ドロップイン
            </Button>
        </div >
    );
}
