import { Space } from '@/types';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapViewProps {
  spaces: Space[];
  onMarkerClick?: (space: Space) => void;
  selectedSpaceId?: string;
}

export function MapView({ spaces, onMarkerClick, selectedSpaceId }: MapViewProps) {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-muted rounded-xl overflow-hidden">
      {/* Map placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5">
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 10}
              x2="100"
              y2={i * 10}
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-border"
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2="100"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-border"
            />
          ))}
        </svg>
      </div>

      {/* Simulated markers */}
      <div className="absolute inset-0">
        {spaces.map((space, index) => {
          // Generate pseudo-random positions based on id for demo
          const x = 15 + (parseInt(space.id) * 17) % 70;
          const y = 15 + (parseInt(space.id) * 23) % 70;
          const isSelected = space.id === selectedSpaceId;

          return (
            <motion.button
              key={space.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onMarkerClick?.(space)}
            >
              <div className={`
                relative flex items-center justify-center
                ${isSelected ? 'z-10' : 'z-0'}
              `}>
                {/* Pin shadow */}
                <div className="absolute -bottom-1 w-3 h-1 bg-foreground/20 rounded-full blur-sm" />
                
                {/* Pin */}
                <div className={`
                  relative px-2.5 py-1 rounded-lg shadow-md transition-all duration-200
                  ${isSelected 
                    ? 'bg-accent text-accent-foreground scale-110' 
                    : 'bg-primary text-primary-foreground group-hover:bg-primary-dark group-hover:scale-105'
                  }
                `}>
                  <span className="text-xs font-semibold whitespace-nowrap">
                    €{space.pricePerDay}
                  </span>
                  
                  {/* Arrow */}
                  <div className={`
                    absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45
                    ${isSelected ? 'bg-accent' : 'bg-primary group-hover:bg-primary-dark'}
                  `} />
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="
                absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                pointer-events-none
              ">
                <div className="bg-surface rounded-lg shadow-elevated p-2 whitespace-nowrap">
                  <p className="text-sm font-medium text-foreground">{space.title}</p>
                  <p className="text-xs text-muted-foreground">{space.city}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Map controls placeholder */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-surface rounded-lg shadow-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-surface rounded-lg shadow-card flex items-center justify-center text-foreground hover:bg-secondary transition-colors">
          −
        </button>
      </div>

      {/* Map notice */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-surface/90 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
          <p className="text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 inline mr-1" />
            Kartenansicht – OpenStreetMap Integration kommt bald
          </p>
        </div>
      </div>
    </div>
  );
}
