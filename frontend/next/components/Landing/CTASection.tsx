import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface CTASectionProps {
    onEnter?: () => void;
}

const CTASection = ({ onEnter }: CTASectionProps) => {
    return (
        <section className="py-16 md:py-20 px-4 bg-blue-600">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                    今すぐスペースを探そう
                </h2>
                <p className="text-blue-100 mb-8 text-base md:text-lg">
                    登録不要で検索できます
                </p>
                <Link href="/" onClick={onEnter}>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 md:px-10 py-5 md:py-6 text-base md:text-lg font-bold">
                        <MapPin className="w-5 h-5 mr-2" />
                        マップで探す
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default CTASection;
