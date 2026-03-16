import Layout from "@/components/Layout/Layout";
import NavBar from "@/components/Navbar";
import MapClientWrapper from "@/components/Map/MapClientWrapper";
import { LocationData } from "@/types/location";

// SSRでロケーションデータを取得
async function getLocations(): Promise<LocationData[]> {
  // TODO: 実際のAPIエンドポイントに変更してください
  // const res = await fetch(`${process.env.API_URL}/api/locations`, {
  //   cache: 'no-store', // 常に最新データを取得
  // });
  // return res.json();

  // サンプルデータ（APIができるまでの仮データ）
  return [
    {
      id: 1,
      name: "エンジニアカフェ",
      image: "/images/sample-cafe.jpg",
      rating: 5.0,
      address: "福岡県福岡市天神2丁目",
      phone: "000-0000-0000",
      price: "無料",
      closedDay: "日曜日",
      hours: "09:00〜20:00",
      amenities: ["monitor", "wifi"],
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
