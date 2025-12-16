import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Search,
  Calendar,
  CreditCard,
  Key,
  Camera,
  CheckCircle2,
  Building2,
  Users,
  Shield,
  Clock,
  FileText,
  ArrowRight,
  Handshake,
} from 'lucide-react';
import { motion } from 'framer-motion';

const stepsForTenants = [
  {
    step: 1,
    icon: Search,
    title: 'Fläche finden',
    description:
      'Durchsuchen Sie unsere Plattform nach passenden Gewerbeflächen. Filtern Sie nach Standort, Größe, Preis und Ausstattung.',
  },
  {
    step: 2,
    icon: Calendar,
    title: 'Zeitraum wählen',
    description:
      'Wählen Sie Ihren gewünschten Mietzeitraum aus. Von einem Tag bis zu mehreren Monaten – flexibel nach Ihrem Bedarf.',
  },
  {
    step: 3,
    icon: CreditCard,
    title: 'Sicher bezahlen',
    description:
      'Bezahlen Sie sicher über unsere Plattform. Die Kaution wird treuhänderisch verwaltet und nach der Miete zurückgezahlt.',
  },
  {
    step: 4,
    icon: FileText,
    title: 'Vertrag erhalten',
    description:
      'Sie erhalten automatisch einen rechtssicheren Zwischenmietvertrag mit allen wichtigen Details und Konditionen.',
  },
  {
    step: 5,
    icon: Key,
    title: 'Einziehen',
    description:
      'Übernehmen Sie die Fläche zum vereinbarten Termin. Dokumentieren Sie den Zustand mit Check-in-Fotos über unsere Plattform.',
  },
  {
    step: 6,
    icon: Camera,
    title: 'Check-out',
    description:
      'Am Ende der Mietzeit dokumentieren Sie den Zustand erneut. Bei ordnungsgemäßer Rückgabe wird Ihre Kaution umgehend freigegeben.',
  },
];

const stepsForLandlords = [
  {
    step: 1,
    icon: Building2,
    title: 'Fläche einstellen',
    description:
      'Erstellen Sie ein Inserat mit Fotos, Beschreibung und allen relevanten Details. Legen Sie Preise und Verfügbarkeiten fest.',
  },
  {
    step: 2,
    icon: Users,
    title: 'Anfragen erhalten',
    description:
      'Interessenten können Buchungsanfragen stellen. Sie entscheiden, welche Anfragen Sie annehmen möchten.',
  },
  {
    step: 3,
    icon: Handshake,
    title: 'Buchung bestätigen',
    description:
      'Nach Ihrer Bestätigung wird der Vertrag automatisch erstellt und die Zahlung wird über unsere sichere Plattform abgewickelt.',
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: 'Miete abschließen',
    description:
      'Nach dem Check-out prüfen Sie die Dokumentation und geben die Kaution frei. Die Mietzahlung wird an Sie ausgezahlt.',
  },
];

const benefits = [
  {
    icon: Shield,
    title: 'Sichere Zahlungen',
    description:
      'Alle Transaktionen werden über unsere Plattform abgewickelt. Kautionen werden treuhänderisch verwaltet.',
  },
  {
    icon: FileText,
    title: 'Rechtssichere Verträge',
    description:
      'Automatisch generierte Zwischenmietverträge mit allen wichtigen Klauseln und Bedingungen.',
  },
  {
    icon: Camera,
    title: 'Dokumentation',
    description:
      'Check-in und Check-out Fotos schützen beide Parteien und klären den Zustand der Fläche.',
  },
  {
    icon: Clock,
    title: 'Flexible Laufzeiten',
    description:
      'Von einem Tag bis zu mehreren Monaten – Sie bestimmen die Mietdauer nach Ihrem Bedarf.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-display-sm md:text-display text-foreground mb-6"
              >
                So funktioniert <span className="text-primary">Spacefindr</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Gewerbeflächen flexibel mieten oder vermieten – einfach, sicher und transparent.
                Erfahren Sie, wie unser Prozess funktioniert.
              </motion.p>
            </div>
          </div>
        </section>

        {/* For Tenants */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-display-sm text-foreground mb-4">Für Mieter</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                In wenigen Schritten zur perfekten Gewerbefläche für Ihr Projekt
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stepsForTenants.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full relative overflow-hidden hover:border-primary/30 transition-colors">
                    <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                      {item.step}
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="accent" size="lg" asChild>
                <Link to="/search">
                  Jetzt Fläche suchen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* For Landlords */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-display-sm text-foreground mb-4">Für Vermieter</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vermieten Sie Ihre Gewerbeflächen schnell und unkompliziert
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stepsForLandlords.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full text-center hover:border-primary/30 transition-colors">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div className="text-sm font-semibold text-primary mb-2">Schritt {item.step}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/landlords">
                  Mehr für Vermieter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-display-sm text-foreground mb-4">Ihre Vorteile</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Warum Spacefindr die beste Wahl für Ihre Gewerbeflächen-Vermietung ist
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
                  <Card className="p-6 h-full text-center hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display-sm text-foreground mb-4">Häufige Fragen</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: 'Wie lange kann ich eine Fläche mieten?',
                    a: 'Die Mietdauer ist flexibel – von einem Tag bis zu mehreren Monaten. Die genauen Mindest- und Höchstmietdauern werden vom Vermieter festgelegt.',
                  },
                  {
                    q: 'Wie ist die Kaution geregelt?',
                    a: 'Die Kaution wird über unsere Plattform treuhänderisch verwaltet. Nach ordnungsgemäßer Rückgabe der Fläche und Freigabe durch den Vermieter wird sie an Sie zurückgezahlt.',
                  },
                  {
                    q: 'Was passiert bei Schäden?',
                    a: 'Durch die Check-in und Check-out Dokumentation mit Fotos ist der Zustand der Fläche jederzeit nachvollziehbar. Bei Schäden kann die Kaution entsprechend einbehalten werden.',
                  },
                  {
                    q: 'Welche Flächen kann ich anbieten?',
                    a: 'Sie können alle Arten von Gewerbeflächen anbieten: Büros, Lager, Pop-up Stores, Event-Locations, Studios und mehr.',
                  },
                ].map((faq, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container">
            <Card className="p-8 md:p-12 gradient-primary text-primary-foreground text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Bereit loszulegen?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Registrieren Sie sich kostenlos und finden Sie noch heute die perfekte Gewerbefläche
                oder vermieten Sie Ihre eigene Fläche.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/auth?mode=register">
                    Jetzt registrieren
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/search">Flächen entdecken</Link>
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
