import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingStatus } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fetchBookingsForTenant } from '@/lib/api';

const statusConfig: Record<BookingStatus, { label: string; variant: 'pending' | 'confirmed' | 'rejected' | 'muted' | 'success' }> = {
  pending: { label: 'Ausstehend', variant: 'pending' },
  confirmed: { label: 'Bestätigt', variant: 'confirmed' },
  rejected: { label: 'Abgelehnt', variant: 'rejected' },
  cancelled: { label: 'Storniert', variant: 'muted' },
  completed: { label: 'Abgeschlossen', variant: 'success' },
};

export default function TenantDashboard() {
  const tenantId = '11111111-1111-1111-1111-111111111111';
  const { data: bookings = [], isLoading, isError } = useQuery({
    queryKey: ['bookings', 'tenant', tenantId],
    queryFn: () => fetchBookingsForTenant(tenantId),
  });
  
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
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
              Willkommen zurück, Max!
            </h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Buchungen und finden Sie neue Flächen.
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
              { label: 'Bestätigt', value: stats.confirmed, icon: CheckCircle2 },
              { label: 'Abgeschlossen', value: stats.completed, icon: Clock },
            ].map((stat, index) => (
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
              {!isLoading && !isError && bookings.map((booking, index) => {
                const status = statusConfig[booking.status];
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card variant="interactive" className="p-4">
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

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
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
                    </Card>
                  </motion.div>
                );
              })}

              {!isLoading && !isError && bookings.length === 0 && (
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

      <Footer />
    </div>
  );
}
