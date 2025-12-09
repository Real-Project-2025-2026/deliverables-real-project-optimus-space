import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SpaceCard } from '@/components/spaces/SpaceCard';
import { categoryLabels } from '@/data/mockData';
import { useQuery } from '@tanstack/react-query';
import { fetchSpaces } from '@/lib/api';
import { 
  Search, Building2, Calendar, Shield, ArrowRight, 
  CheckCircle2, MapPin, Clock, Handshake, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Search,
    title: 'Einfache Suche',
    description: 'Finden Sie die perfekte Gewerbefläche mit unserer intelligenten Suche und Kartenansicht.',
  },
  {
    icon: Calendar,
    title: 'Flexible Buchung',
    description: 'Buchen Sie tageweise – perfekt für Events, Pop-ups oder temporäre Projekte.',
  },
  {
    icon: Shield,
    title: 'Sichere Zahlungen',
    description: 'Alle Transaktionen werden sicher über unsere Plattform abgewickelt.',
  },
  {
    icon: Handshake,
    title: 'Verifizierte Partner',
    description: 'Alle Vermieter werden geprüft für maximale Sicherheit und Qualität.',
  },
];

const stats = [
  { value: '1.200+', label: 'Gewerbeflächen' },
  { value: '45+', label: 'Städte' },
  { value: '98%', label: 'Zufriedenheit' },
  { value: '24h', label: 'Antwortzeit' },
];

export default function Index() {
  const { data: spaces, isLoading, isError } = useQuery({
    queryKey: ['spaces', 'featured'],
    queryFn: fetchSpaces,
  });

  const featuredSpaces = spaces?.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-display-sm md:text-display lg:text-display-lg text-foreground mb-6"
            >
              Die richtige Fläche für{' '}
              <span className="text-primary">jeden Anlass</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Mieten oder vermieten Sie Gewerbeflächen tageweise. 
              Büros, Lager, Pop-up Stores oder Event-Locations – flexibel und unkompliziert.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/search">
                  <Search className="w-5 h-5 mr-2" />
                  Fläche finden
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/landlords">
                  Fläche inserieren
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Link key={key} to={`/search?category=${key}`}>
                <Badge 
                  variant="secondary" 
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {label}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-display-sm text-foreground mb-4">
              Warum spacefindr?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wir machen die Vermietung von Gewerbeflächen einfach, sicher und flexibel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="bordered" className="p-6 h-full hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-display-sm text-foreground mb-2">
                Beliebte Flächen
              </h2>
              <p className="text-muted-foreground">
                Entdecken Sie unsere am besten bewerteten Gewerbeflächen
              </p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/search">
                Alle Flächen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && (
              <p className="text-muted-foreground">Lade Flächen...</p>
            )}
            {isError && (
              <p className="text-muted-foreground">Konnte Flächen nicht laden.</p>
            )}
            {!isLoading && !isError && featuredSpaces.map((space, index) => (
              <SpaceCard key={space.id} space={space} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" asChild>
              <Link to="/search">
                Alle Flächen anzeigen
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-display-sm text-foreground mb-4">
              So funktioniert's
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In nur wenigen Schritten zur perfekten Gewerbefläche
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Suchen & Entdecken',
                description: 'Durchsuchen Sie unsere Flächen nach Standort, Kategorie und Ausstattung.',
                icon: Search,
              },
              {
                step: '2',
                title: 'Anfrage senden',
                description: 'Wählen Sie Ihre Wunschdaten und senden Sie eine Buchungsanfrage.',
                icon: Calendar,
              },
              {
                step: '3',
                title: 'Bestätigt & Fertig',
                description: 'Nach Bestätigung durch den Vermieter können Sie die Fläche nutzen.',
                icon: CheckCircle2,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-primary-foreground text-2xl font-bold mb-4 shadow-glow">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-display-sm mb-4">
              Bereit, loszulegen?
            </h2>
            <p className="text-lg text-background/70 mb-8">
              Erstellen Sie ein kostenloses Konto und finden Sie noch heute die perfekte Gewerbefläche.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="xl" asChild>
                <Link to="/auth?mode=register">
                  Jetzt registrieren
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-background/30 text-background hover:bg-background/10"
                asChild
              >
                <Link to="/search">
                  Flächen durchsuchen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
