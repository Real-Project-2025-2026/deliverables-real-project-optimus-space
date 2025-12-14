import { useState } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2, Calendar, Euro, Users, FileText,
  CheckCircle2, XCircle, Clock, Eye, AlertTriangle,
  MapPin, Gift, Shield, CreditCard, TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BookingStatus, PaymentStatus, DepositStatus,
  VacancyReportStatus, RewardStatus, VacancyReport
} from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bookingService,
  spaceService,
  contractService,
  vacancyReportService,
} from '@/lib/services';
import { useToast } from '@/hooks/use-toast';

const bookingStatusConfig: Record<BookingStatus, { label: string; variant: 'pending' | 'confirmed' | 'rejected' | 'muted' | 'success' }> = {
  requested: { label: 'Angefragt', variant: 'pending' },
  pending: { label: 'Ausstehend', variant: 'pending' },
  confirmed: { label: 'Bestätigt', variant: 'confirmed' },
  rejected: { label: 'Abgelehnt', variant: 'rejected' },
  cancelled: { label: 'Storniert', variant: 'muted' },
  completed: { label: 'Abgeschlossen', variant: 'success' },
  in_progress: { label: 'Laufend', variant: 'confirmed' },
};

const vacancyStatusConfig: Record<VacancyReportStatus, { label: string; color: string }> = {
  submitted: { label: 'Eingereicht', color: 'bg-blue-100 text-blue-800' },
  under_review: { label: 'In Prüfung', color: 'bg-yellow-100 text-yellow-800' },
  verified: { label: 'Verifiziert', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Abgelehnt', color: 'bg-red-100 text-red-800' },
  converted_to_space: { label: 'Konvertiert', color: 'bg-purple-100 text-purple-800' },
  duplicate: { label: 'Duplikat', color: 'bg-gray-100 text-gray-800' },
};

const rewardStatusConfig: Record<RewardStatus, { label: string; color: string }> = {
  pending: { label: 'Ausstehend', color: 'text-yellow-600' },
  eligible: { label: 'Berechtigt', color: 'text-green-600' },
  paid: { label: 'Ausgezahlt', color: 'text-blue-600' },
  not_eligible: { label: 'Nicht berechtigt', color: 'text-gray-600' },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVacancy, setSelectedVacancy] = useState<VacancyReport | null>(null);
  const [vacancyDialogOpen, setVacancyDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<VacancyReportStatus>('submitted');

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const adminId = '55555555-5555-5555-5555-555555555555';

  // Fetch all data
  const { data: allSpaces = [], isLoading: isSpacesLoading } = useQuery({
    queryKey: ['spaces', 'all'],
    queryFn: () => spaceService.fetchAll(),
  });

  const { data: allBookings = [], isLoading: isBookingsLoading } = useQuery({
    queryKey: ['bookings', 'all'],
    queryFn: () => bookingService.fetchAll(),
  });

  const { data: allContracts = [] } = useQuery({
    queryKey: ['contracts', 'all'],
    queryFn: () => contractService.fetchAll(),
  });

  const { data: allVacancyReports = [], isLoading: isVacancyLoading } = useQuery({
    queryKey: ['vacancy-reports', 'all'],
    queryFn: () => vacancyReportService.fetchAll(),
  });

  const { data: vacancyStats } = useQuery({
    queryKey: ['vacancy-reports', 'stats'],
    queryFn: () => vacancyReportService.getStatistics(),
  });

  // Mutations
  const updateVacancyMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: VacancyReportStatus; notes?: string }) =>
      vacancyReportService.updateStatus(id, status, adminId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancy-reports'] });
      toast({ title: 'Status aktualisiert', description: 'Die Leerstandsmeldung wurde aktualisiert.' });
      setVacancyDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Der Status konnte nicht aktualisiert werden.', variant: 'destructive' });
    },
  });

  const markRewardPaidMutation = useMutation({
    mutationFn: (id: string) => vacancyReportService.markRewardPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancy-reports'] });
      toast({ title: 'Belohnung ausgezahlt', description: 'Die Belohnung wurde als ausgezahlt markiert.' });
    },
    onError: () => {
      toast({ title: 'Fehler', description: 'Die Belohnung konnte nicht als ausgezahlt markiert werden.', variant: 'destructive' });
    },
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Status aktualisiert' });
    },
    onError: () => {
      toast({ title: 'Fehler', variant: 'destructive' });
    },
  });

  const releaseDepositMutation = useMutation({
    mutationFn: (id: string) => bookingService.releaseDeposit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Kaution freigegeben' });
    },
  });

  // Stats
  const stats = {
    totalSpaces: allSpaces.length,
    totalBookings: allBookings.length,
    totalRevenue: allBookings
      .filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0),
    pendingVacancies: allVacancyReports.filter(v => v.status === 'submitted').length,
    eligibleRewards: allVacancyReports.filter(v => v.rewardStatus === 'eligible').length,
  };

  const handleOpenVacancyDetails = (vacancy: VacancyReport) => {
    setSelectedVacancy(vacancy);
    setNewStatus(vacancy.status);
    setAdminNotes(vacancy.adminNotes || '');
    setVacancyDialogOpen(true);
  };

  const handleUpdateVacancy = () => {
    if (!selectedVacancy) return;
    updateVacancyMutation.mutate({
      id: selectedVacancy.id,
      status: newStatus,
      notes: adminNotes,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">Admin</Badge>
            </div>
            <h1 className="text-display-sm text-foreground mb-2">
              Admin-Dashboard
            </h1>
            <p className="text-muted-foreground">
              Verwalten Sie die gesamte Plattform: Flächen, Buchungen, Nutzer und Leerstandsmeldungen.
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          >
            {[
              { label: 'Flächen', value: stats.totalSpaces, icon: Building2, color: 'bg-blue-100' },
              { label: 'Buchungen', value: stats.totalBookings, icon: Calendar, color: 'bg-green-100' },
              { label: 'Umsatz', value: `€${stats.totalRevenue.toLocaleString()}`, icon: Euro, color: 'bg-yellow-100' },
              { label: 'Neue Meldungen', value: stats.pendingVacancies, icon: MapPin, color: 'bg-purple-100' },
              { label: 'Offene Belohnungen', value: stats.eligibleRewards, icon: Gift, color: 'bg-pink-100' },
            ].map((stat) => (
              <Card key={stat.label} variant="bordered" className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
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
                <TabsTrigger value="vacancies">
                  Leerstandsmeldungen
                  {stats.pendingVacancies > 0 && (
                    <Badge variant="accent" className="ml-2">
                      {stats.pendingVacancies}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="bookings">Alle Buchungen</TabsTrigger>
                <TabsTrigger value="spaces">Alle Flächen</TabsTrigger>
                <TabsTrigger value="contracts">Verträge</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Vacancy stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Leerstandsmeldungen
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {vacancyStats && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-2xl font-bold">{vacancyStats.total}</p>
                            <p className="text-xs text-muted-foreground">Gesamt</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-700">{vacancyStats.submitted}</p>
                            <p className="text-xs text-blue-600">Neu eingereicht</p>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-700">{vacancyStats.converted}</p>
                            <p className="text-xs text-green-600">Konvertiert</p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-700">{vacancyStats.pendingRewards}</p>
                            <p className="text-xs text-yellow-600">Offene Belohnungen</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-success" />
                        Letzte Buchungen
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {isBookingsLoading ? (
                        <p className="text-muted-foreground">Lade...</p>
                      ) : (
                        allBookings.slice(0, 5).map((booking) => {
                          const status = bookingStatusConfig[booking.status];
                          return (
                            <div
                              key={booking.id}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-sm text-foreground">{booking.spaceName}</p>
                                <p className="text-xs text-muted-foreground">{booking.tenantName}</p>
                              </div>
                              <Badge variant={status.variant}>{status.label}</Badge>
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Vacancies Tab */}
              <TabsContent value="vacancies">
                <div className="space-y-4">
                  {isVacancyLoading ? (
                    <p className="text-muted-foreground">Lade Leerstandsmeldungen...</p>
                  ) : allVacancyReports.length === 0 ? (
                    <Card variant="bordered" className="p-8 text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Keine Meldungen</h3>
                      <p className="text-muted-foreground">Es wurden noch keine Leerstände gemeldet.</p>
                    </Card>
                  ) : (
                    allVacancyReports.map((vacancy) => {
                      const statusStyle = vacancyStatusConfig[vacancy.status];
                      const rewardStyle = rewardStatusConfig[vacancy.rewardStatus];

                      return (
                        <Card key={vacancy.id} className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Photo */}
                            {vacancy.photoUrl && (
                              <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                <img
                                  src={vacancy.photoUrl}
                                  alt="Leerstand"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="font-semibold text-foreground">
                                    {vacancy.objectAddress}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {vacancy.objectZip} {vacancy.objectCity}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyle.color}`}>
                                  {statusStyle.label}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                                <span>Gemeldet von: {vacancy.reporterName}</span>
                                <span>{vacancy.reporterEmail}</span>
                                {vacancy.estimatedSizeSqm && <span>~{vacancy.estimatedSizeSqm} m²</span>}
                              </div>

                              {/* Reward status */}
                              <div className="flex items-center gap-2 mb-3">
                                <Gift className="w-4 h-4" />
                                <span className={`text-sm ${rewardStyle.color}`}>
                                  Belohnung: {rewardStyle.label}
                                </span>
                                {vacancy.rewardStatus === 'eligible' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markRewardPaidMutation.mutate(vacancy.id)}
                                    disabled={markRewardPaidMutation.isPending}
                                  >
                                    Als ausgezahlt markieren
                                  </Button>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenVacancyDetails(vacancy)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details & Bearbeiten
                                </Button>
                                {vacancy.status === 'submitted' && (
                                  <>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => updateVacancyMutation.mutate({
                                        id: vacancy.id,
                                        status: 'verified',
                                      })}
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-1" />
                                      Verifizieren
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => updateVacancyMutation.mutate({
                                        id: vacancy.id,
                                        status: 'rejected',
                                      })}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Ablehnen
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <div className="space-y-4">
                  {isBookingsLoading ? (
                    <p className="text-muted-foreground">Lade Buchungen...</p>
                  ) : (
                    allBookings.map((booking) => {
                      const status = bookingStatusConfig[booking.status];
                      return (
                        <Card key={booking.id} className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-24 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img
                                src={booking.spaceImage}
                                alt={booking.spaceName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-foreground text-sm">
                                  {booking.spaceName}
                                </h3>
                                <Badge variant={status.variant}>{status.label}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {booking.tenantName} → {booking.landlordName}
                              </p>
                              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <span>
                                  {booking.startDate.toLocaleDateString('de-DE')} - {booking.endDate.toLocaleDateString('de-DE')}
                                </span>
                                <span className="font-semibold text-foreground">€{booking.totalPrice}</span>
                              </div>

                              {/* Admin actions */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Select
                                  value={booking.status}
                                  onValueChange={(value) =>
                                    updateBookingStatusMutation.mutate({
                                      id: booking.id,
                                      status: value as BookingStatus,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-40 h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(bookingStatusConfig).map(([value, config]) => (
                                      <SelectItem key={value} value={value}>
                                        {config.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {booking.depositStatus === 'held' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => releaseDepositMutation.mutate(booking.id)}
                                    className="h-8 text-xs"
                                  >
                                    <Shield className="w-3 h-3 mr-1" />
                                    Kaution freigeben
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* Spaces Tab */}
              <TabsContent value="spaces">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isSpacesLoading ? (
                    <p className="text-muted-foreground">Lade Flächen...</p>
                  ) : (
                    allSpaces.map((space) => (
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
                        <div className="p-3">
                          <h3 className="font-semibold text-foreground text-sm mb-1 truncate">
                            {space.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {space.city} • {space.ownerName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground text-sm">
                              €{space.pricePerDay}/Tag
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {space.size} m²
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Contracts Tab */}
              <TabsContent value="contracts">
                <div className="space-y-4">
                  {allContracts.length === 0 ? (
                    <Card variant="bordered" className="p-8 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">Keine Verträge</h3>
                      <p className="text-muted-foreground">Es wurden noch keine Verträge erstellt.</p>
                    </Card>
                  ) : (
                    allContracts.map((contract) => {
                      const booking = allBookings.find(b => b.id === contract.bookingId);
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
                                {booking?.spaceName || 'Unbekannt'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {contract.startDate.toLocaleDateString('de-DE')} - {contract.endDate.toLocaleDateString('de-DE')}
                                {' • '}€{contract.totalAmount}
                              </p>
                            </div>
                            <Badge variant={contract.status === 'signed_both' ? 'success' : 'muted'}>
                              {contract.status}
                            </Badge>
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

      {/* Vacancy Details Dialog */}
      <Dialog open={vacancyDialogOpen} onOpenChange={setVacancyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leerstandsmeldung Details</DialogTitle>
            <DialogDescription>
              {selectedVacancy?.objectAddress}, {selectedVacancy?.objectZip} {selectedVacancy?.objectCity}
            </DialogDescription>
          </DialogHeader>

          {selectedVacancy && (
            <div className="space-y-4">
              {/* Photo */}
              {selectedVacancy.photoUrl && (
                <img
                  src={selectedVacancy.photoUrl}
                  alt="Leerstand"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Gemeldet von</p>
                  <p className="font-medium">{selectedVacancy.reporterName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">E-Mail</p>
                  <p className="font-medium">{selectedVacancy.reporterEmail}</p>
                </div>
                {selectedVacancy.reporterPhone && (
                  <div>
                    <p className="text-muted-foreground">Telefon</p>
                    <p className="font-medium">{selectedVacancy.reporterPhone}</p>
                  </div>
                )}
                {selectedVacancy.estimatedSizeSqm && (
                  <div>
                    <p className="text-muted-foreground">Geschätzte Größe</p>
                    <p className="font-medium">{selectedVacancy.estimatedSizeSqm} m²</p>
                  </div>
                )}
                {selectedVacancy.vacancyDuration && (
                  <div>
                    <p className="text-muted-foreground">Leerstand seit</p>
                    <p className="font-medium">{selectedVacancy.vacancyDuration}</p>
                  </div>
                )}
              </div>

              {selectedVacancy.objectDescription && (
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Beschreibung</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedVacancy.objectDescription}</p>
                </div>
              )}

              {selectedVacancy.ownerContactInfo && (
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Eigentümer-Info</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{selectedVacancy.ownerContactInfo}</p>
                </div>
              )}

              {/* Status update */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select
                    value={newStatus}
                    onValueChange={(value) => setNewStatus(value as VacancyReportStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(vacancyStatusConfig).map(([value, config]) => (
                        <SelectItem key={value} value={value}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Belohnungsstatus</label>
                  <p className={`text-sm font-medium ${rewardStatusConfig[selectedVacancy.rewardStatus].color}`}>
                    {rewardStatusConfig[selectedVacancy.rewardStatus].label}
                    {selectedVacancy.rewardStatus === 'eligible' && ` (€${selectedVacancy.rewardAmount})`}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Admin-Notizen</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Interne Notizen..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVacancyDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleUpdateVacancy} disabled={updateVacancyMutation.isPending}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
