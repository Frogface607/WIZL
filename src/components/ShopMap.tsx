"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shop } from "@/data/shops";

interface ShopMapProps {
  shops: Shop[];
  selectedShop: Shop | null;
  onSelectShop: (shop: Shop | null) => void;
}

export default function ShopMap({ shops, selectedShop, onSelectShop }: ShopMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
    }).setView([13.7445, 100.5350], 13);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when shops change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const icon = L.divIcon({
      className: "wizl-marker",
      html: `<div style="
        width: 32px; height: 32px;
        background: #34d399;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 16px;
        border: 2px solid #08080a;
        box-shadow: 0 0 12px rgba(52,211,153,0.4);
        cursor: pointer;
      ">🌿</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const selectedIcon = L.divIcon({
      className: "wizl-marker-selected",
      html: `<div style="
        width: 40px; height: 40px;
        background: #a78bfa;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px;
        border: 3px solid #08080a;
        box-shadow: 0 0 20px rgba(167,139,250,0.5);
        cursor: pointer;
      ">🌿</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    shops.forEach((shop) => {
      const isSelected = selectedShop?.id === shop.id;
      const marker = L.marker([shop.lat, shop.lng], {
        icon: isSelected ? selectedIcon : icon,
      })
        .addTo(map)
        .on("click", () => onSelectShop(shop));

      marker.bindTooltip(shop.name, {
        permanent: false,
        direction: "top",
        offset: [0, -20],
        className: "wizl-tooltip",
      });

      markersRef.current.push(marker);
    });
  }, [shops, selectedShop, onSelectShop]);

  // Pan to selected
  useEffect(() => {
    if (selectedShop && mapRef.current) {
      mapRef.current.panTo([selectedShop.lat, selectedShop.lng], { animate: true });
    }
  }, [selectedShop]);

  return (
    <>
      <style jsx global>{`
        .wizl-tooltip {
          background: #131316 !important;
          color: #f4f4f5 !important;
          border: 1px solid #23232a !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        }
        .wizl-tooltip::before {
          border-top-color: #23232a !important;
        }
        .leaflet-control-zoom a {
          background: #131316 !important;
          color: #f4f4f5 !important;
          border-color: #23232a !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1a1f !important;
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
}
