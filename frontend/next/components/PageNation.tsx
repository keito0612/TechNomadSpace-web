import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageNationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
}

const PageNation = ({ currentPage, lastPage, total, perPage }: PageNationProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {lastPage > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Link
                        href={currentPage > 1 ? `/notifications?page=${currentPage - 1}` : '#'}
                        className={`
                                    p-2 rounded-lg transition
                                    ${currentPage === 1
                                ? 'text-gray-600 pointer-events-none'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }
                                `}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: lastPage }, (_, i) => i + 1)
                            .filter((page) => {
                                if (lastPage <= 5) return true;
                                if (page === 1 || page === lastPage) return true;
                                if (Math.abs(page - currentPage) <= 2) return true;
                                return false;
                            })
                            .map((page, index, arr) => {
                                const showEllipsis =
                                    index > 0 && page - arr[index - 1] > 1;

                                return (
                                    <div key={page} className="flex items-center gap-1">
                                        {showEllipsis && (
                                            <span className="text-gray-500 px-2">...</span>
                                        )}
                                        <Link
                                            href={`/notifications?page=${page}`}
                                            className={`
                                                        w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition
                                                        ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                                }
                                                    `}
                                        >
                                            {page}
                                        </Link>
                                    </div>
                                );
                            })}
                    </div>

                    <Link
                        href={currentPage < lastPage ? `/notifications?page=${currentPage + 1}` : '#'}
                        className={`
                                    p-2 rounded-lg transition
                                    ${currentPage === lastPage
                                ? 'text-gray-600 pointer-events-none'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }
                                `}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
                {total}件中 {(currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, total)}件を表示
            </p>
        </div>
    );
}




export default PageNation;