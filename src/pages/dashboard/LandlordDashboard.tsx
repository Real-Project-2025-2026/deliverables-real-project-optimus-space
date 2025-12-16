import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Building2, Calendar, Euro, Plus,
  CheckCircle2, XCircle, Clock, TrendingUp, Pencil,
  FileText, Camera, Shield, Download, AlertTriangle,
  CreditCard, ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingStatus, PaymentStatus, DepositStatus, Booking } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService, contractService, checkinService, checkoutService } from '@/lib/services';
import { spaceService } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const statusConfig: Record<BookingStatus, { label: string; variant: 'pending' | 'confirmed' | 'rejected' | 'muted' | 'success' }> = {
  requested: { label: 'Angefragt', variant: 'pending' },
  pending: { label: 'Ausstehend', variant: 'pending' },
  confirmed: { label: 'Bestätigt', variant: 'confirmed' },
  rejected: { label: 'Abgelehnt', variant: 'rejected' },
  cancelled: { label: 'Storniert', variant: 'muted' },
  completed: { label: 'Abgeschlossen', variant: 'success' },
  in_progress: { label: 'Laufend', variant: 'confirmed' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: 'Ausstehend', color: 'text-yellow-600' },
  processing: { label: 'In Bearbeitung', color: 'text-blue-600' },
  paid: { label: 'Bezahlt', color: 'text-green-600' },
  failed: { label: 'Fehlgeschlagen', color: 'text-red-600' },
  refunded: { label: 'Erstattet', color: 'text-gray-600' },
};

const depositStatusConfig: Record<DepositStatus, { label: string; color: string }> = {
  pending: { label: 'Ausstehend', color: 'text-yellow-600' },
  held: { label: 'Einbehalten', color: 'text-blue-600' },
  released: { label: 'Freigegeben', color: 'text-green-600' },
  withheld_partial: { label: 'Teilweise einbehalten', color: 'text-orange-600' },
  withheld_full: { label: 'Vollständig einbehalten', color: 'text-red-600' },
};

export default function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [photoType, setPhotoType] = useState<'checkin' | 'checkout'>('checkin');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Use logged-in user's ID
  const landlordId = user?.id || '';

  // Fetch spaces
  const { data: spaces = [], isLoading: isSpacesLoading } = useQuery({
    queryKey: ['spaces', 'landlord', landlordId],
    queryFn: () => spaceService.fetchByOwner(landlordId),
  });

  // Fetch bookings
  const { data: bookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ['bookings', 'landlord', landlordId],
    queryFn: () => bookingService.fetchForLandlord(landlordId),
  });

  // Fetch contracts
  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts', 'landlord', landlordId],
    queryFn: () => contractService.fetchForLandlord(landlordId),
  });

  // Fetch check-in photos for selected booking
  const { data: checkinPhotos = [] } = useQuery({
    queryKey: ['checkin-photos', selectedBooking?.id],
    queryFn: () => selectedBooking ? checkinService.fetchPhotos(selectedBooking.id) : Promise.resolve([]),
    enabled: !!selectedBooking && photoDialogOpen && photoType === 'checkin',
  });

  // Fetch check-out photos for selected booking
  const { data: checkoutPhotos = [] } = useQuery({
    queryKey: ['checkout-photos', selectedBooking?.id],
    queryFn: () => selectedBooking ? checkoutService.fetchPhotos(selectedBooking.id) : Promise.resolve([]),
    enabled: !!selectedBooking && photoDialogOpen && photoType === 'checkout',
  });

  // Mutations
  const confirmMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.confirm(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Buchung bestätigt', description: 'Die Buchungsanfrage wurde angenommen.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Die Buchung konnte nicht bestätigt werden.', variant: 'destructive' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.reject(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Buchung abgelehnt', description: 'Die Buchungsanfrage wurde abgelehnt.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Die Buchung konnte nicht abgelehnt werden.', variant: 'destructive' });
    },
  });

  const releaseDepositMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.releaseDeposit(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Kaution freigegeben', description: 'Die Kaution wurde erfolgreich freigegeben.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Die Kaution konnte nicht freigegeben werden.', variant: 'destructive' });
    },
  });

  const withholdDepositMutation = useMutation({
    mutationFn: ({ bookingId, type }: { bookingId: string; type: 'partial' | 'full' }) =>
      bookingService.withholdDeposit(bookingId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Kaution einbehalten', description: 'Der Kautionsstatus wurde aktualisiert.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Der Kautionsstatus konnte nicht aktualisiert werden.', variant: 'destructive' });
    },
  });

  const generateContractMutation = useMutation({
    mutationFn: async (booking: Booking) => {
      const contract = await contractService.createFromBooking(booking);
      await contractService.generatePdf(contract.id);
      return contract;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({ title: 'Vertrag erstellt', description: 'Der Mietvertrag wurde erfolgreich generiert.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Der Vertrag konnte nicht erstellt werden.', variant: 'destructive' });
    },
  });

  // Filter bookings
  const pendingRequests = bookings.filter(b => b.status === 'requested' || b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const handleViewPhotos = (booking: Booking, type: 'checkin' | 'checkout') => {
    setSelectedBooking(booking);
    setPhotoType(type);
    setPhotoDialogOpen(true);
  };

  const getContractForBooking = (bookingId: string) => {
    return contracts.find(c => c.bookingId === bookingId);
  };

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
                  Willkommen{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
                </h1>
                <p className="text-muted-foreground">
                  Verwalten Sie Ihre Flachen, Buchungen und Vertrage.
                </p>
              </div>
              <Button variant="accent" asChild>
                <Link to="/dashboard/landlord/new-space">
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
              { label: 'Meine Flächen', value: spaces.length, icon: Building2 },
              { label: 'Offene Anfragen', value: pendingRequests.length, icon: Clock },
              { label: 'Aktive Buchungen', value: confirmedBookings.length, icon: Calendar },
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
                <TabsTrigger value="contracts">Verträge</TabsTrigger>
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
                      {!isBookingsLoading && pendingRequests.slice(0, 3).map((request) => (
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
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => confirmMutation.mutate(request.id)}
                              disabled={confirmMutation.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectMutation.mutate(request.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {!isBookingsLoading && pendingRequests.length === 0 && (
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
                      {!isBookingsLoading && bookings.slice(0, 3).map((booking) => {
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
                  {!isSpacesLoading && spaces.map((space) => (
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
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/dashboard/landlord/edit-space/${space.id}`}>
                              <Pencil className="w-4 h-4 mr-1" />
                              Bearbeiten
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Add new space card */}
                  <Card variant="bordered" className="flex items-center justify-center min-h-[280px] border-dashed">
                    <Link
                      to="/dashboard/landlord/new-space"
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
                  {!isBookingsLoading && pendingRequests.map((request) => (
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
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => confirmMutation.mutate(request.id)}
                              disabled={confirmMutation.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Annehmen
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rejectMutation.mutate(request.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Ablehnen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {!isBookingsLoading && pendingRequests.length === 0 && (
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

              {/* Bookings Tab - Enhanced */}
              <TabsContent value="bookings">
                <div className="space-y-4">
                  {isBookingsLoading && (
                    <p className="text-muted-foreground">Lade Buchungen...</p>
                  )}
                  {!isBookingsLoading && bookings.map((booking) => {
                    const status = statusConfig[booking.status];
                    const paymentStatus = paymentStatusConfig[booking.paymentStatus];
                    const depositStatus = depositStatusConfig[booking.depositStatus];
                    const contract = getContractForBooking(booking.id);

                    return (
                      <Card key={booking.id} className="p-4">
                        <div className="flex flex-col gap-4">
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

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                                <span>
                                  {booking.startDate.toLocaleDateString('de-DE')} - {booking.endDate.toLocaleDateString('de-DE')}
                                </span>
                                <span>{booking.totalDays} Tage</span>
                                <span className="font-semibold text-foreground">€{booking.totalPrice}</span>
                              </div>

                              {/* Status Badges */}
                              <div className="flex flex-wrap gap-2 mb-3">
                                <div className="flex items-center gap-1 text-xs">
                                  <CreditCard className="w-3 h-3" />
                                  <span className={paymentStatus.color}>{paymentStatus.label}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                  <Shield className="w-3 h-3" />
                                  <span className={depositStatus.color}>Kaution: {depositStatus.label}</span>
                                </div>
                                {contract && (
                                  <div className="flex items-center gap-1 text-xs text-primary">
                                    <FileText className="w-3 h-3" />
                                    <span>Vertrag vorhanden</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2 border-t">
                            {/* View Photos */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPhotos(booking, 'checkin')}
                            >
                              <Camera className="w-4 h-4 mr-1" />
                              Check-in Fotos
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPhotos(booking, 'checkout')}
                            >
                              <ImageIcon className="w-4 h-4 mr-1" />
                              Check-out Fotos
                            </Button>

                            {/* Contract */}
                            {contract?.pdfUrl ? (
                              <Button variant="outline" size="sm" asChild>
                                <a href={contract.pdfUrl} target="_blank" rel="noopener noreferrer">
                                  <Download className="w-4 h-4 mr-1" />
                                  Vertrag
                                </a>
                              </Button>
                            ) : booking.status === 'confirmed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generateContractMutation.mutate(booking)}
                                disabled={generateContractMutation.isPending}
                              >
                                <FileText className="w-4 h-4 mr-1" />
                                Vertrag erstellen
                              </Button>
                            )}

                            {/* Deposit Actions */}
                            {booking.depositStatus === 'held' && booking.status === 'completed' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => releaseDepositMutation.mutate(booking.id)}
                                  disabled={releaseDepositMutation.isPending}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Kaution freigeben
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => withholdDepositMutation.mutate({ bookingId: booking.id, type: 'partial' })}
                                  disabled={withholdDepositMutation.isPending}
                                >
                                  <AlertTriangle className="w-4 h-4 mr-1" />
                                  Teilweise einbehalten
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Contracts Tab */}
              <TabsContent value="contracts">
                <div className="space-y-4">
                  {contracts.length === 0 ? (
                    <Card variant="bordered" className="p-8 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Keine Verträge</h3>
                      <p className="text-muted-foreground">
                        Verträge werden automatisch erstellt, wenn eine Buchung bestätigt wird.
                      </p>
                    </Card>
                  ) : (
                    contracts.map((contract) => {
                      const booking = bookings.find(b => b.id === contract.bookingId);
                      return (
                        <Card key={contract.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-foreground">
                                  {contract.contractNumber}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {booking?.spaceName || 'Unbekannt'} • {booking?.tenantName || 'Unbekannt'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {contract.startDate.toLocaleDateString('de-DE')} - {contract.endDate.toLocaleDateString('de-DE')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={contract.status === 'signed_both' ? 'success' : 'muted'}>
                                {contract.status === 'signed_both' ? 'Unterschrieben' : contract.status}
                              </Badge>
                              {contract.pdfUrl && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={contract.pdfUrl} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Photo Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {photoType === 'checkin' ? 'Check-in Fotos' : 'Check-out Fotos'}
            </DialogTitle>
            <DialogDescription>
              {selectedBooking?.spaceName} - {selectedBooking?.tenantName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {(photoType === 'checkin' ? checkinPhotos : checkoutPhotos).map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.imageUrl}
                  alt={photo.description || 'Foto'}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {photo.roomArea && (
                  <Badge className="absolute bottom-2 left-2" variant="secondary">
                    {photo.roomArea}
                  </Badge>
                )}
                {photoType === 'checkout' && 'hasDamage' in photo && photo.hasDamage && (
                  <Badge className="absolute top-2 right-2" variant="destructive">
                    Schaden
                  </Badge>
                )}
              </div>
            ))}
            {(photoType === 'checkin' ? checkinPhotos : checkoutPhotos).length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Keine Fotos vorhanden
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoDialogOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
