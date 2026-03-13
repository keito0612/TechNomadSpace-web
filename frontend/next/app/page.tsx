import Layout from "@/components/Layout/Layout";
import Map from "@/components/Map/Map";

export default function Home() {
  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] lg:h-screen w-full">
        <Map className="h-full w-full" />
      </div>
    </Layout>
  );
}
