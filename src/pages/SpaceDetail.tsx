import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoryLabels, amenityLabels } from '@/data/mockData';
import {
  ArrowLeft, MapPin, Maximize, Star, Calendar,
  Wifi, Zap, Droplets, Car, Thermometer, Wind,
  Shield, Accessibility, User, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSpaceById } from '@/lib/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const amenityIcons: Record<string, React.ComponentType<any>> = {
  wifi: Wifi,
  electricity: Zap,
  water: Droplets,
  parking: Car,
  heating: Thermometer,
  ac: Wind,
  security: Shield,
  accessible: Accessibility,
};

// Location Map Component
function LocationMap({ latitude, longitude, title }: { latitude: number; longitude: number; title: string }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-location-marker',
      html: `
        <div class="relative">
          <div class="px-3 py-1.5 rounded-lg shadow-lg bg-blue-600 text-white">
            <span class="text-sm font-semibold whitespace-nowrap">${title.substring(0, 20)}${title.length > 20 ? '...' : ''}</span>
          </div>
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-blue-600"></div>
        </div>
      `,
      iconSize: [150, 40],
      iconAnchor: [75, 50],
    });

    // Add marker
    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, title]);

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden">
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{ minHeight: '256px' }}
      />
      <style>{`
        .custom-location-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}

export default function SpaceDetail() {
  const { id } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data: space, isLoading, isError } = useQuery({
    queryKey: ['space', id],
    queryFn: () => fetchSpaceById(id || ''),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Lade Fläche...</p>
      </div>
    );
  }

  if (isError || !space) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Fläche nicht gefunden</h1>
          <Button asChild>
            <Link to="/search">Zurück zur Suche</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Generate placeholder images
  const images = space.images.length > 0 ? space.images : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Back button */}
        <div className="container py-4">
          <Link 
            to="/search"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Zurück zur Suche
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="container pb-8">
          <div className="grid grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            <div className="col-span-4 md:col-span-2 md:row-span-2 relative group">
              <img 
                src={images[selectedImageIndex]} 
                alt={space.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {images.slice(1, 5).map((img, index) => (
              <div 
                key={index}
                className="hidden md:block relative cursor-pointer group"
                onClick={() => setSelectedImageIndex(index + 1)}
              >
                <img 
                  src={img} 
                  alt={`${space.title} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="container pb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {categoryLabels[space.category]}
                    </Badge>
                    <h1 className="text-display-sm text-foreground">
                      {space.title}
                    </h1>
                  </div>
                  {space.rating && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10">
                      <Star className="w-5 h-5 text-accent fill-accent" />
                      <span className="font-semibold text-foreground">{space.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({space.reviewCount})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{space.address}, {space.postalCode} {space.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" />
                    <span>{space.size} m²</span>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-heading text-foreground mb-4">Beschreibung</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {space.description}
                </p>
              </motion.div>

              {/* Amenities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-heading text-foreground mb-4">Ausstattung</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {space.amenities.map(amenity => {
                    const Icon = amenityIcons[amenity] || Shield;
                    return (
                      <div 
                        key={amenity}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="text-sm text-foreground">{amenityLabels[amenity]}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Owner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-heading text-foreground mb-4">Vermieter</h2>
                <Card variant="bordered" className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{space.ownerName}</p>
                      <p className="text-sm text-muted-foreground">
                        Mitglied seit {space.createdAt.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Location Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-heading text-foreground mb-4">Standort</h2>
                <LocationMap
                  latitude={space.latitude}
                  longitude={space.longitude}
                  title={space.title}
                />
                <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{space.address}, {space.postalCode} {space.city}</span>
                </div>
              </motion.div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky top-24 p-6">
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-foreground">€{space.pricePerDay}</span>
                      <span className="text-muted-foreground"> / Tag</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Startdatum
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Enddatum
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>

                  <Button variant="accent" className="w-full" size="lg">
                    <Calendar className="w-5 h-5 mr-2" />
                    Buchungsanfrage senden
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Sie werden erst belastet, wenn der Vermieter bestätigt.
                  </p>

                  {/* Price breakdown placeholder */}
                  <div className="mt-6 pt-6 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">€{space.pricePerDay} × 1 Tag</span>
                      <span className="text-foreground">€{space.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Servicegebühr</span>
                      <span className="text-foreground">€{Math.round(space.pricePerDay * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-border">
                      <span>Gesamt</span>
                      <span>€{space.pricePerDay + Math.round(space.pricePerDay * 0.1)}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
