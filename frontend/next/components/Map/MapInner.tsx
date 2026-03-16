"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.css";
import LocationDetailSheet from "./LocationDetailSheet";
import { LocationData } from "@/types/location";

// Leafletのデフォルトアイコンの問題を修正
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapInnerProps {
  center: LatLngExpression;
  zoom: number;
  className: string;
  locations: LocationData[];
  onSheetOpenChange?: (isOpen: boolean) => void;
}

const MapInner = ({ center, zoom, className, locations, onSheetOpenChange }: MapInnerProps) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMarkerClick = (location: LocationData) => {
    setSelectedLocation(location);
    setIsSheetOpen(true);
    onSheetOpenChange?.(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedLocation(null);
    onSheetOpenChange?.(false);
  };

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        className={className}
        scrollWheelZoom={true}
        preferCanvas={true}
        minZoom={3}
        maxZoom={19}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          keepBuffer={2}
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={icon}
            eventHandlers={{
              click: () => handleMarkerClick(location),
            }}
          />
        ))}
      </MapContainer>

      <LocationDetailSheet
        location={selectedLocation}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </>
  );
};

export default MapInner;
