"use client";

import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { LocationData } from "@/types/location";

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
  locations?: LocationData[];
  onSheetOpenChange?: (isOpen: boolean) => void;
}

interface MapInnerProps {
  center: LatLngExpression;
  zoom: number;
  className: string;
  locations: LocationData[];
  onSheetOpenChange?: (isOpen: boolean) => void;
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
  zoom = 17,
  className = "h-full w-full",
  locations = [],
  onSheetOpenChange,
}: MapProps) => {
  return <MapInner center={center} zoom={zoom} className={className} locations={locations} onSheetOpenChange={onSheetOpenChange} />;
};

export default Map;
