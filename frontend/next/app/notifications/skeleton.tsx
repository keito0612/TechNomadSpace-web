export default function NotificationSkeleton() {
    return (
        <>
            <div className="flex items-center justify-between mb-6 mt-4">
                <div className="h-8 w-32 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-800 rounded-lg p-4 animate-pulse"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0" />
                            <div className="flex-1">
                                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-700 rounded w-full mb-2" />
                                <div className="h-3 bg-gray-700 rounded w-1/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
