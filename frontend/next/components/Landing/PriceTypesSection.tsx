import { CreditCard } from 'lucide-react';

interface PriceType {
    label: string;
    description: string;
}

const priceTypes: PriceType[] = [
    {
        label: "無料",
        description: "完全無料で利用可能",
    },
    {
        label: "ワンドリンク制",
        description: "ドリンク1杯で利用可",
    },
    {
        label: "時間課金",
        description: "使った分だけお支払い",
    },
];

const PriceTypeCard = ({ label, description }: PriceType) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 md:px-6 py-4 text-center flex-1 min-w-[100px]">
            <CreditCard className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <span className="text-white font-bold text-sm md:text-base">{label}</span>
            <p className="text-gray-500 text-xs mt-1">{description}</p>
        </div>
    );
};

const PriceTypesSection = () => {
    return (
        <section className="py-12 md:py-16 px-4 bg-gray-950">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-3xl font-bold text-white mb-4">
                    3つの料金タイプで検索
                </h2>
                <p className="text-gray-400 text-sm md:text-base mb-8">
                    予算に合わせて施設を絞り込めます
                </p>
                <div className="flex flex-row justify-center gap-3 md:gap-4">
                    {priceTypes.map((priceType, index) => (
                        <PriceTypeCard key={index} {...priceType} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PriceTypesSection;
