import Layout from "@/components/Layout/Layout";
import NavBar from "@/components/Navbar";
import MapClientWrapper from "@/components/Map/MapClientWrapper";
import { LocationData } from "@/types/location";

// SSRでロケーションデータを取得
async function getLocations(): Promise<LocationData[]> {
  // API_URLが設定されている場合はAPIから取得
  if (process.env.API_URL) {
    try {
      const res = await fetch(`${process.env.API_URL}/api/locations`, {
        cache: 'no-store',
      });
      if (res.ok) {
        return res.json();
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  }

  // フォールバック: サンプルデータを返す
  return [
    {
      id: 1,
      name: "エンジニアカフェ",
      image: "/images/sample-cafe.jpg",
      rating: 5.0,
      address: "福岡県福岡市天神2丁目",
      phone: "000-0000-0000",
      price: "無料",
      priceType: "free" as const,
      closedDay: "日曜日",
      hours: "09:00〜20:00",
      amenity: {
        locationId: 1,
        hasWifi: true,
        hasPower: true,
        hasMonitor: true,
        hasPrivateBooth: false,
        hasFreeDrink: true,
        wifiSpeedAvg: 100,
      },
      position: [33.5902, 130.4017],
    },
  ];
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
