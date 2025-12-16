import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  BookOpen,
  CreditCard,
  Calendar,
  Key,
  Shield,
  MessageCircle,
  FileText,
  Building2,
  Users,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const categories = [
  {
    icon: Search,
    title: 'Erste Schritte',
    description: 'Lernen Sie die Grundlagen von Spacefindr kennen',
    articles: [
      'Wie erstelle ich ein Konto?',
      'Wie finde ich die richtige Fläche?',
      'Wie funktioniert die Buchung?',
    ],
    href: '/faq#erste-schritte',
  },
  {
    icon: Calendar,
    title: 'Buchungen',
    description: 'Alles rund um Buchungsanfragen und Reservierungen',
    articles: [
      'Wie sende ich eine Buchungsanfrage?',
      'Wie kann ich eine Buchung stornieren?',
      'Was passiert nach der Bestätigung?',
    ],
    href: '/faq#buchungen',
  },
  {
    icon: CreditCard,
    title: 'Zahlungen & Kaution',
    description: 'Informationen zu Zahlungen und Kautionsabwicklung',
    articles: [
      'Welche Zahlungsmethoden werden akzeptiert?',
      'Wie funktioniert die Kautionsabwicklung?',
      'Wann erhalte ich meine Kaution zurück?',
    ],
    href: '/faq#zahlungen',
  },
  {
    icon: FileText,
    title: 'Verträge',
    description: 'Fragen zu Mietverträgen und rechtlichen Themen',
    articles: [
      'Wie funktioniert der digitale Vertrag?',
      'Was steht im Zwischenmietvertrag?',
      'Wie kündige ich einen Vertrag?',
    ],
    href: '/faq#vertraege',
  },
  {
    icon: Building2,
    title: 'Für Vermieter',
    description: 'Hilfe für Vermieter bei der Flächenverwaltung',
    articles: [
      'Wie inseriere ich meine Fläche?',
      'Wie lege ich Preise fest?',
      'Wie bearbeite ich Buchungsanfragen?',
    ],
    href: '/faq#vermieter',
  },
  {
    icon: Shield,
    title: 'Sicherheit',
    description: 'Informationen zu Sicherheit und Vertrauen',
    articles: [
      'Wie sicher sind meine Daten?',
      'Wie werden Nutzer verifiziert?',
      'Was tun bei Problemen?',
    ],
    href: '/faq#sicherheit',
  },
];

const popularArticles = [
  { title: 'Wie erstelle ich ein Konto?', category: 'Erste Schritte' },
  { title: 'Wie funktioniert die Kautionsabwicklung?', category: 'Zahlungen' },
  { title: 'Was passiert bei Schäden?', category: 'Sicherheit' },
  { title: 'Wie storniere ich eine Buchung?', category: 'Buchungen' },
  { title: 'Welche Flächen kann ich vermieten?', category: 'Vermieter' },
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6" />
                <h1 className="text-display-sm md:text-display text-foreground mb-4">
                  Wie können wir helfen?
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Durchsuchen Sie unsere Hilfe-Artikel oder kontaktieren Sie unser Support-Team
                </p>
              </motion.div>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative max-w-xl mx-auto"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Suchen Sie nach Hilfe-Artikeln..."
                  className="pl-12 pr-4 py-6 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-display-sm text-foreground text-center mb-12">
              Hilfe-Kategorien
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={category.href}>
                    <Card className="p-6 h-full hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                        <category.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <ul className="space-y-2">
                        {category.articles.map((article) => (
                          <li
                            key={article}
                            className="text-sm text-primary hover:underline flex items-center gap-2"
                          >
                            <ArrowRight className="w-3 h-3" />
                            {article}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-display-sm text-foreground text-center mb-12">
              Beliebte Artikel
            </h2>

            <div className="max-w-2xl mx-auto">
              <Card className="divide-y divide-border">
                {popularArticles.map((article, index) => (
                  <Link
                    key={article.title}
                    to="/faq"
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{article.title}</p>
                      <p className="text-sm text-muted-foreground">{article.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="container">
            <Card className="p-8 md:p-12 text-center max-w-2xl mx-auto">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Noch Fragen?
              </h2>
              <p className="text-muted-foreground mb-6">
                Unser Support-Team hilft Ihnen gerne weiter. Kontaktieren Sie uns
                per E-Mail oder Telefon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/contact">
                    Kontakt aufnehmen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/faq">Alle FAQ anzeigen</Link>
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
