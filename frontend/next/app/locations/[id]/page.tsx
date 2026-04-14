import LocationBody from "@/components/Body/LocationBody";
import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading";
import NavBar from "@/components/Navbar";
import { AuthService } from "@/services/AuthService";
import { LocationData } from "@/types/location";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const getLocation = async (id: string, token: string | undefined) => {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${process.env.API_URL}/api/location/${id}`, {
            cache: "no-store",
            headers,
        });
        if (res.ok) {
            const json = await res.json();
            return json.data as LocationData;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

const LocationContent = async ({ id }: { id: string }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;
    const location = await getLocation(id, token);
    if (!location) {
        notFound();
    }
    return <LocationBody location={location} />
}

export default async function LocationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <Layout>
            <NavBar onBack />
            <Suspense fallback={<Loading />}>
                <LocationContent id={id} />
            </Suspense>
        </Layout>
    );
}