import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, Calendar, Euro, Plus, 
  CheckCircle2, XCircle, Clock, TrendingUp, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fetchBookingsForLandlord, fetchSpaces } from '@/lib/api';

const statusConfig: Record<BookingStatus, { label: string; variant: 'pending' | 'confirmed' | 'rejected' | 'muted' | 'success' }> = {
  pending: { label: 'Ausstehend', variant: 'pending' },
  confirmed: { label: 'Bestätigt', variant: 'confirmed' },
  rejected: { label: 'Abgelehnt', variant: 'rejected' },
  cancelled: { label: 'Storniert', variant: 'muted' },
  completed: { label: 'Abgeschlossen', variant: 'success' },
};

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const landlordId = '22222222-2222-2222-2222-222222222222';
  const { data: spaces = [], isLoading: isSpacesLoading, isError: isSpacesError } = useQuery({
    queryKey: ['spaces', 'landlord'],
    queryFn: fetchSpaces,
  });
  const { data: bookings = [], isLoading: isBookingsLoading, isError: isBookingsError } = useQuery({
    queryKey: ['bookings', 'landlord', landlordId],
    queryFn: () => fetchBookingsForLandlord(landlordId),
  });
  
  // Filter for owner's spaces and bookings
  const mySpaces = spaces.filter(s => s.ownerId === landlordId);
  const myBookings = bookings.filter(b => b.landlordId === landlordId);
  const pendingRequests = myBookings.filter(b => b.status === 'pending');
  
  const totalRevenue = myBookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-display-sm text-foreground mb-2">
                  Vermieter-Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Verwalten Sie Ihre Flächen und Buchungsanfragen.
                </p>
              </div>
              <Button variant="accent" asChild>
                <Link to="/landlords/new-space">
                  <Plus className="w-4 h-4 mr-2" />
                  Neue Fläche inserieren
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Meine Flächen', value: mySpaces.length, icon: Building2 },
              { label: 'Offene Anfragen', value: pendingRequests.length, icon: Clock },
              { label: 'Buchungen', value: myBookings.length, icon: Calendar },
              { label: 'Einnahmen', value: `€${totalRevenue.toLocaleString()}`, icon: Euro },
            ].map((stat) => (
              <Card key={stat.label} variant="bordered" className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Übersicht</TabsTrigger>
                <TabsTrigger value="spaces">Meine Flächen</TabsTrigger>
                <TabsTrigger value="requests">
                  Anfragen
                  {pendingRequests.length > 0 && (
                    <Badge variant="accent" className="ml-2">
                      {pendingRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="bookings">Buchungen</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Pending requests */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-warning" />
                        Offene Anfragen
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isBookingsLoading && (
                        <p className="text-muted-foreground">Lade Anfragen...</p>
                      )}
                      {isBookingsError && (
                        <p className="text-muted-foreground">Anfragen konnten nicht geladen werden.</p>
                      )}
                      {!isBookingsLoading && !isBookingsError && pendingRequests.slice(0, 3).map((request) => (
                        <div 
                          key={request.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium text-foreground">{request.tenantName}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.spaceName} • {request.totalDays} Tage
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="success">
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {!isBookingsLoading && !isBookingsError && pendingRequests.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          Keine offenen Anfragen
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-success" />
                        Letzte Aktivität
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isBookingsLoading && (
                        <p className="text-muted-foreground">Lade Buchungen...</p>
                      )}
                      {isBookingsError && (
                        <p className="text-muted-foreground">Buchungen konnten nicht geladen werden.</p>
                      )}
                      {!isBookingsLoading && !isBookingsError && myBookings.slice(0, 3).map((booking) => {
                        const status = statusConfig[booking.status];
                        return (
                          <div 
                            key={booking.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div>
                              <p className="font-medium text-foreground">{booking.spaceName}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.startDate.toLocaleDateString('de-DE')} • €{booking.totalPrice}
                              </p>
                            </div>
                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Spaces Tab */}
              <TabsContent value="spaces">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isSpacesLoading && (
                    <p className="text-muted-foreground">Lade Flächen...</p>
                  )}
                  {isSpacesError && (
                    <p className="text-muted-foreground">Flächen konnten nicht geladen werden.</p>
                  )}
                  {!isSpacesLoading && !isSpacesError && mySpaces.map((space) => (
                    <Card key={space.id} variant="interactive">
                      <div className="aspect-video bg-muted relative rounded-t-lg overflow-hidden">
                        <img 
                          src={space.images[0]} 
                          alt={space.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          variant={space.isActive ? 'success' : 'muted'}
                          className="absolute top-2 right-2"
                        >
                          {space.isActive ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1 truncate">
                          {space.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {space.city} • {space.size} m²
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">
                            €{space.pricePerDay}/Tag
                          </span>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Bearbeiten
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Add new space card */}
                  <Card variant="bordered" className="flex items-center justify-center min-h-[280px] border-dashed">
                    <Link 
                      to="/landlords/new-space"
                      className="text-center p-6 hover:text-primary transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">Neue Fläche hinzufügen</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Inserieren Sie eine weitere Gewerbefläche
                      </p>
                    </Link>
                  </Card>
                </div>
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests">
                <div className="space-y-4">
                  {isBookingsLoading && (
                    <p className="text-muted-foreground">Lade Anfragen...</p>
                  )}
                  {isBookingsError && (
                    <p className="text-muted-foreground">Anfragen konnten nicht geladen werden.</p>
                  )}
                  {!isBookingsLoading && !isBookingsError && pendingRequests.map((request) => (
                    <Card key={request.id} className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={request.spaceImage}
                            alt={request.spaceName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {request.spaceName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Anfrage von {request.tenantName}
                              </p>
                            </div>
                            <Badge variant="pending">Ausstehend</Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                            <span>
                              {request.startDate.toLocaleDateString('de-DE')} - {request.endDate.toLocaleDateString('de-DE')}
                            </span>
                            <span>{request.totalDays} Tage</span>
                            <span className="font-semibold text-foreground">€{request.totalPrice}</span>
                          </div>

                          {request.message && (
                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg mb-3">
                              "{request.message}"
                            </p>
                          )}

                          <div className="flex gap-2">
                            <Button variant="success" size="sm">
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Annehmen
                            </Button>
                            <Button variant="outline" size="sm">
                              <XCircle className="w-4 h-4 mr-1" />
                              Ablehnen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {!isBookingsLoading && !isBookingsError && pendingRequests.length === 0 && (
                    <Card variant="bordered" className="p-8 text-center">
                      <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Alles erledigt!</h3>
                      <p className="text-muted-foreground">
                        Sie haben keine offenen Buchungsanfragen.
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <div className="space-y-4">
                  {isBookingsLoading && (
                    <p className="text-muted-foreground">Lade Buchungen...</p>
                  )}
                  {isBookingsError && (
                    <p className="text-muted-foreground">Buchungen konnten nicht geladen werden.</p>
                  )}
                  {!isBookingsLoading && !isBookingsError && myBookings.map((booking) => {
                    const status = statusConfig[booking.status];
                    return (
                      <Card key={booking.id} className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={booking.spaceImage}
                              alt={booking.spaceName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {booking.spaceName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Gebucht von {booking.tenantName}
                                </p>
                              </div>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span>
                                {booking.startDate.toLocaleDateString('de-DE')} - {booking.endDate.toLocaleDateString('de-DE')}
                              </span>
                              <span>{booking.totalDays} Tage</span>
                              <span className="font-semibold text-foreground">€{booking.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
