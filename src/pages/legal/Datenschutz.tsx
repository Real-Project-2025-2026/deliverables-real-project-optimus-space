import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-display-sm text-foreground mb-8">Datenschutzerklärung</h1>

          <Card className="p-8 space-y-8">
            {/* Einleitung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                1. Datenschutz auf einen Blick
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="font-semibold text-foreground">Allgemeine Hinweise</h3>
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
                  Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem
                  Text aufgeführten Datenschutzerklärung.
                </p>
              </div>
            </section>

            {/* Verantwortlicher */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                2. Verantwortliche Stelle
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-semibold text-foreground">Spacefinder GmbH</p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p className="mt-2">
                    E-Mail:{' '}
                    <a href="mailto:datenschutz@spacefinder.de" className="text-primary hover:underline">
                      datenschutz@spacefinder.de
                    </a>
                  </p>
                  <p>Telefon: +49 (0) 30 123456789</p>
                </div>
                <p>
                  Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder
                  gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen
                  Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                </p>
              </div>
            </section>

            {/* Datenschutzbeauftragter */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                3. Datenschutzbeauftragter
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Wir haben einen Datenschutzbeauftragten benannt:</p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-semibold text-foreground">Datenschutzbeauftragter</p>
                  <p>Spacefinder GmbH</p>
                  <p>Musterstraße 123</p>
                  <p>10115 Berlin</p>
                  <p className="mt-2">
                    E-Mail:{' '}
                    <a href="mailto:dsb@spacefinder.de" className="text-primary hover:underline">
                      dsb@spacefinder.de
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Datenerfassung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                4. Datenerfassung auf dieser Website
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Server-Log-Dateien</h3>
                  <p>
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in so
                    genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies
                    sind:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Browsertyp und Browserversion</li>
                    <li>Verwendetes Betriebssystem</li>
                    <li>Referrer URL</li>
                    <li>Hostname des zugreifenden Rechners</li>
                    <li>Uhrzeit der Serveranfrage</li>
                    <li>IP-Adresse</li>
                  </ul>
                  <p className="mt-2">
                    Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.
                    Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Cookies</h3>
                  <p>
                    Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine
                    Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder
                    vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft
                    (permanente Cookies) auf Ihrem Endgerät gespeichert.
                  </p>
                  <p className="mt-2">
                    Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies
                    informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies
                    für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der
                    Cookies beim Schließen des Browsers aktivieren.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Kontaktformular</h3>
                  <p>
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus
                    dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks
                    Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                    Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                </div>
              </div>
            </section>

            {/* Registrierung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                5. Registrierung und Nutzerkonto
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen auf der
                  Seite zu nutzen. Die dazu eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung
                  des jeweiligen Angebotes oder Dienstes, für den Sie sich registriert haben.
                </p>
                <p>Bei der Registrierung erfassen wir folgende Daten:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>E-Mail-Adresse</li>
                  <li>Name</li>
                  <li>Passwort (verschlüsselt gespeichert)</li>
                  <li>Bei Vermietern: Adressdaten und Kontaktinformationen</li>
                </ul>
                <p>
                  Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
                  sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
                </p>
              </div>
            </section>

            {/* Buchungen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                6. Buchungen und Vertragsabwicklung
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Wir verarbeiten personenbezogene Daten, die zur Begründung, inhaltlichen Ausgestaltung
                  oder Änderung von Vertragsverhältnissen erforderlich sind (Bestandsdaten). Dies umfasst:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Kontaktdaten (Name, Adresse, E-Mail, Telefon)</li>
                  <li>Buchungsdaten (Zeitraum, gebuchte Fläche)</li>
                  <li>Zahlungsdaten</li>
                  <li>Kommunikation zwischen Mieter und Vermieter</li>
                </ul>
                <p>
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden nach Ablauf der
                  gesetzlichen Aufbewahrungsfristen gelöscht.
                </p>
              </div>
            </section>

            {/* Leerstandsmeldungen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                7. Leerstandsmeldungen
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Bei der Meldung eines Leerstands erfassen wir folgende Daten:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ihr Name und Ihre E-Mail-Adresse (für die Belohnungsauszahlung)</li>
                  <li>Optional: Telefonnummer</li>
                  <li>Adresse und Beschreibung des gemeldeten Objekts</li>
                  <li>Hochgeladene Fotos</li>
                </ul>
                <p>
                  Diese Daten werden zur Prüfung der Meldung und ggf. Auszahlung der Belohnung verwendet.
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1
                  lit. a DSGVO (Ihre Einwilligung).
                </p>
              </div>
            </section>

            {/* Fotos */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                8. Fotos und Bilder
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Nutzer können Fotos von Flächen, Check-in/Check-out-Dokumentationen und
                  Leerstandsmeldungen hochladen. Diese Bilder werden auf unseren Servern gespeichert und
                  sind je nach Kontext für andere Nutzer sichtbar (z.B. Flächenfotos für alle Besucher,
                  Check-in-Fotos nur für Vertragspartner).
                </p>
                <p>
                  Mit dem Upload bestätigen Sie, dass Sie die erforderlichen Rechte an den Bildern
                  besitzen und keine Persönlichkeitsrechte Dritter verletzen.
                </p>
              </div>
            </section>

            {/* Zahlungsabwicklung */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                9. Zahlungsabwicklung
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Die Zahlungsabwicklung erfolgt über externe Zahlungsdienstleister. Dabei werden Ihre
                  Zahlungsdaten direkt an den jeweiligen Anbieter übermittelt. Wir speichern keine
                  vollständigen Zahlungsdaten wie Kreditkartennummern auf unseren Servern.
                </p>
                <p>
                  Rechtsgrundlage für die Weitergabe ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
                </p>
              </div>
            </section>

            {/* Ihre Rechte */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                10. Ihre Rechte
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Sie haben folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre von uns
                    verarbeiteten personenbezogenen Daten verlangen.
                  </li>
                  <li>
                    <strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung
                    unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten Daten verlangen.
                  </li>
                  <li>
                    <strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer bei uns
                    gespeicherten Daten verlangen, soweit nicht die Verarbeitung zur Ausübung des Rechts
                    auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen
                    Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung,
                    Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.
                  </li>
                  <li>
                    <strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die
                    Einschränkung der Verarbeitung Ihrer Daten verlangen.
                  </li>
                  <li>
                    <strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können verlangen, dass wir
                    Ihnen Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format
                    übermitteln.
                  </li>
                  <li>
                    <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können jederzeit gegen die
                    Verarbeitung Ihrer Daten Widerspruch einlegen.
                  </li>
                  <li>
                    <strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Sie können eine
                    einmal erteilte Einwilligung jederzeit widerrufen.
                  </li>
                  <li>
                    <strong>Beschwerderecht (Art. 77 DSGVO):</strong> Sie haben das Recht, sich bei einer
                    Aufsichtsbehörde zu beschweren.
                  </li>
                </ul>
              </div>
            </section>

            {/* Datensicherheit */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                11. Datensicherheit
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
                  Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
                  daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an
                  dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
                <p>
                  Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten
                  gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff
                  unberechtigter Personen zu schützen.
                </p>
              </div>
            </section>

            {/* Speicherdauer */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                12. Speicherdauer
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Personenbezogene Daten werden nur so lange gespeichert, wie es für die Zwecke, für die
                  sie verarbeitet werden, erforderlich ist oder gesetzliche Aufbewahrungspflichten
                  bestehen.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vertragsdaten: 10 Jahre (handels- und steuerrechtliche Aufbewahrungspflichten)</li>
                  <li>Nutzerkonto-Daten: Bis zur Löschung des Kontos</li>
                  <li>Leerstandsmeldungen: 3 Jahre nach Abschluss der Bearbeitung</li>
                  <li>Server-Logs: 7 Tage</li>
                </ul>
              </div>
            </section>

            {/* Änderungen */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                13. Änderungen dieser Datenschutzerklärung
              </h2>
              <div className="text-muted-foreground">
                <p>
                  Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
                  aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen
                  in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue
                  Datenschutzerklärung.
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
