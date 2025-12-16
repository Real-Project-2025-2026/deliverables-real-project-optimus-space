import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  MapPin,
  Mail,
  User,
  Phone,
  Upload,
  Camera,
  Info,
  CheckCircle2,
  AlertCircle,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { vacancyReportService } from '@/lib/services';
import { VacancyReportSubmission, VacancyDuration } from '@/types';

export default function ReportVacancy() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<VacancyReportSubmission>({
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    tosAccepted: false,
    objectAddress: '',
    objectCity: '',
    objectZip: '',
    objectCountry: 'Deutschland',
    objectDescription: '',
    estimatedSizeSqm: undefined,
    vacancyDuration: undefined,
    ownerContactInfo: '',
  });

  const vacancyDurationOptions: { value: VacancyDuration; label: string }[] = [
    { value: 'weeks', label: 'Einige Wochen' },
    { value: 'months', label: 'Mehrere Monate' },
    { value: 'years', label: 'Jahre' },
    { value: 'unknown', label: 'Unbekannt' },
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.reporterName || !formData.reporterEmail) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie Ihren Namen und Ihre E-Mail-Adresse ein.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.objectAddress || !formData.objectCity || !formData.objectZip) {
      toast({
        title: 'Fehler',
        description: 'Bitte geben Sie die vollständige Adresse der Immobilie ein.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.tosAccepted) {
      toast({
        title: 'Fehler',
        description: 'Bitte akzeptieren Sie die Nutzungsbedingungen.',
        variant: 'destructive',
      });
      return;
    }

    if (!photoFile) {
      toast({
        title: 'Fehler',
        description: 'Bitte laden Sie ein Foto der Immobilie hoch.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload photo first
      let photoUrl: string | undefined;
      let photoStoragePath: string | undefined;

      if (photoFile) {
        const uploadResult = await vacancyReportService.uploadPhoto(photoFile);
        photoUrl = uploadResult.url;
        photoStoragePath = uploadResult.path;
      }

      // Submit report
      await vacancyReportService.submit(formData, photoUrl, photoStoragePath);

      setIsSubmitted(true);
      toast({
        title: 'Vielen Dank!',
        description: 'Ihre Leerstandsmeldung wurde erfolgreich eingereicht.',
      });
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Meldung erfolgreich!
          </h1>
          <p className="text-muted-foreground mb-8">
            Vielen Dank für Ihre Leerstandsmeldung. Unser Team wird die Informationen prüfen.
            Wenn die Fläche erfolgreich auf unserer Plattform gelistet wird, erhalten Sie eine
            Belohnung von <span className="font-semibold text-primary">20 EUR</span>.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">Zur Startseite</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/report-vacancy" onClick={() => setIsSubmitted(false)}>
                Weitere Meldung einreichen
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Info */}
      <div className="hidden lg:flex lg:w-2/5 gradient-primary relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">Spacefindr</span>
          </Link>

          <h1 className="text-display-sm mb-6">
            Leerstand melden & <span className="text-accent">20 EUR</span> verdienen!
          </h1>

          <p className="text-xl text-primary-foreground/80 mb-8 max-w-md">
            Kennen Sie eine leerstehende Gewerbefläche? Melden Sie uns diese und erhalten Sie
            eine Belohnung, wenn die Fläche auf unserer Plattform gelistet wird.
          </p>

          <div className="space-y-4">
            {[
              { icon: Camera, text: 'Foto der Immobilie hochladen' },
              { icon: MapPin, text: 'Adresse und Details angeben' },
              { icon: Gift, text: '20 EUR Belohnung bei Erfolg erhalten' },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-primary-foreground/90">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-4 bg-primary-foreground/10 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-primary-foreground/80">
                Ihre Daten werden vertraulich behandelt. Sie erhalten die Belohnung per E-Mail,
                sobald die gemeldete Fläche verifiziert und auf unserer Plattform gelistet wurde.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-start justify-center p-6 py-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          {/* Mobile header */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2 justify-center mb-6">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Spacefindr</span>
            </Link>
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Gift className="w-3 h-3 mr-1" />
                20 EUR Belohnung
              </Badge>
              <h1 className="text-2xl font-bold text-foreground mb-2">Leerstand melden</h1>
              <p className="text-muted-foreground text-sm">
                Melden Sie leerstehende Gewerbeflächen und verdienen Sie Geld
              </p>
            </div>
          </div>

          <Card className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload Section */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Foto der Immobilie *
                </h3>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    photoPreview ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  {photoPreview ? (
                    <div className="space-y-3">
                      <img
                        src={photoPreview}
                        alt="Vorschau"
                        className="max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                        }}
                      >
                        Anderes Foto wählen
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Klicken Sie hier oder ziehen Sie ein Foto hierher
                      </p>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG oder WebP, max. 10 MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Adresse der Immobilie *
                </h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Straße und Hausnummer"
                    value={formData.objectAddress}
                    onChange={(e) => setFormData({ ...formData, objectAddress: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      placeholder="PLZ"
                      value={formData.objectZip}
                      onChange={(e) => setFormData({ ...formData, objectZip: e.target.value })}
                      required
                    />
                    <Input
                      className="col-span-2"
                      placeholder="Stadt"
                      value={formData.objectCity}
                      onChange={(e) => setFormData({ ...formData, objectCity: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Weitere Informationen (optional)
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Geschätzte Größe
                      </label>
                      <Input
                        type="number"
                        placeholder="m²"
                        value={formData.estimatedSizeSqm || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            estimatedSizeSqm: e.target.value ? parseInt(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Leerstand seit
                      </label>
                      <Select
                        value={formData.vacancyDuration}
                        onValueChange={(value: VacancyDuration) =>
                          setFormData({ ...formData, vacancyDuration: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                        <SelectContent>
                          {vacancyDurationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Beschreibung der Immobilie (Zustand, ehemalige Nutzung, etc.)"
                    value={formData.objectDescription || ''}
                    onChange={(e) => setFormData({ ...formData, objectDescription: e.target.value })}
                    rows={2}
                  />
                  <Textarea
                    placeholder="Infos zum Eigentümer/Kontakt (falls bekannt)"
                    value={formData.ownerContactInfo || ''}
                    onChange={(e) => setFormData({ ...formData, ownerContactInfo: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Reporter Info Section */}
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Ihre Kontaktdaten *
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Ihr Name"
                      className="pl-10"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Ihre E-Mail-Adresse"
                      className="pl-10"
                      value={formData.reporterEmail}
                      onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Telefonnummer (optional)"
                      className="pl-10"
                      value={formData.reporterPhone || ''}
                      onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Terms Section */}
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="tos"
                    checked={formData.tosAccepted}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, tosAccepted: checked === true })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="tos" className="text-sm text-muted-foreground cursor-pointer">
                    Ich akzeptiere die{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Nutzungsbedingungen
                    </Link>{' '}
                    und{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Datenschutzerklärung
                    </Link>
                    . Ich bestätige, dass die gemeldete Adresse nach meinem Wissen leersteht und
                    nicht bereits auf der Plattform gelistet ist.
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="accent"
                className="w-full"
                size="lg"
                disabled={isLoading || !formData.tosAccepted}
              >
                {isLoading ? (
                  <span className="animate-pulse">Wird gesendet...</span>
                ) : (
                  <>
                    Leerstand melden
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              {/* Info Note */}
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  Jede Adresse kann nur einmal gemeldet werden. Bei doppelten Meldungen wird nur
                  die erste Meldung berücksichtigt.
                </p>
              </div>
            </form>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="text-primary font-medium hover:underline">
              Zurück zur Startseite
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
