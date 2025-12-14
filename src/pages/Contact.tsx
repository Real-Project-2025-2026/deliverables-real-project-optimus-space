import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Mail,
    title: 'E-Mail',
    value: 'support@spacefinder.de',
    description: 'Wir antworten innerhalb von 24 Stunden',
  },
  {
    icon: Phone,
    title: 'Telefon',
    value: '+49 30 123 456 78',
    description: 'Mo-Fr 9:00-18:00 Uhr',
  },
  {
    icon: MapPin,
    title: 'Adresse',
    value: 'Musterstraße 123, 10115 Berlin',
    description: 'Termine nach Vereinbarung',
  },
  {
    icon: Clock,
    title: 'Geschäftszeiten',
    value: 'Mo-Fr 9:00-18:00 Uhr',
    description: 'Online-Support rund um die Uhr',
  },
];

const topics = [
  'Allgemeine Anfrage',
  'Buchungsproblem',
  'Zahlungsfrage',
  'Technisches Problem',
  'Feedback',
  'Partnerschaft',
  'Presse',
  'Sonstiges',
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate form submission
    setIsSubmitted(true);
    toast({
      title: 'Nachricht gesendet!',
      description: 'Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
    });
  };

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
                <MessageSquare className="w-16 h-16 text-primary mx-auto mb-6" />
                <h1 className="text-display-sm md:text-display text-foreground mb-4">
                  Kontaktieren Sie uns
                </h1>
                <p className="text-lg text-muted-foreground">
                  Haben Sie Fragen oder Anregungen? Wir freuen uns auf Ihre Nachricht
                  und helfen Ihnen gerne weiter.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-primary font-medium mb-1">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Vielen Dank!
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns
                        innerhalb von 24 Stunden bei Ihnen.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>
                        Neue Nachricht senden
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-foreground mb-6">
                        Schreiben Sie uns
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              Name *
                            </label>
                            <Input
                              type="text"
                              placeholder="Max Mustermann"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                              E-Mail *
                            </label>
                            <Input
                              type="email"
                              placeholder="max@beispiel.de"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Thema *
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-input rounded-lg bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            value={formData.topic}
                            onChange={(e) =>
                              setFormData({ ...formData, topic: e.target.value })
                            }
                            required
                          >
                            <option value="">Bitte wählen...</option>
                            {topics.map((topic) => (
                              <option key={topic} value={topic}>
                                {topic}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            Nachricht *
                          </label>
                          <Textarea
                            placeholder="Wie können wir Ihnen helfen?"
                            rows={5}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            required
                          />
                        </div>

                        <Button type="submit" variant="accent" className="w-full" size="lg">
                          <Send className="w-4 h-4 mr-2" />
                          Nachricht senden
                        </Button>
                      </form>
                    </>
                  )}
                </Card>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Häufige Themen
                  </h2>
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Buchungsprobleme
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Probleme mit einer Buchung? Schauen Sie zunächst in unser{' '}
                        <Link to="/help" className="text-primary hover:underline">
                          Hilfe-Center
                        </Link>{' '}
                        oder kontaktieren Sie uns direkt.
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Zahlungsfragen
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Für Zahlungsanfragen wenden Sie sich bitte an unsere
                        Buchhaltung unter{' '}
                        <span className="text-primary">billing@spacefinder.de</span>
                      </p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        Partnerschaft & Presse
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Für Kooperationsanfragen kontaktieren Sie uns unter{' '}
                        <span className="text-primary">partner@spacefinder.de</span>
                      </p>
                    </Card>
                  </div>
                </div>

                <Card className="p-6 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-4">
                    <Building2 className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Spacefinder GmbH
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Musterstraße 123
                        <br />
                        10115 Berlin
                        <br />
                        Deutschland
                        <br />
                        <br />
                        Handelsregister: HRB 123456
                        <br />
                        USt-IdNr.: DE123456789
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
