import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar, Clock, ArrowRight, CheckCircle2, AlertCircle, Search,
  Camera, Upload, CreditCard, FileText, Download, Shield, XCircle,
  Loader2, ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingStatus, PaymentStatus, DepositStatus, Booking, RoomArea } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bookingService,
  paymentService,
  contractService,
  checkinService,
  checkoutService,
  roomAreaLabels,
} from '@/lib/services';
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

export default function TenantDashboard() {
  const { user } = useAuth();
  const tenantId = user?.id || '';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [photoType, setPhotoType] = useState<'checkin' | 'checkout'>('checkin');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'overview' | 'processing' | 'success' | 'failed'>('overview');

  // Photo upload state
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoDescription, setPhotoDescription] = useState('');
  const [selectedRoomArea, setSelectedRoomArea] = useState<RoomArea>('main_room');

  // Fetch bookings
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['bookings', 'tenant', tenantId],
    queryFn: () => bookingService.fetchForTenant(tenantId),
  });

  // Fetch contracts
  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts', 'tenant', tenantId],
    queryFn: () => contractService.fetchForTenant(tenantId),
  });

  // Fetch check-in photos for selected booking
  const { data: checkinPhotos = [], refetch: refetchCheckinPhotos } = useQuery({
    queryKey: ['checkin-photos', selectedBooking?.id],
    queryFn: () => selectedBooking ? checkinService.fetchPhotos(selectedBooking.id) : Promise.resolve([]),
    enabled: !!selectedBooking && photoDialogOpen && photoType === 'checkin',
  });

  // Fetch check-out photos for selected booking
  const { data: checkoutPhotos = [], refetch: refetchCheckoutPhotos } = useQuery({
    queryKey: ['checkout-photos', selectedBooking?.id],
    queryFn: () => selectedBooking ? checkoutService.fetchPhotos(selectedBooking.id) : Promise.resolve([]),
    enabled: !!selectedBooking && photoDialogOpen && photoType === 'checkout',
  });

  // Filter out cancelled bookings for display
  const visibleBookings = bookings.filter(b => b.status !== 'cancelled');

  // Stats (only count visible bookings)
  const stats = {
    total: visibleBookings.length,
    pending: visibleBookings.filter(b => b.status === 'pending' || b.status === 'requested').length,
    confirmed: visibleBookings.filter(b => b.status === 'confirmed' || b.status === 'in_progress').length,
    completed: visibleBookings.filter(b => b.status === 'completed').length,
  };

  // Handlers
  const handleOpenPayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setPaymentStep('overview');
    setPaymentDialogOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedBooking) return;

    setIsProcessingPayment(true);
    setPaymentStep('processing');

    try {
      // Create payment intent
      const intent = await paymentService.createPaymentIntent(
        selectedBooking.id,
        selectedBooking.totalPrice,
        `Buchung: ${selectedBooking.spaceName}`
      );

      // Process payment (simulated)
      const result = await paymentService.processPayment(intent.id);

      if (result.success) {
        setPaymentStep('success');
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        toast({
          title: 'Zahlung erfolgreich!',
          description: 'Ihre Buchung wurde bestätigt.',
        });
      } else {
        setPaymentStep('failed');
        toast({
          title: 'Zahlung fehlgeschlagen',
          description: result.errorMessage || 'Bitte versuchen Sie es erneut.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setPaymentStep('failed');
      toast({
        title: 'Fehler',
        description: 'Die Zahlung konnte nicht verarbeitet werden.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSimulateFailure = async () => {
    if (!selectedBooking) return;

    setIsProcessingPayment(true);
    setPaymentStep('processing');

    try {
      const intent = await paymentService.createPaymentIntent(
        selectedBooking.id,
        selectedBooking.totalPrice
      );
      await paymentService.simulateFailure(intent.id, 'Demo: Simulierter Zahlungsfehler');
      setPaymentStep('failed');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    } catch (error) {
      setPaymentStep('failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleOpenPhotoUpload = (booking: Booking, type: 'checkin' | 'checkout') => {
    setSelectedBooking(booking);
    setPhotoType(type);
    setPhotoDescription('');
    setSelectedRoomArea('main_room');
    setPhotoDialogOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBooking) return;

    setUploadingPhoto(true);

    try {
      if (photoType === 'checkin') {
        await checkinService.uploadPhoto(selectedBooking.id, tenantId, file, {
          description: photoDescription,
          roomArea: selectedRoomArea,
        });
        refetchCheckinPhotos();
      } else {
        await checkoutService.uploadPhoto(selectedBooking.id, tenantId, file, {
          description: photoDescription,
          roomArea: selectedRoomArea,
        });
        refetchCheckoutPhotos();
      }

      toast({
        title: 'Foto hochgeladen',
        description: 'Das Foto wurde erfolgreich gespeichert.',
      });

      setPhotoDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Das Foto konnte nicht hochgeladen werden.',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: 'Anfrage zurückgenommen',
        description: 'Ihre Buchungsanfrage wurde erfolgreich storniert.',
      });
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    },
    onError: () => {
      toast({
        title: 'Fehler',
        description: 'Die Anfrage konnte nicht storniert werden.',
        variant: 'destructive',
      });
    },
  });

  const handleOpenCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      cancelMutation.mutate(selectedBooking.id);
    }
  };

  // Check if booking can be cancelled by tenant
  const canCancelBooking = (booking: Booking) => {
    // Tenant can cancel if status is requested, pending, or confirmed (before start date)
    const now = new Date();
    const startDate = new Date(booking.startDate);
    return (
      (booking.status === 'requested' || booking.status === 'pending') ||
      (booking.status === 'confirmed' && now < startDate)
    );
  };

  const getContractForBooking = (bookingId: string) => {
    return contracts.find(c => c.bookingId === bookingId);
  };

  const canUploadCheckin = (booking: Booking) => {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    // Allow check-in photos from 1 day before to end of booking
    return (
      (booking.status === 'confirmed' || booking.status === 'in_progress') &&
      now >= new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
    );
  };

  const canUploadCheckout = (booking: Booking) => {
    return booking.status === 'in_progress' || booking.status === 'completed';
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
            <h1 className="text-display-sm text-foreground mb-2">
              Willkommen zuruck{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Buchungen, Zahlungen und Dokumente.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: 'Gesamt', value: stats.total, icon: Calendar },
              { label: 'Ausstehend', value: stats.pending, icon: AlertCircle },
              { label: 'Aktiv', value: stats.confirmed, icon: CheckCircle2 },
              { label: 'Abgeschlossen', value: stats.completed, icon: Clock },
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

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Button variant="accent" asChild>
              <Link to="/search">
                <Search className="w-4 h-4 mr-2" />
                Neue Fläche suchen
              </Link>
            </Button>
          </motion.div>

          {/* Bookings list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading text-foreground">Meine Buchungen</h2>
            </div>

            <div className="space-y-4">
              {isLoading && (
                <p className="text-muted-foreground">Lade Buchungen...</p>
              )}
              {isError && (
                <p className="text-muted-foreground">Buchungen konnten nicht geladen werden.</p>
              )}
              {!isLoading && !isError && visibleBookings.map((booking, index) => {
                const status = statusConfig[booking.status];
                const paymentStatus = paymentStatusConfig[booking.paymentStatus];
                const contract = getContractForBooking(booking.id);

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card variant="interactive" className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Image */}
                          <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={booking.spaceImage}
                              alt={booking.spaceName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-foreground truncate">
                                {booking.spaceName}
                              </h3>
                              <Badge variant={status.variant}>
                                {status.label}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {booking.startDate.toLocaleDateString('de-DE')} - {booking.endDate.toLocaleDateString('de-DE')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{booking.totalDays} Tage</span>
                              </div>
                            </div>

                            {/* Status badges */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <div className="flex items-center gap-1 text-xs">
                                <CreditCard className="w-3 h-3" />
                                <span className={paymentStatus.color}>{paymentStatus.label}</span>
                              </div>
                              {booking.depositAmount && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Shield className="w-3 h-3" />
                                  <span>Kaution: €{booking.depositAmount}</span>
                                </div>
                              )}
                              {contract && (
                                <div className="flex items-center gap-1 text-xs text-primary">
                                  <FileText className="w-3 h-3" />
                                  <span>Vertrag</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                €{booking.totalPrice}
                              </span>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/space/${booking.spaceId}`}>
                                  Details
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {/* Payment button */}
                          {booking.paymentStatus === 'pending' && booking.status === 'confirmed' && (
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => handleOpenPayment(booking)}
                            >
                              <CreditCard className="w-4 h-4 mr-1" />
                              Jetzt bezahlen
                            </Button>
                          )}

                          {/* Contract download */}
                          {contract?.pdfUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={contract.pdfUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-1" />
                                Vertrag
                              </a>
                            </Button>
                          )}

                          {/* Check-in photos */}
                          {canUploadCheckin(booking) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenPhotoUpload(booking, 'checkin')}
                            >
                              <Camera className="w-4 h-4 mr-1" />
                              Check-in Fotos
                            </Button>
                          )}

                          {/* Check-out photos */}
                          {canUploadCheckout(booking) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenPhotoUpload(booking, 'checkout')}
                            >
                              <ImageIcon className="w-4 h-4 mr-1" />
                              Check-out Fotos
                            </Button>
                          )}

                          {/* Cancel booking */}
                          {canCancelBooking(booking) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleOpenCancelDialog(booking)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Stornieren
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {!isLoading && !isError && visibleBookings.length === 0 && (
                <Card variant="bordered" className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Keine Buchungen</h3>
                  <p className="text-muted-foreground mb-4">
                    Sie haben noch keine Buchungen. Entdecken Sie unsere Gewerbeflächen!
                  </p>
                  <Button variant="accent" asChild>
                    <Link to="/search">Flächen durchsuchen</Link>
                  </Button>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {paymentStep === 'success' ? 'Zahlung erfolgreich!' :
               paymentStep === 'failed' ? 'Zahlung fehlgeschlagen' :
               'Buchung bezahlen'}
            </DialogTitle>
            {paymentStep === 'overview' && (
              <DialogDescription>
                {selectedBooking?.spaceName}
              </DialogDescription>
            )}
          </DialogHeader>

          {paymentStep === 'overview' && selectedBooking && (
            <div className="space-y-4">
              {/* Booking summary */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Miete ({selectedBooking.totalDays} Tage)</span>
                  <span>€{selectedBooking.rentAmount || selectedBooking.totalPrice}</span>
                </div>
                {selectedBooking.depositAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kaution</span>
                    <span>€{selectedBooking.depositAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Gesamt</span>
                  <span>€{selectedBooking.totalPrice}</span>
                </div>
              </div>

              {/* Demo notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <strong>Demo-Modus:</strong> Dies ist eine simulierte Zahlung. Es wird kein echtes Geld abgebucht.
              </div>
            </div>
          )}

          {paymentStep === 'processing' && (
            <div className="py-8 text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Zahlung wird verarbeitet...</p>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <p className="text-foreground font-medium mb-2">Ihre Buchung wurde bestätigt!</p>
              <p className="text-sm text-muted-foreground">
                Sie erhalten eine Bestätigungs-E-Mail mit allen Details.
              </p>
            </div>
          )}

          {paymentStep === 'failed' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-foreground font-medium mb-2">Zahlung fehlgeschlagen</p>
              <p className="text-sm text-muted-foreground">
                Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.
              </p>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {paymentStep === 'overview' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleSimulateFailure}
                  disabled={isProcessingPayment}
                  className="flex-1"
                >
                  Fehler simulieren
                </Button>
                <Button
                  variant="accent"
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="flex-1"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bezahlen (Demo)
                </Button>
              </>
            )}
            {(paymentStep === 'success' || paymentStep === 'failed') && (
              <Button
                variant={paymentStep === 'success' ? 'default' : 'outline'}
                onClick={() => setPaymentDialogOpen(false)}
                className="w-full"
              >
                Schließen
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {photoType === 'checkin' ? 'Check-in Fotos' : 'Check-out Fotos'}
            </DialogTitle>
            <DialogDescription>
              {selectedBooking?.spaceName} - Dokumentieren Sie den Zustand der Fläche
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload section */}
            <div className="border-2 border-dashed rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Wählen Sie ein Foto aus oder ziehen Sie es hierher
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Bereich</label>
                    <Select
                      value={selectedRoomArea}
                      onValueChange={(value) => setSelectedRoomArea(value as RoomArea)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roomAreaLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Beschreibung</label>
                    <Textarea
                      placeholder="Optional: Beschreibung..."
                      value={photoDescription}
                      onChange={(e) => setPhotoDescription(e.target.value)}
                      rows={1}
                    />
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird hochgeladen...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Foto auswählen
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Existing photos */}
            <div>
              <h4 className="font-medium mb-2">Hochgeladene Fotos</h4>
              <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                {(photoType === 'checkin' ? checkinPhotos : checkoutPhotos).map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.imageUrl}
                      alt={photo.description || 'Foto'}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    {photo.roomArea && (
                      <Badge className="absolute bottom-1 left-1 text-xs" variant="secondary">
                        {roomAreaLabels[photo.roomArea as RoomArea] || photo.roomArea}
                      </Badge>
                    )}
                  </div>
                ))}
                {(photoType === 'checkin' ? checkinPhotos : checkoutPhotos).length === 0 && (
                  <div className="col-span-3 text-center py-4 text-muted-foreground text-sm">
                    Noch keine Fotos hochgeladen
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoDialogOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buchung stornieren</DialogTitle>
            <DialogDescription>
              Möchten Sie diese Buchungsanfrage wirklich zurücknehmen?
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">{selectedBooking.spaceName}</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    Zeitraum: {selectedBooking.startDate.toLocaleDateString('de-DE')} - {selectedBooking.endDate.toLocaleDateString('de-DE')}
                  </p>
                  <p>Gesamtpreis: €{selectedBooking.totalPrice}</p>
                </div>
              </div>

              {selectedBooking.status === 'confirmed' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <strong>Hinweis:</strong> Diese Buchung wurde bereits bestätigt.
                  Bei einer Stornierung können Stornogebühren anfallen.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelMutation.isPending}
              className="flex-1"
            >
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={cancelMutation.isPending}
              className="flex-1"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird storniert...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Stornieren
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
