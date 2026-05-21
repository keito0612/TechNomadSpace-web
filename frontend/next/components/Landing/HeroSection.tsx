import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface HeroSectionProps {
    onEnter?: () => void;
}

const HeroSection = ({ onEnter }: HeroSectionProps) => {
    return (
        <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 bg-black">
            <div className="max-w-4xl mx-auto text-center">
                <div className="inline-block bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1 mb-6">
                    <span className="text-blue-400 text-sm font-medium">契約不要・予約不要</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    今すぐ使える<br />
                    <span className="text-blue-500">コワーキングスペース</span>を<br />
                    見つけよう
                </h1>
                <p className="text-gray-400 text-base md:text-xl mb-8 max-w-2xl mx-auto">
                    ドロップイン利用できるコワーキングスペースだけを掲載。
                    地図から簡単に検索して、今すぐ仕事を始められます。
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/" onClick={onEnter} className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                            <Search className="w-5 h-5 mr-2" />
                            スペースを探す
                        </Button>
                    </Link>
                    <Link href="/register" className="w-full sm:w-auto">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                            無料で登録
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
