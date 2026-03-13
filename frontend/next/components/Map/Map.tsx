"use client";

import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
}

interface MapInnerProps {
  center: LatLngExpression;
  zoom: number;
  className: string;
}

const MapInner = dynamic<MapInnerProps>(
  () => import("./MapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <span className="text-muted-foreground">Loading map...</span>
      </div>
    ),
  }
);

const Map = ({
  center = [33.5902, 130.4017],
  zoom = 13,
  className = "h-full w-full",
}: MapProps) => {
  return <MapInner center={center} zoom={zoom} className={className} />;
};

export default Map;
