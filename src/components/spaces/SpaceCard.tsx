import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Space } from '@/types';
import { categoryLabels, amenityLabels } from '@/data/mockData';
import { MapPin, Maximize, Star, Wifi, Zap, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpaceCardProps {
  space: Space;
  index?: number;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  electricity: <Zap className="w-3.5 h-3.5" />,
  water: <Droplets className="w-3.5 h-3.5" />,
};

export function SpaceCard({ space, index = 0 }: SpaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/space/${space.id}`}>
        <Card variant="interactive" className="overflow-hidden group">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={space.images[0]}
              alt={space.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="backdrop-blur-sm bg-surface/90">
                {categoryLabels[space.category]}
              </Badge>
            </div>
            {space.rating && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-surface/90 backdrop-blur-sm">
                <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                <span className="text-sm font-medium">{space.rating}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {space.title}
              </h3>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{space.city}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                <span>{space.size} m²</span>
              </div>
              <div className="flex items-center gap-1.5">
                {space.amenities.slice(0, 3).map((amenity) => (
                  <span key={amenity} className="text-muted-foreground" title={amenityLabels[amenity]}>
                    {amenityIcons[amenity] || null}
                  </span>
                ))}
                {space.amenities.length > 3 && (
                  <span className="text-xs">+{space.amenities.length - 3}</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-end justify-between">
              <div>
                <span className="text-xl font-bold text-foreground">€{space.pricePerDay}</span>
                <span className="text-sm text-muted-foreground"> / Tag</span>
              </div>
              {space.reviewCount && (
                <span className="text-xs text-muted-foreground">
                  {space.reviewCount} Bewertungen
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
