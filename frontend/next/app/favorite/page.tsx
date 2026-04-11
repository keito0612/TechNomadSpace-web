import FavoriteBody from "@/components/Body/FavoriteBody";
import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading";
import NavBar from "@/components/Navbar";
import { AuthService } from "@/services/AuthService";
import { LocationData } from "@/types/location";
import { cookies } from "next/headers";
import { Suspense } from "react";


const getFavoriteLocations = async (token: string | undefined, keyword: string): Promise<LocationData[]> => {
    try {
        const res = await fetch(`${process.env.API_URL}/api/favorite_locations?keyword=${keyword}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });
        if (res.ok) {
            const data = await res.json();
            const favoriteLocations = data.data as LocationData[];
            return favoriteLocations;
        } else {
            return [];
        }
    } catch {
        return [];
    }
};


const FavoriteContent = async ({ keyword }: { keyword: string }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;
    const favoriteLocations = await getFavoriteLocations(token, keyword);
    return (
        <FavoriteBody locations={favoriteLocations} />
    );
}

export default async function FavoritePage({ searchParams }: {
    searchParams: Promise<{ keyword?: string }>;
}) {

    const { keyword } = await searchParams;
    return (
        <Layout>
            <NavBar />
            <Suspense fallback={<Loading />}>
                <FavoriteContent keyword={keyword || ''} />
            </Suspense>
        </Layout>
    );
}