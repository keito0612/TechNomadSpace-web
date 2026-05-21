import HomePageClient from "@/components/HomePageClient";
import { LocationData } from "@/types/location";
import { cookies } from "next/dist/server/request/cookies";
import { AuthService } from "@/services/AuthService";

async function getLocations(token: string | undefined): Promise<LocationData[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/locations`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data.data as LocationData[];
    }
  } catch (error) {
    console.error('Failed to fetch locations:', error);
  }

  return [];
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AuthService.TOKEN_KEY)?.value;
  const locations = await getLocations(token);

  return <HomePageClient locations={locations} />;
}
