import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Building2, ArrowRight, CheckCircle2, Euro, 
  Calendar, Shield, TrendingUp, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Euro,
    title: 'Zusätzliche Einnahmen',
    description: 'Verdienen Sie Geld mit ungenutzten Flächen – tageweise und flexibel.',
  },
  {
    icon: Calendar,
    title: 'Volle Kontrolle',
    description: 'Sie bestimmen Verfügbarkeit, Preise und welche Anfragen Sie annehmen.',
  },
  {
    icon: Shield,
    title: 'Sichere Abwicklung',
    description: 'Sichere Zahlungen und Versicherungsschutz für Ihre Fläche.',
  },
  {
    icon: Users,
    title: 'Große Reichweite',
    description: 'Erreichen Sie tausende potenzielle Mieter in ganz Deutschland.',
  },
];

const steps = [
  {
    step: '1',
    title: 'Kostenlos registrieren',
    description: 'Erstellen Sie in wenigen Minuten Ihr Vermieterkonto.',
  },
  {
    step: '2',
    title: 'Fläche inserieren',
    description: 'Beschreiben Sie Ihre Fläche, laden Sie Fotos hoch und legen Sie Preise fest.',
  },
  {
    step: '3',
    title: 'Anfragen erhalten',
    description: 'Prüfen Sie Buchungsanfragen und entscheiden Sie, welche Sie annehmen.',
  },
  {
    step: '4',
    title: 'Verdienen',
    description: 'Nach der Buchung erhalten Sie die Zahlung sicher auf Ihr Konto.',
  },
];

export default function Landlords() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-display-sm md:text-display lg:text-display-lg text-foreground mb-6"
            >
              Vermieten Sie Ihre{' '}
              <span className="text-primary">Gewerbefläche</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Generieren Sie zusätzliche Einnahmen mit ungenutzten Büros, Lagern oder 
              Event-Locations. Einfach, flexibel und sicher.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?mode=register&role=landlord">
                  <Building2 className="w-5 h-5 mr-2" />
                  Jetzt Fläche inserieren
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="#how-it-works">
                  So funktioniert's
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-display-sm text-foreground mb-4">
              Ihre Vorteile als Vermieter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profitieren Sie von einer Plattform, die für Vermieter optimiert ist.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="bordered" className="p-6 h-full hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-display-sm text-foreground mb-4">
              In 4 Schritten zum Vermieter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Starten Sie noch heute und verdienen Sie mit Ihrer Gewerbefläche.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                {index < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
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

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '500+', label: 'Aktive Vermieter' },
              { value: '15.000€', label: 'Ø Jahreseinnahmen' },
              { value: '24h', label: 'Ø Antwortzeit' },
              { value: '4.8/5', label: 'Vermieterbewertung' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-6 text-accent" />
            <h2 className="text-display-sm mb-4">
              Bereit, Ihre Fläche zu vermieten?
            </h2>
            <p className="text-lg text-background/70 mb-8">
              Registrieren Sie sich kostenlos und erstellen Sie Ihr erstes Inserat in wenigen Minuten.
            </p>
            <Button variant="accent" size="xl" asChild>
              <Link to="/auth?mode=register&role=landlord">
                Kostenlos starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
