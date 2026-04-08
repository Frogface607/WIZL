"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shop } from "@/data/shops";

interface ShopMapProps {
  shops: Shop[];
  selectedShop: Shop | null;
  onSelectShop: (shop: Shop | null) => void;
  onCheckIn?: (shop: Shop) => void;
}

function createMarkerIcon(isPremium: boolean, isSelected: boolean): L.DivIcon {
  if (isPremium) {
    return L.divIcon({
      className: "wizl-marker-premium",
      html: `<div style="
        width: ${isSelected ? 44 : 36}px;
        height: ${isSelected ? 44 : 36}px;
        background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid #fef3c7;
        box-shadow: 0 0 16px rgba(251,191,36,0.6), 0 0 32px rgba(251,191,36,0.3);
        cursor: pointer;
        animation: pulse-gold 2s ease-in-out infinite;
        position: relative;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#451a03" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      </div>`,
      iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
      iconAnchor: [isSelected ? 22 : 18, isSelected ? 22 : 18],
    });
  }

  const size = isSelected ? 38 : 30;
  const color = isSelected ? "#a78bfa" : "#34d399";
  const shadow = isSelected
    ? "0 0 16px rgba(167,139,250,0.5)"
    : "0 0 10px rgba(52,211,153,0.35)";

  return L.divIcon({
    className: isSelected ? "wizl-marker-selected" : "wizl-marker",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #08080a;
      box-shadow: ${shadow};
      cursor: pointer;
      transition: all 0.2s ease;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#08080a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createClusterIcon(count: number): L.DivIcon {
  const size = count > 50 ? 52 : count > 20 ? 44 : 36;
  return L.divIcon({
    className: "wizl-cluster",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: rgba(52,211,153,0.15);
      border: 2px solid rgba(52,211,153,0.4);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #34d399;
      font-weight: 800;
      font-size: ${size > 44 ? 15 : 13}px;
      cursor: pointer;
      backdrop-filter: blur(4px);
      box-shadow: 0 0 20px rgba(52,211,153,0.2);
    ">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createPopupContent(shop: Shop): string {
  const typeLabel =
    shop.type === "coffeeshop"
      ? "Coffee Shop"
      : shop.type === "club"
        ? "Cannabis Club"
        : shop.type === "delivery"
          ? "Delivery"
          : "Dispensary";

  const stars = "&#9733;".repeat(Math.floor(shop.rating));

  return `
    <div style="
      background: #131316;
      color: #f4f4f5;
      padding: 14px;
      border-radius: 12px;
      min-width: 220px;
      max-width: 280px;
      font-family: inherit;
    ">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 14px; line-height: 1.3;">${shop.name}</div>
          <div style="color: #71717a; font-size: 11px; margin-top: 2px;">${typeLabel} &middot; ${shop.city}, ${shop.country}</div>
        </div>
        <div style="
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #34d399;
          white-space: nowrap;
          margin-left: 8px;
        ">${shop.rating}</div>
      </div>
      <div style="color: #a1a1aa; font-size: 11px; margin-bottom: 4px;">
        ${shop.address}
      </div>
      ${shop.hours ? `<div style="color: #71717a; font-size: 11px; margin-bottom: 8px;">Hours: ${shop.hours}</div>` : ""}
      <div style="display: flex; gap: 6px; margin-top: 8px;">
        <button
          onclick="window.dispatchEvent(new CustomEvent('wizl-checkin', {detail: '${shop.id}'}))"
          style="
            flex: 1;
            padding: 7px 0;
            background: #34d399;
            color: #08080a;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
          "
        >Check in here</button>
        <button
          onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}', '_blank')"
          style="
            padding: 7px 12px;
            background: #1a1a1f;
            color: #a1a1aa;
            border: 1px solid #23232a;
            border-radius: 10px;
            font-size: 12px;
            cursor: pointer;
          "
        >Directions</button>
      </div>
    </div>
  `;
}

// Simple grid-based clustering
function clusterShops(
  allShops: Shop[],
  map: L.Map,
): { clusters: { lat: number; lng: number; shops: Shop[] }[]; singles: Shop[] } {
  const zoom = map.getZoom();

  // At high zoom, show all individually
  if (zoom >= 12) {
    return { clusters: [], singles: allShops };
  }

  const gridSize = zoom <= 4 ? 15 : zoom <= 6 ? 8 : zoom <= 8 ? 4 : 2;
  const grid: Record<string, Shop[]> = {};

  allShops.forEach((shop) => {
    const key = `${Math.floor(shop.lat / gridSize)}_${Math.floor(shop.lng / gridSize)}`;
    if (!grid[key]) grid[key] = [];
    grid[key].push(shop);
  });

  const clusters: { lat: number; lng: number; shops: Shop[] }[] = [];
  const singles: Shop[] = [];

  Object.values(grid).forEach((group) => {
    if (group.length === 1) {
      singles.push(group[0]);
    } else {
      const lat = group.reduce((s, sh) => s + sh.lat, 0) / group.length;
      const lng = group.reduce((s, sh) => s + sh.lng, 0) / group.length;
      clusters.push({ lat, lng, shops: group });
    }
  });

  return { clusters, singles };
}

export default function ShopMap({
  shops,
  selectedShop,
  onSelectShop,
  onCheckIn,
}: ShopMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Handle check-in events from popup buttons
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const shop = shops.find((s) => s.id === customEvent.detail);
      if (shop && onCheckIn) onCheckIn(shop);
    };
    window.addEventListener("wizl-checkin", handler);
    return () => window.removeEventListener("wizl-checkin", handler);
  }, [shops, onCheckIn]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
    }).setView([13.7445, 100.535], 3);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 20,
      },
    ).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Re-render markers on zoom
    map.on("zoomend", () => {
      renderMarkers();
    });

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const { clusters, singles } = clusterShops(shops, map);

    // Render clusters
    clusters.forEach((cluster) => {
      const marker = L.marker([cluster.lat, cluster.lng], {
        icon: createClusterIcon(cluster.shops.length),
      });
      marker.on("click", () => {
        const bounds = L.latLngBounds(
          cluster.shops.map((s) => [s.lat, s.lng] as L.LatLngTuple),
        );
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      });
      marker.bindTooltip(
        `${cluster.shops.length} shops`,
        {
          permanent: false,
          direction: "top",
          offset: [0, -20],
          className: "wizl-tooltip",
        },
      );
      layer.addLayer(marker);
    });

    // Render singles
    singles.forEach((shop) => {
      const isSelected = selectedShop?.id === shop.id;
      const marker = L.marker([shop.lat, shop.lng], {
        icon: createMarkerIcon(shop.isPremium, isSelected),
      });

      marker.on("click", () => {
        onSelectShop(shop);
      });

      marker.bindPopup(createPopupContent(shop), {
        className: "wizl-popup",
        closeButton: false,
        maxWidth: 300,
        offset: [0, -10],
      });

      marker.bindTooltip(shop.name, {
        permanent: false,
        direction: "top",
        offset: [0, -18],
        className: "wizl-tooltip",
      });

      layer.addLayer(marker);
    });
  }, [shops, selectedShop, onSelectShop]);

  // Re-render markers when shops or selection changes
  useEffect(() => {
    renderMarkers();
  }, [renderMarkers]);

  // Pan to selected
  useEffect(() => {
    if (selectedShop && mapRef.current) {
      mapRef.current.setView([selectedShop.lat, selectedShop.lng], 14, {
        animate: true,
      });
    }
  }, [selectedShop]);

  // Fit bounds to show all shops on first load
  useEffect(() => {
    const map = mapRef.current;
    if (!map || shops.length === 0) return;

    // Small delay to ensure map is ready
    const timer = setTimeout(() => {
      if (shops.length > 1) {
        const bounds = L.latLngBounds(
          shops.map((s) => [s.lat, s.lng] as L.LatLngTuple),
        );
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
      } else if (shops.length === 1) {
        map.setView([shops[0].lat, shops[0].lng], 14);
      }
    }, 100);
    return () => clearTimeout(timer);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style jsx global>{`
        .wizl-tooltip {
          background: #131316 !important;
          color: #f4f4f5 !important;
          border: 1px solid #23232a !important;
          border-radius: 8px !important;
          padding: 4px 10px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
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
        .wizl-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 12px !important;
        }
        .wizl-popup .leaflet-popup-content {
          margin: 0 !important;
        }
        .wizl-popup .leaflet-popup-tip {
          background: #131316 !important;
          border: 1px solid #23232a;
        }
        @keyframes pulse-gold {
          0%,
          100% {
            box-shadow: 0 0 16px rgba(251, 191, 36, 0.6),
              0 0 32px rgba(251, 191, 36, 0.3);
          }
          50% {
            box-shadow: 0 0 24px rgba(251, 191, 36, 0.8),
              0 0 48px rgba(251, 191, 36, 0.4);
          }
        }
      `}</style>
      <div ref={containerRef} className="w-full h-full" />
    </>
  );
}
