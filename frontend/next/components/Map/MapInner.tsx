"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./map.css";
import LocationDetailSheet from "./LocationDetailSheet";
import { LocationData } from "@/types/location";
import { renderToString } from "react-dom/server";
import MapPin from "./MapPin";
import { PriceType } from "@/types/types";

// カスタムピンアイコンを作成する関数
const createCustomIcon = (priceType: PriceType, isSelected: boolean = false) => {
  const html = renderToString(<MapPin priceType={priceType} isSelected={isSelected} />);
  const size: [number, number] = isSelected ? [48, 72] : [30, 56];
  const anchor: [number, number] = isSelected ? [24, 72] : [15, 56];
  return L.divIcon({
    html: html,
    className: "custom-map-pin",
    iconSize: size,
    iconAnchor: anchor,
  });
};

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
            icon={createCustomIcon(location.priceType, selectedLocation?.id === location.id)}
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
