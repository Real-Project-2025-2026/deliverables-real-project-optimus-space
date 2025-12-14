import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HelpCircle,
  Search,
  Calendar,
  CreditCard,
  FileText,
  Building2,
  Shield,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const faqCategories = [
  {
    id: 'erste-schritte',
    icon: Search,
    title: 'Erste Schritte',
    questions: [
      {
        q: 'Wie erstelle ich ein Konto bei Spacefinder?',
        a: 'Die Registrierung ist einfach und kostenlos. Klicken Sie auf "Registrieren" oben rechts, geben Sie Ihre E-Mail-Adresse ein und wählen Sie, ob Sie Flächen mieten oder vermieten möchten. Nach der Bestätigung Ihrer E-Mail können Sie sofort loslegen.',
      },
      {
        q: 'Ist die Nutzung von Spacefinder kostenlos?',
        a: 'Die Registrierung und Suche nach Flächen ist völlig kostenlos. Erst bei einer erfolgreichen Buchung fallen Servicegebühren an: Für Mieter beträgt die Gebühr 10% des Mietpreises, für Vermieter 5% bei erfolgreicher Vermittlung.',
      },
      {
        q: 'Wie finde ich die passende Fläche?',
        a: 'Nutzen Sie unsere Suchfunktion mit Filtern für Standort, Größe, Preis und Ausstattung. Die Kartenansicht hilft Ihnen, Flächen in Ihrer Wunschgegend zu finden. Sie können auch Favoriten speichern und Benachrichtigungen für neue Angebote einrichten.',
      },
      {
        q: 'Kann ich Flächen vor der Buchung besichtigen?',
        a: 'Ja, Sie können den Vermieter über unsere Plattform kontaktieren und einen Besichtigungstermin vereinbaren. Wir empfehlen dies besonders bei längeren Mietzeiten.',
      },
    ],
  },
  {
    id: 'buchungen',
    icon: Calendar,
    title: 'Buchungen',
    questions: [
      {
        q: 'Wie läuft der Buchungsprozess ab?',
        a: 'Wählen Sie Ihre gewünschte Fläche und den Mietzeitraum aus. Senden Sie dann eine Buchungsanfrage an den Vermieter. Nach dessen Bestätigung erhalten Sie den Mietvertrag und können die Zahlung über unsere sichere Plattform abwickeln.',
      },
      {
        q: 'Wie lange dauert es, bis eine Buchungsanfrage bestätigt wird?',
        a: 'Die meisten Vermieter antworten innerhalb von 24 Stunden. Bei Flächen mit "Sofortbuchung" wird Ihre Anfrage automatisch bestätigt.',
      },
      {
        q: 'Kann ich eine Buchung stornieren?',
        a: 'Ja, Stornierungen sind je nach Stornierungsrichtlinie des Vermieters möglich. Es gibt drei Stufen: Flexibel (kostenlose Stornierung bis 24h vorher), Moderat (50% Erstattung bis 7 Tage vorher), und Strikt (keine Erstattung). Die jeweilige Richtlinie wird bei der Buchung angezeigt.',
      },
      {
        q: 'Was passiert, wenn der Vermieter meine Anfrage ablehnt?',
        a: 'Wenn Ihre Anfrage abgelehnt wird, werden Sie sofort benachrichtigt und es entstehen keine Kosten. Sie können dann eine alternative Fläche suchen.',
      },
    ],
  },
  {
    id: 'zahlungen',
    icon: CreditCard,
    title: 'Zahlungen & Kaution',
    questions: [
      {
        q: 'Welche Zahlungsmethoden werden akzeptiert?',
        a: 'Wir akzeptieren Kreditkarten (Visa, Mastercard), SEPA-Lastschrift und PayPal. Alle Zahlungen werden über unsere sichere Plattform abgewickelt.',
      },
      {
        q: 'Wie funktioniert die Kautionsabwicklung?',
        a: 'Die Kaution wird bei Buchungsbestätigung autorisiert, aber erst am Tag des Check-ins belastet. Sie wird treuhänderisch auf einem separaten Konto verwahrt. Nach dem Check-out und der Freigabe durch den Vermieter wird die Kaution innerhalb von 5-7 Werktagen zurückgezahlt.',
      },
      {
        q: 'Wann erhalte ich meine Kaution zurück?',
        a: 'Der Vermieter hat 48 Stunden nach Check-out Zeit, den Zustand der Fläche zu prüfen. Bei ordnungsgemäßer Rückgabe wird die Kaution automatisch freigegeben. Die Rückzahlung erfolgt dann innerhalb von 5-7 Werktagen.',
      },
      {
        q: 'Was passiert bei Schäden?',
        a: 'Durch die Check-in und Check-out Dokumentation mit Fotos ist der Zustand vor und nach der Miete dokumentiert. Bei Schäden kann der Vermieter einen Teil oder die gesamte Kaution einbehalten. Bei Streitigkeiten vermittelt unser Support-Team.',
      },
    ],
  },
  {
    id: 'vertraege',
    icon: FileText,
    title: 'Verträge',
    questions: [
      {
        q: 'Wie funktioniert der digitale Mietvertrag?',
        a: 'Nach Buchungsbestätigung wird automatisch ein Zwischenmietvertrag erstellt, der alle wichtigen Details enthält: Mietdauer, Preis, Kaution, Ausstattung und Bedingungen. Beide Parteien unterschreiben digital über unsere Plattform.',
      },
      {
        q: 'Sind die Verträge rechtlich bindend?',
        a: 'Ja, unsere digitalen Mietverträge sind nach deutschem Recht vollständig rechtsgültig. Sie wurden von Fachanwälten erstellt und erfüllen alle gesetzlichen Anforderungen.',
      },
      {
        q: 'Was steht im Zwischenmietvertrag?',
        a: 'Der Vertrag enthält: Mietdauer und -preis, Kautionshöhe, Ausstattung der Fläche, Hausordnung, Stornierungsbedingungen, Haftungsregelungen und die Rechte und Pflichten beider Parteien.',
      },
      {
        q: 'Kann ich den Vertrag vorzeitig beenden?',
        a: 'Eine vorzeitige Beendigung ist nach Absprache mit dem Vermieter möglich. Die Konditionen hängen von der vereinbarten Stornierungsrichtlinie ab.',
      },
    ],
  },
  {
    id: 'vermieter',
    icon: Building2,
    title: 'Für Vermieter',
    questions: [
      {
        q: 'Wie inseriere ich meine Fläche?',
        a: 'Registrieren Sie sich als Vermieter und klicken Sie auf "Fläche inserieren". Fügen Sie aussagekräftige Fotos, eine detaillierte Beschreibung, die Ausstattung und Ihren Preis hinzu. Nach einer kurzen Prüfung wird Ihr Inserat freigeschaltet.',
      },
      {
        q: 'Welche Flächen kann ich vermieten?',
        a: 'Sie können alle Arten von Gewerbeflächen anbieten: Büros, Lager, Pop-up Stores, Event-Locations, Fotostudios, Werkstätten und mehr. Die Fläche muss für eine gewerbliche Nutzung geeignet und versichert sein.',
      },
      {
        q: 'Wie lege ich den Preis fest?',
        a: 'Sie können einen Tagespreis sowie optionale Wochen- und Monatsrabatte festlegen. Unsere Preisempfehlung basiert auf vergleichbaren Flächen in Ihrer Region und hilft Ihnen bei der Preisfindung.',
      },
      {
        q: 'Wann erhalte ich die Mietzahlung?',
        a: 'Die Mietzahlung wird 24 Stunden nach Check-in des Mieters auf Ihr hinterlegtes Bankkonto überwiesen. Bei längeren Mietzeiten erfolgen monatliche Auszahlungen.',
      },
    ],
  },
  {
    id: 'sicherheit',
    icon: Shield,
    title: 'Sicherheit & Vertrauen',
    questions: [
      {
        q: 'Wie sicher sind meine Daten?',
        a: 'Wir verwenden modernste Verschlüsselungstechnologien und speichern Ihre Daten auf sicheren Servern in Deutschland. Ihre Zahlungsdaten werden nicht auf unseren Servern gespeichert, sondern von unserem Zahlungsdienstleister verarbeitet.',
      },
      {
        q: 'Wie werden Nutzer verifiziert?',
        a: 'Alle Nutzer müssen ihre E-Mail-Adresse bestätigen. Vermieter durchlaufen zusätzlich eine Identitätsprüfung. Verifizierte Nutzer erhalten ein entsprechendes Badge in ihrem Profil.',
      },
      {
        q: 'Was tun bei Problemen während der Miete?',
        a: 'Kontaktieren Sie zunächst den Vermieter über unsere Plattform. Bei ungelösten Problemen steht unser Support-Team 7 Tage die Woche zur Verfügung und vermittelt bei Streitigkeiten.',
      },
      {
        q: 'Bin ich während der Miete versichert?',
        a: 'Vermieter sind verpflichtet, eine gültige Gebäudeversicherung nachzuweisen. Wir empfehlen Mietern zusätzlich eine Haftpflichtversicherung für die Mietdauer abzuschließen.',
      },
    ],
  },
];

export default function FAQ() {
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
                  Häufig gestellte Fragen
                </h1>
                <p className="text-lg text-muted-foreground">
                  Finden Sie Antworten auf die häufigsten Fragen rund um Spacefinder
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 border-b border-border">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-2">
              {faqCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-primary/10 transition-colors text-sm font-medium"
                >
                  <category.icon className="w-4 h-4" />
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  id={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {category.title}
                    </h2>
                  </div>

                  <Card className="overflow-hidden">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.id}-${index}`}
                          className="border-b last:border-b-0"
                        >
                          <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                            <span className="text-left font-medium">{faq.q}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 text-muted-foreground">
                            {faq.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <Card className="p-8 md:p-12 text-center max-w-2xl mx-auto">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ihre Frage ist nicht dabei?
              </h2>
              <p className="text-muted-foreground mb-6">
                Unser Support-Team hilft Ihnen gerne weiter. Kontaktieren Sie uns
                und wir antworten innerhalb von 24 Stunden.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="accent" size="lg" asChild>
                  <Link to="/contact">
                    Kontakt aufnehmen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/help">Hilfe-Center</Link>
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
