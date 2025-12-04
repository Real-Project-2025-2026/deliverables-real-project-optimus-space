import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryLabels, amenityLabels } from '@/data/mockData';
import { SpaceCategory, Amenity } from '@/types';

interface SearchFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<SpaceCategory[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sizeRange, setSizeRange] = useState({ min: '', max: '' });

  const categories: SpaceCategory[] = ['office', 'warehouse', 'popup', 'event', 'retail', 'studio'];
  const amenities: Amenity[] = ['wifi', 'electricity', 'water', 'parking', 'heating', 'ac', 'security', 'accessible'];

  const toggleCategory = (category: SpaceCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleAmenity = (amenity: Amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedAmenities([]);
    setPriceRange({ min: '', max: '' });
    setSizeRange({ min: '', max: '' });
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedAmenities.length > 0 || 
    priceRange.min || priceRange.max || sizeRange.min || sizeRange.max;

  return (
    <div className="bg-surface rounded-xl shadow-card p-4 space-y-4">
      {/* Main filters row */}
      <div className="flex flex-wrap gap-3">
        {/* Date picker placeholder */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Datum wählen"
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Stadt oder PLZ"
          />
        </div>

        {/* Advanced toggle */}
        <Button
          variant={showAdvanced ? 'secondary' : 'outline'}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {hasActiveFilters && (
            <Badge variant="accent" className="ml-1 h-5 px-1.5">
              {selectedCategories.length + selectedAmenities.length + 
                (priceRange.min || priceRange.max ? 1 : 0) +
                (sizeRange.min || sizeRange.max ? 1 : 0)}
            </Badge>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            showAdvanced && "rotate-180"
          )} />
        </Button>

        <Button variant="accent">
          Suchen
        </Button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-border space-y-4 animate-slide-up">
          {/* Categories */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Kategorie
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedCategories.includes(category) 
                      ? "bg-primary hover:bg-primary-dark" 
                      : "hover:bg-secondary"
                  )}
                  onClick={() => toggleCategory(category)}
                >
                  {categoryLabels[category]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Preis pro Tag (€)
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Größe (m²)
              </label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={sizeRange.min}
                  onChange={(e) => setSizeRange(prev => ({ ...prev, min: e.target.value }))}
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={sizeRange.max}
                  onChange={(e) => setSizeRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Ausstattung
            </label>
            <div className="flex flex-wrap gap-2">
              {amenities.map(amenity => (
                <Badge
                  key={amenity}
                  variant={selectedAmenities.includes(amenity) ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedAmenities.includes(amenity) 
                      ? "bg-primary hover:bg-primary-dark" 
                      : "hover:bg-secondary"
                  )}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenityLabels[amenity]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1" />
                Filter zurücksetzen
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
