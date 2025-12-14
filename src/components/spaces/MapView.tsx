import { useEffect, useRef } from 'react';
import { Space } from '@/types';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  spaces: Space[];
  onMarkerClick?: (space: Space) => void;
  selectedSpaceId?: string;
  center?: [number, number];
  zoom?: number;
}

// Custom price marker icon
function createPriceIcon(price: number, isSelected: boolean): L.DivIcon {
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="relative">
        <div class="px-2.5 py-1 rounded-lg shadow-md transition-all duration-200 ${
          isSelected
            ? 'bg-orange-500 text-white scale-110'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }">
          <span class="text-xs font-semibold whitespace-nowrap">${price}€</span>
        </div>
        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 ${
          isSelected ? 'bg-orange-500' : 'bg-blue-600'
        }"></div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 30],
  });
}

export function MapView({
  spaces,
  onMarkerClick,
  selectedSpaceId,
  center = [51.1657, 10.4515], // Germany center
  zoom = 6
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    mapRef.current = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update center when it changes
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Add/update markers when spaces change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    const bounds: L.LatLngBounds | null = spaces.length > 0 ? L.latLngBounds([]) : null;

    spaces.forEach((space) => {
      if (!mapRef.current) return;

      const isSelected = space.id === selectedSpaceId;
      const icon = createPriceIcon(space.pricePerDay, isSelected);

      const marker = L.marker([space.latitude, space.longitude], {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
      })
        .addTo(mapRef.current)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <h3 class="font-semibold text-sm mb-1">${space.title}</h3>
            <p class="text-xs text-gray-600 mb-2">${space.address}, ${space.city}</p>
            <p class="text-sm font-bold text-blue-600">${space.pricePerDay}€ / Tag</p>
            <p class="text-xs text-gray-500">${space.size} m²</p>
          </div>
        `);

      marker.on('click', () => {
        onMarkerClick?.(space);
      });

      markersRef.current.push(marker);
      bounds?.extend([space.latitude, space.longitude]);
    });

    // Fit bounds if we have spaces
    if (bounds && bounds.isValid() && spaces.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (spaces.length === 1) {
      mapRef.current.setView([spaces[0].latitude, spaces[0].longitude], 14);
    }
  }, [spaces, selectedSpaceId, onMarkerClick]);

  // Update selected marker style
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker, index) => {
      const space = spaces[index];
      if (space) {
        const isSelected = space.id === selectedSpaceId;
        marker.setIcon(createPriceIcon(space.pricePerDay, isSelected));
        marker.setZIndexOffset(isSelected ? 1000 : 0);
      }
    });
  }, [selectedSpaceId, spaces]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden">
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{ minHeight: '400px' }}
      />

      {/* Custom styles for markers */}
      <style>{`
        .custom-price-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>

      {/* Empty state */}
      {spaces.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm z-10">
          <div className="text-center p-6">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Keine Flächen in diesem Bereich gefunden
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
