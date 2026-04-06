const ProfileSkeleton = () => {
    return (
        <div className="animate-pulse max-w-2xl bg-black mx-auto w-full pt-16">
            {/* 背景画像エリア */}
            <div className="w-full h-28 bg-gray-700" />
            {/* プロフィール画像（重なり） */}
            <div className="relative px-4">
                <div className="-mt-10">
                    <div className="w-20 h-20 bg-gray-600 rounded-full border-4 border-black" />
                </div>
            </div>
            {/* プロフィール情報 */}
            <div className="px-4 mt-2">
                <div className="w-32 h-6 bg-gray-700 rounded" />
                <div className="w-full h-4 bg-gray-700 rounded mt-3" />
                <div className="w-3/4 h-4 bg-gray-700 rounded mt-2" />
                <div className="flex gap-4 mt-3">
                    <div className="w-20 h-4 bg-gray-700 rounded" />
                    <div className="w-16 h-4 bg-gray-700 rounded" />
                </div>
            </div>
            {/* タブ */}
            <div className="flex mt-4 border-b border-gray-700">
                <div className="flex-1 py-3 flex justify-center">
                    <div className="w-12 h-5 bg-gray-700 rounded" />
                </div>
                <div className="flex-1 py-3 flex justify-center">
                    <div className="w-12 h-5 bg-gray-700 rounded" />
                </div>
            </div>
            {/* レビューリスト */}
            <div className="mt-4 px-4 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-9 h-9 bg-gray-700 rounded-full shrink-0" />
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <div className="w-24 h-4 bg-gray-700 rounded" />
                                <div className="w-16 h-4 bg-gray-700 rounded" />
                            </div>
                            <div className="w-24 h-4 bg-gray-700 rounded mt-2" />
                            <div className="w-full h-12 bg-gray-700 rounded mt-2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileSkeleton;
