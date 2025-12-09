import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchFilters } from '@/components/spaces/SearchFilters';
import { SpaceCard } from '@/components/spaces/SpaceCard';
import { MapView } from '@/components/spaces/MapView';
import { Button } from '@/components/ui/button';
import { Space } from '@/types';
import { List, Map, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { fetchSpaces } from '@/lib/api';

type ViewMode = 'split' | 'list' | 'map';

export default function Search() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { data: spaces = [], isLoading, isError } = useQuery({
    queryKey: ['spaces', 'all'],
    queryFn: fetchSpaces,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        {/* Search header */}
        <div className="bg-surface border-b border-border">
          <div className="container py-4">
            <SearchFilters />
            
            {/* View mode toggle & results count */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Lade Flächen...' : isError ? 'Laden fehlgeschlagen' : (
                  <>
                    <span className="font-medium text-foreground">{spaces.length}</span> Flächen gefunden
                  </>
                )}
              </p>
              
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === 'split' && "bg-surface shadow-sm"
                  )}
                  onClick={() => setViewMode('split')}
                >
                  <Grid className="w-4 h-4 mr-1.5" />
                  Split
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === 'list' && "bg-surface shadow-sm"
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4 mr-1.5" />
                  Liste
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    viewMode === 'map' && "bg-surface shadow-sm"
                  )}
                  onClick={() => setViewMode('map')}
                >
                  <Map className="w-4 h-4 mr-1.5" />
                  Karte
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container py-6 flex-1">
          {!isLoading && !isError && viewMode === 'split' && (
            <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
              {/* List */}
              <div className="overflow-y-auto pr-2 space-y-4">
                {spaces.map((space, index) => (
                  <div
                    key={space.id}
                    onMouseEnter={() => setSelectedSpace(space)}
                    onMouseLeave={() => setSelectedSpace(null)}
                  >
                    <SpaceCard space={space} index={index} />
                  </div>
                ))}
              </div>
              
              {/* Map */}
              <div className="hidden lg:block sticky top-0">
                <MapView 
                  spaces={spaces} 
                  selectedSpaceId={selectedSpace?.id}
                  onMarkerClick={(space) => setSelectedSpace(space)}
                />
              </div>
            </div>
          )}

          {!isLoading && !isError && viewMode === 'list' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {spaces.map((space, index) => (
                <SpaceCard key={space.id} space={space} index={index} />
              ))}
            </div>
          )}

          {!isLoading && !isError && viewMode === 'map' && (
            <div className="h-[calc(100vh-280px)] min-h-[500px]">
              <MapView 
                spaces={spaces}
                onMarkerClick={(space) => setSelectedSpace(space)}
              />
            </div>
          )}

          {(isLoading || isError) && (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              {isLoading ? 'Lade Ergebnisse...' : 'Daten konnten nicht geladen werden.'}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
