import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Building2, Mail, Phone, Globe } from 'lucide-react';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-display-sm text-foreground mb-8">Impressum</h1>

          <Card className="p-8 space-y-8">
            {/* Angaben gemäß § 5 TMG */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Angaben gemäß § 5 TMG
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p className="font-semibold text-foreground">Spacefinder GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </div>
            </section>

            {/* Handelsregister */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Handelsregister
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
                <p>Registernummer: HRB 123456 B</p>
              </div>
            </section>

            {/* Vertreten durch */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Vertreten durch
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Geschäftsführer: Max Mustermann</p>
              </div>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Kontakt
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+49 (0) 30 123456789</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a href="mailto:info@spacefinder.de" className="hover:text-primary transition-colors">
                    info@spacefinder.de
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>www.spacefinder.de</span>
                </div>
              </div>
            </section>

            {/* Umsatzsteuer-ID */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Umsatzsteuer-ID
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                </p>
                <p className="font-mono">DE 123456789</p>
              </div>
            </section>

            {/* Berufsrechtliche Regelungen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Aufsichtsbehörde
              </h2>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  Zuständige Aufsichtsbehörde für die Vermittlung von Immobilien gemäß § 34c GewO:
                </p>
                <p>Bezirksamt Berlin-Mitte</p>
                <p>Ordnungsamt</p>
                <p>Müllerstraße 146</p>
                <p>13353 Berlin</p>
              </div>
            </section>

            {/* Streitschlichtung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Streitschlichtung
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p>
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
                <p>
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </section>

            {/* Haftung für Inhalte */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Haftung für Inhalte
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                  nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                  Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                  Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                  Tätigkeit hinweisen.
                </p>
                <p>
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                  allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
                  erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
                  Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
                  entfernen.
                </p>
              </div>
            </section>

            {/* Haftung für Links */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Haftung für Links
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
                  Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
                  mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                  Verlinkung nicht erkennbar.
                </p>
                <p>
                  Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                  Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
                  Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </div>
            </section>

            {/* Urheberrecht */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Urheberrecht
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
                  dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                  der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
                  Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
                  nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                </p>
                <p>
                  Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
                  Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
                  gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                  bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
                  werden wir derartige Inhalte umgehend entfernen.
                </p>
              </div>
            </section>

            {/* Bildnachweise */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Bildnachweise
              </h2>
              <div className="text-muted-foreground">
                <p>
                  Die auf dieser Website verwendeten Bilder stammen von den jeweiligen Vermietern oder
                  wurden unter entsprechender Lizenz erworben. Für nutzergenerierte Inhalte sind die
                  jeweiligen Nutzer verantwortlich.
                </p>
              </div>
            </section>
          </Card>

          {/* Last updated */}
          <p className="text-sm text-muted-foreground mt-8 text-center">
            Stand: Dezember 2024
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
