import Layout from "@/components/Layout/Layout";
import NavBar from "@/components/Navbar";
import MapClientWrapper from "@/components/Map/MapClientWrapper";
import { LocationData } from "@/types/location";

async function getLocations(): Promise<LocationData[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/locations`, {
      cache: 'no-store',
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
  const locations = await getLocations();
  return (
    <Layout className="relative">
      <NavBar />
      <MapClientWrapper locations={locations} />
    </Layout>
  );
}
