import { Star } from 'lucide-react';

const reviews = [
    "「WiFiが高速で快適でした。電源も各席にあり、長時間作業にぴったり。スタッフの方も親切でした。」",
    "「急な出張で近くのスペースを探していたらすぐ見つかりました。事前に設備がわかるのが便利です。」",
];

const StarRating = ({ count = 5 }: { count?: number }) => {
    return (
        <div className="flex text-blue-500">
            {[...Array(count)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
            ))}
        </div>
    );
};

const ReviewCard = ({ text }: { text: string }) => {
    return (
        <div className="bg-gray-900 rounded-xl p-5 md:p-6 border border-gray-800 text-left">
            <div className="flex items-center mb-3">
                <StarRating />
            </div>
            <p className="text-gray-300 text-sm">{text}</p>
        </div>
    );
};

const ReviewSection = () => {
    return (
        <section className="py-12 md:py-16 px-4 bg-black">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-4">
                    <Star className="w-6 h-6 md:w-8 md:h-8 text-blue-500 inline-block mr-2" />
                    実際の利用者レビュー
                </h2>
                <p className="text-gray-400 text-sm md:text-base mb-8">
                    写真付きレビューで雰囲気を事前にチェック
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {reviews.map((review, index) => (
                        <ReviewCard key={index} text={review} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
