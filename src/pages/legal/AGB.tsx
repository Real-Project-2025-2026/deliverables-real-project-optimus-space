import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';

export default function AGB() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-display-sm text-foreground mb-8">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          {/* Demo Notice */}
          <Card className="p-6 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 dark:text-amber-400 text-lg">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  Demo-Anwendung
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Dies ist eine nicht-kommerzielle Demo-Anwendung, entwickelt im Rahmen des Kurses
                  <strong> Real Project Digitalization</strong> an der <strong>Hochschule München (HM)</strong>.
                  Team: <strong>OptimusSpace</strong>.
                  Es handelt sich nicht um ein echtes Geschäftsangebot.
                  Diese AGB dienen nur zu Demonstrationszwecken und haben keine rechtliche Bindung.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-8">
            {/* Geltungsbereich */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 1 Geltungsbereich und Anbieter
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für die Nutzung
                  der Online-Plattform „Spacefindr" (nachfolgend „Plattform"), betrieben von:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-semibold text-foreground">Spacefindr GmbH</p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p>E-Mail: info@spacefindr.de</p>
                </div>
                <p>
                  (2) Die Plattform ermöglicht die Vermittlung von kurzfristigen Mietverhältnissen für
                  Gewerbeflächen zwischen Vermietern und Mietern.
                </p>
                <p>
                  (3) Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, der
                  Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
                </p>
              </div>
            </section>

            {/* Definitionen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 2 Definitionen
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Im Sinne dieser AGB gelten folgende Definitionen:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>„Vermieter":</strong> Natürliche oder juristische Person, die Gewerbeflächen
                    zur kurzfristigen Vermietung auf der Plattform anbietet.
                  </li>
                  <li>
                    <strong>„Mieter":</strong> Natürliche oder juristische Person, die Gewerbeflächen
                    über die Plattform mietet.
                  </li>
                  <li>
                    <strong>„Nutzer":</strong> Sammelbegriff für Vermieter und Mieter.
                  </li>
                  <li>
                    <strong>„Buchung":</strong> Verbindliche Reservierung einer Gewerbefläche für einen
                    bestimmten Zeitraum.
                  </li>
                  <li>
                    <strong>„Zwischenmietvertrag":</strong> Der zwischen Vermieter und Mieter geschlossene
                    Mietvertrag über die temporäre Nutzung einer Gewerbefläche.
                  </li>
                </ul>
              </div>
            </section>

            {/* Registrierung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 3 Registrierung und Nutzerkonto
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Die Nutzung der Plattform als Vermieter oder Mieter erfordert eine Registrierung.
                  Die Registrierung ist kostenlos.
                </p>
                <p>
                  (2) Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße und vollständige
                  Angaben zu machen und diese aktuell zu halten.
                </p>
                <p>
                  (3) Der Nutzer ist für die Geheimhaltung seiner Zugangsdaten verantwortlich und haftet
                  für alle Aktivitäten, die unter seinem Konto erfolgen.
                </p>
                <p>
                  (4) Der Anbieter behält sich vor, Nutzerkonten bei Verstoß gegen diese AGB zu sperren
                  oder zu löschen.
                </p>
              </div>
            </section>

            {/* Vermittlungsleistung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 4 Vermittlungsleistung
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Der Anbieter stellt ausschließlich eine technische Plattform zur Vermittlung von
                  Mietverhältnissen bereit. Der Anbieter wird nicht selbst Vertragspartei der zwischen
                  Vermietern und Mietern geschlossenen Mietverträge.
                </p>
                <p>
                  (2) Der Anbieter übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder
                  Aktualität der von Nutzern eingestellten Inhalte und Angaben zu Mietobjekten.
                </p>
                <p>
                  (3) Der Anbieter ist nicht verantwortlich für die Erfüllung der zwischen Vermietern und
                  Mietern geschlossenen Verträge.
                </p>
              </div>
            </section>

            {/* Pflichten Vermieter */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 5 Pflichten des Vermieters
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>(1) Der Vermieter verpflichtet sich:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Nur Flächen anzubieten, zu deren Vermietung er berechtigt ist;
                  </li>
                  <li>
                    Wahrheitsgemäße und vollständige Angaben zu den angebotenen Flächen zu machen;
                  </li>
                  <li>
                    Die Verfügbarkeit der Flächen aktuell zu halten;
                  </li>
                  <li>
                    Buchungsanfragen zeitnah zu bearbeiten;
                  </li>
                  <li>
                    Die gemietete Fläche in dem beschriebenen Zustand zur Verfügung zu stellen;
                  </li>
                  <li>
                    Alle geltenden gesetzlichen Vorschriften einzuhalten, insbesondere baurechtliche,
                    gewerberechtliche und brandschutzrechtliche Bestimmungen.
                  </li>
                </ul>
                <p>
                  (2) Der Vermieter garantiert, dass er über alle erforderlichen Genehmigungen für die
                  Vermietung verfügt und etwaige Zustimmungen (z.B. des Hauptvermieters bei
                  Untervermietung) eingeholt hat.
                </p>
              </div>
            </section>

            {/* Pflichten Mieter */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 6 Pflichten des Mieters
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>(1) Der Mieter verpflichtet sich:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Die gemietete Fläche nur für den vereinbarten Zweck zu nutzen;
                  </li>
                  <li>
                    Die Fläche pfleglich zu behandeln und in dem Zustand zurückzugeben, in dem sie
                    übernommen wurde (übliche Abnutzung ausgenommen);
                  </li>
                  <li>
                    Alle vereinbarten Zahlungen fristgerecht zu leisten;
                  </li>
                  <li>
                    Die Fläche pünktlich zum Ende der Mietzeit zu räumen;
                  </li>
                  <li>
                    Eine etwaig erforderliche Haftpflichtversicherung abzuschließen;
                  </li>
                  <li>
                    Alle für seine Nutzung erforderlichen Genehmigungen einzuholen.
                  </li>
                </ul>
              </div>
            </section>

            {/* Buchung und Vertragsschluss */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 7 Buchung und Vertragsschluss
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Die Darstellung von Flächen auf der Plattform stellt kein verbindliches Angebot
                  dar, sondern eine Aufforderung zur Abgabe eines Angebots (invitatio ad offerendum).
                </p>
                <p>
                  (2) Durch das Absenden einer Buchungsanfrage gibt der Mieter ein verbindliches Angebot
                  zum Abschluss eines Mietvertrages ab.
                </p>
                <p>
                  (3) Der Mietvertrag kommt erst durch die Bestätigung der Buchung durch den Vermieter
                  zustande.
                </p>
                <p>
                  (4) Bei Flächen mit aktivierter Sofortbuchung kommt der Vertrag bereits mit der
                  Buchungsbestätigung durch das System zustande.
                </p>
                <p>
                  (5) Nach Vertragsschluss wird automatisch ein Zwischenmietvertrag generiert, der die
                  wesentlichen Vertragsbedingungen enthält.
                </p>
              </div>
            </section>

            {/* Preise und Zahlung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 8 Preise und Zahlung
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Alle auf der Plattform angegebenen Preise verstehen sich in Euro und inklusive der
                  gesetzlichen Umsatzsteuer, soweit nicht anders angegeben.
                </p>
                <p>
                  (2) Der Gesamtpreis einer Buchung setzt sich zusammen aus:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Mietpreis für den gebuchten Zeitraum</li>
                  <li>Ggf. Nebenkosten</li>
                  <li>Ggf. Kaution (wird nach ordnungsgemäßer Rückgabe erstattet)</li>
                  <li>Ggf. Servicegebühren des Plattformbetreibers</li>
                </ul>
                <p>
                  (3) Die Zahlung erfolgt über die auf der Plattform angebotenen Zahlungsmethoden.
                </p>
                <p>
                  (4) Die Kaution wird treuhänderisch verwaltet und nach ordnungsgemäßer Beendigung des
                  Mietverhältnisses und Freigabe durch den Vermieter an den Mieter zurückgezahlt.
                </p>
              </div>
            </section>

            {/* Stornierung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 9 Stornierung und Rücktritt
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Die Stornierungsbedingungen richten sich nach der vom Vermieter gewählten
                  Stornierungsrichtlinie:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">Flexibel:</p>
                    <p>Kostenlose Stornierung bis 24 Stunden vor Mietbeginn.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Moderat:</p>
                    <p>Kostenlose Stornierung bis 5 Tage vor Mietbeginn. Danach 50% des Mietpreises.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Streng:</p>
                    <p>Kostenlose Stornierung bis 14 Tage vor Mietbeginn. Danach keine Erstattung.</p>
                  </div>
                </div>
                <p>
                  (2) Die Stornierung muss über die Plattform erfolgen.
                </p>
                <p>
                  (3) Bei Nichterscheinen des Mieters ohne vorherige Stornierung wird der volle
                  Mietpreis fällig.
                </p>
              </div>
            </section>

            {/* Check-in/Check-out */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 10 Check-in und Check-out
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Der Mieter ist verpflichtet, bei Übernahme der Fläche (Check-in) den Zustand
                  fotografisch zu dokumentieren und über die Plattform hochzuladen.
                </p>
                <p>
                  (2) Bei Rückgabe der Fläche (Check-out) ist der Zustand ebenfalls zu dokumentieren.
                </p>
                <p>
                  (3) Die Dokumentation dient als Nachweis für den Zustand der Fläche und ist Grundlage
                  für etwaige Schadensersatzansprüche.
                </p>
                <p>
                  (4) Bei verspäteter Rückgabe kann der Vermieter eine Vertragsstrafe in Höhe des
                  doppelten Tagesmietpreises pro angefangenem Tag der Verspätung verlangen.
                </p>
              </div>
            </section>

            {/* Haftung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 11 Haftung
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des
                  Körpers oder der Gesundheit, die auf einer vorsätzlichen oder fahrlässigen
                  Pflichtverletzung des Anbieters beruhen.
                </p>
                <p>
                  (2) Für sonstige Schäden haftet der Anbieter nur bei Vorsatz und grober Fahrlässigkeit
                  sowie bei der Verletzung wesentlicher Vertragspflichten. Die Haftung bei Verletzung
                  wesentlicher Vertragspflichten ist auf den vertragstypischen, vorhersehbaren Schaden
                  begrenzt.
                </p>
                <p>
                  (3) Der Anbieter haftet nicht für Schäden, die aus dem Vertragsverhältnis zwischen
                  Vermieter und Mieter entstehen.
                </p>
                <p>
                  (4) Für Schäden an der Mietsache haftet der Mieter nach den allgemeinen gesetzlichen
                  Bestimmungen.
                </p>
              </div>
            </section>

            {/* Leerstandsmeldungen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 12 Leerstandsmeldungen und Belohnung
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Nutzer können leerstehende Gewerbeflächen über die Plattform melden.
                </p>
                <p>
                  (2) Wird eine gemeldete Fläche nach Prüfung durch den Anbieter erfolgreich auf der
                  Plattform gelistet, erhält der Meldende eine Belohnung in Höhe von 20 EUR.
                </p>
                <p>
                  (3) Die Belohnung wird pro Objekt nur einmal ausgezahlt. Maßgeblich ist die erste
                  gültige Meldung.
                </p>
                <p>
                  (4) Ein Anspruch auf Belohnung besteht nicht, wenn:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Die Fläche bereits auf der Plattform gelistet ist;</li>
                  <li>Die Fläche bereits zuvor gemeldet wurde;</li>
                  <li>Die Angaben unvollständig oder falsch sind;</li>
                  <li>Der Meldende selbst Eigentümer oder Verfügungsberechtigter der Fläche ist.</li>
                </ul>
                <p>
                  (5) Die Auszahlung erfolgt nach erfolgreicher Listung per Überweisung auf ein vom
                  Meldenden angegebenes Konto.
                </p>
              </div>
            </section>

            {/* Geistiges Eigentum */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 13 Geistiges Eigentum
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Alle Inhalte der Plattform (Texte, Grafiken, Logos, Software) sind urheberrechtlich
                  geschützt und Eigentum des Anbieters oder der jeweiligen Rechteinhaber.
                </p>
                <p>
                  (2) Nutzer räumen dem Anbieter ein nicht-exklusives, übertragbares Recht zur Nutzung
                  der von ihnen eingestellten Inhalte (insbesondere Fotos und Beschreibungen) für
                  Zwecke der Plattform ein.
                </p>
              </div>
            </section>

            {/* Datenschutz */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 14 Datenschutz
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* Änderungen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 15 Änderung der AGB
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Der Anbieter behält sich vor, diese AGB jederzeit zu ändern.
                </p>
                <p>
                  (2) Änderungen werden den Nutzern per E-Mail oder bei der nächsten Anmeldung mitgeteilt.
                </p>
                <p>
                  (3) Widerspricht der Nutzer den geänderten AGB nicht innerhalb von 4 Wochen nach
                  Zugang der Mitteilung, gelten die geänderten AGB als akzeptiert.
                </p>
              </div>
            </section>

            {/* Schlussbestimmungen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                § 16 Schlussbestimmungen
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                </p>
                <p>
                  (2) Ist der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder
                  öffentlich-rechtliches Sondervermögen, ist Gerichtsstand für alle Streitigkeiten aus
                  diesem Vertragsverhältnis Berlin.
                </p>
                <p>
                  (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die
                  Wirksamkeit der übrigen Bestimmungen unberührt.
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
