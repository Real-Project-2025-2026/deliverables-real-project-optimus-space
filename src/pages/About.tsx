import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, Lightbulb, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: 'Antonio Amirkhosrovi',
    faculty: 'FK10',
    field: 'Wirtschaft',
  },
  {
    name: 'Jara Bremicker',
    faculty: 'FK10',
    field: 'Wirtschaft',
  },
  {
    name: 'Luca Ernemann',
    faculty: 'FK07 & FK10',
    field: 'Mathematik & Wirtschaft',
  },
  {
    name: 'Valeriia Derkach',
    faculty: 'FK14',
    field: 'Tourismus',
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <GraduationCap className="w-3 h-3 mr-1" />
              Hochschulprojekt
            </Badge>
            <h1 className="text-display-sm text-foreground mb-4">
              Über Spacefindr
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Eine Demo-Anwendung aus dem Kurs Real Project Digitalization
              an der Hochschule München (HM).
            </p>
          </motion.div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Das Projekt
                  </h2>
                  <p className="text-muted-foreground">
                    Spacefindr ist eine Demo-Anwendung, die im Rahmen des Kurses
                    <strong> Real Project Digitalization</strong> an der
                    <strong> Hochschule München (HM)</strong> entwickelt wurde.
                    Die Plattform demonstriert, wie eine moderne Web-Anwendung
                    zur Vermittlung von Gewerbeflächen aussehen könnte.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Die Idee
                  </h2>
                  <p className="text-muted-foreground">
                    Die Plattform soll Vermietern und Mietern ermöglichen,
                    Gewerbeflächen flexibel und tageweise zu mieten.
                    Von Pop-up Stores über temporäre Büros bis hin zu
                    Event-Locations – alles soll einfach und unkompliziert
                    buchbar sein.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Wer sind wir?
                  </h2>
                  <p className="text-muted-foreground">
                    Team OptimusSpace
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 rounded-lg bg-muted/50 border border-border"
                  >
                    <p className="font-semibold text-foreground mb-1">
                      {member.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {member.faculty}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {member.field}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Hochschule München (HM) · Wintersemester 2024/25
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="p-6 bg-muted/30 border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Hinweis:</strong> Dies ist eine nicht-kommerzielle Demo-Anwendung
                zu Lernzwecken. Es handelt sich nicht um ein echtes Geschäftsangebot.
                Alle dargestellten Inhalte und Funktionen dienen ausschließlich
                der Demonstration.
              </p>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
