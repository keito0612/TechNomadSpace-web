import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
    { label: "利用規約", href: "/terms" },
    { label: "プライバシーポリシー", href: "/privacy" },
];

const LandingFooter = () => {
    return (
        <footer className="py-12 px-4 bg-black border-t border-gray-800">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/TechNomadSpaceIcon.png"
                            alt="TechNomadSpace"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="text-lg font-bold text-white">TechNomadSpace</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} TechNomadSpace. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
