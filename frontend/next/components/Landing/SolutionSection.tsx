import { Clock, MapPin, Wifi } from 'lucide-react';

interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: Clock,
        title: "予約不要",
        description: "ドロップイン利用OKの施設だけを掲載。今すぐ行けます。",
    },
    {
        icon: MapPin,
        title: "地図で検索",
        description: "現在地周辺のスペースをマップで一覧表示。迷わず到着。",
    },
    {
        icon: Wifi,
        title: "設備が明確",
        description: "WiFi・電源・モニターの有無を事前に確認できます。",
    },
];

const FeatureCard = ({ icon: Icon, title, description }: Feature) => {
    return (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-all flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
};

const SolutionSection = () => {
    return (
        <section className="py-12 md:py-16 px-4 bg-black">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-block bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1 mb-6">
                    <span className="text-blue-400 text-sm font-medium">TechNomadSpaceが解決</span>
                </div>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-10 md:mb-12">
                    すぐ使える施設だけを厳選
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {features.map((feature: Feature, index: number) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SolutionSection;
