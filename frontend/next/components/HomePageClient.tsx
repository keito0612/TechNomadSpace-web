'use client';

import { useSyncExternalStore, useCallback } from 'react';
import Layout from "@/components/Layout/Layout";
import NavBar from "@/components/Navbar";
import MapClientWrapper from "@/components/Map/MapClientWrapper";
import { LocationData } from "@/types/location";
import {
    LandingNavbar,
    HeroSection,
    ProblemSection,
    SolutionSection,
    PriceTypesSection,
    ReviewSection,
    CTASection,
    LandingFooter,
} from '@/components/Landing';

const VISITED_KEY = 'technomad_visited';

interface HomePageClientProps {
    locations: LocationData[];
}

const LandingContent = ({ onEnter }: { onEnter: () => void }) => {
    return (
        <div className="min-h-screen bg-black">
            <LandingNavbar />
            <HeroSection onEnter={onEnter} />
            <ProblemSection />
            <SolutionSection />
            <PriceTypesSection />
            <ReviewSection />
            <CTASection onEnter={onEnter} />
            <LandingFooter />
        </div>
    );
};

const MapContent = ({ locations }: { locations: LocationData[] }) => {
    return (
        <Layout className="relative">
            <NavBar />
            <MapClientWrapper locations={locations} />
        </Layout>
    );
};

const getVisitedSnapshot = () => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(VISITED_KEY) === 'true';
};

const getServerSnapshot = () => true;

const subscribe = (callback: () => void) => {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
};

const HomePageClient = ({ locations }: HomePageClientProps) => {
    const hasVisited = useSyncExternalStore(subscribe, getVisitedSnapshot, getServerSnapshot);

    const handleEnter = useCallback(() => {
        localStorage.setItem(VISITED_KEY, 'true');
        window.dispatchEvent(new Event('storage'));
    }, []);

    if (hasVisited) {
        return <MapContent locations={locations} />;
    }

    return <LandingContent onEnter={handleEnter} />;
};

export default HomePageClient;
