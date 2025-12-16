import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Save, X, Upload, Trash2, Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { spaceService } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SpaceCategory, Amenity, UsageType, CancellationPolicy, SpaceFormInput } from '@/types';
import { categoryLabels, amenityLabels } from '@/data/mockData';

const usageTypeLabels: Record<UsageType, string> = {
  popup_store: 'Pop-up Store',
  office: 'Büro',
  warehouse: 'Lager',
  event: 'Event',
  photo_studio: 'Fotostudio',
  workshop: 'Workshop',
  showroom: 'Showroom',
  other: 'Sonstiges',
};

const cancellationLabels: Record<CancellationPolicy, string> = {
  flexible: 'Flexibel (24h vorher kostenlos)',
  moderate: 'Moderat (5 Tage vorher kostenlos)',
  strict: 'Streng (14 Tage vorher kostenlos)',
};

export default function CreateSpace() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState<Partial<SpaceFormInput>>({
    title: '',
    description: '',
    address: '',
    city: '',
    postalCode: '',
    pricePerDay: 0,
    size: 0,
    category: 'office' as SpaceCategory,
    amenities: [],
    allowedUsageTypes: [],
    minRentalDays: 1,
    maxRentalDays: 365,
    depositRequired: true,
    depositAmount: 0,
    cancellationPolicy: 'flexible' as CancellationPolicy,
    instantBooking: false,
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Sie müssen angemeldet sein');

      // Create the space
      const newSpace = await spaceService.create(
        formData as SpaceFormInput,
        user.id,
        user.name || user.email
      );

      // Upload images if any
      if (newImages.length > 0) {
        setIsUploading(true);
        const uploadedUrls: string[] = [];

        for (const file of newImages) {
          try {
            const url = await spaceService.uploadImage(newSpace.id, file);
            uploadedUrls.push(url);
          } catch (err) {
            console.error('Image upload failed:', err);
            toast({
              title: 'Upload-Fehler',
              description: 'Ein Bild konnte nicht hochgeladen werden.',
              variant: 'destructive',
            });
          }
        }

        // Update images array
        if (uploadedUrls.length > 0) {
          await spaceService.updateImages(newSpace.id, uploadedUrls);
        }
        setIsUploading(false);
      }

      return newSpace;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spaces'] });
      toast({
        title: 'Fläche erstellt',
        description: 'Ihre neue Fläche wurde erfolgreich erstellt.',
      });
      navigate('/dashboard/landlord');
    },
    onError: (error: Error) => {
      toast({
        title: 'Fehler',
        description: error.message || 'Die Fläche konnte nicht erstellt werden.',
        variant: 'destructive',
      });
    },
  });

  // Handle form field changes
  const handleChange = (field: keyof SpaceFormInput, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity: Amenity) => {
    const current = formData.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    handleChange('amenities', updated);
  };

  // Handle usage type toggle
  const handleUsageTypeToggle = (usageType: UsageType) => {
    const current = formData.allowedUsageTypes || [];
    const updated = current.includes(usageType)
      ? current.filter(u => u !== usageType)
      : [...current, usageType];
    handleChange('allowedUsageTypes', updated);
  };

  // Maximum images allowed per space
  const MAX_IMAGES = 10;
  const canAddMoreImages = newImages.length < MAX_IMAGES;

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    const availableSlots = MAX_IMAGES - newImages.length;

    if (availableSlots <= 0) {
      toast({
        title: 'Limit erreicht',
        description: `Sie können maximal ${MAX_IMAGES} Bilder pro Fläche hochladen.`,
        variant: 'destructive',
      });
      return;
    }

    // Limit files to available slots
    const filesToProcess = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      toast({
        title: 'Hinweis',
        description: `Es wurden nur ${availableSlots} von ${files.length} Bildern hinzugefugt (Limit: ${MAX_IMAGES}).`,
      });
    }

    // Validate files
    const validFiles = filesToProcess.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Ungultiger Dateityp',
          description: `${file.name} ist kein Bild.`,
          variant: 'destructive',
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Datei zu gross',
          description: `${file.name} ist grosser als 10 MB.`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setNewImages(prev => [...prev, ...validFiles]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove new image
  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle save
  const handleSave = () => {
    if (!formData.title?.trim()) {
      toast({
        title: 'Titel erforderlich',
        description: 'Bitte geben Sie einen Titel für die Fläche ein.',
        variant: 'destructive',
      });
      return;
    }
    if (!formData.city?.trim()) {
      toast({
        title: 'Stadt erforderlich',
        description: 'Bitte geben Sie eine Stadt ein.',
        variant: 'destructive',
      });
      return;
    }
    if (!formData.pricePerDay || formData.pricePerDay <= 0) {
      toast({
        title: 'Preis erforderlich',
        description: 'Bitte geben Sie einen gultigen Tagespreis ein.',
        variant: 'destructive',
      });
      return;
    }
    createMutation.mutate();
  };

  // Redirect if not logged in as landlord
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container max-w-4xl">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Anmeldung erforderlich
              </h2>
              <p className="text-muted-foreground mb-4">
                Bitte melden Sie sich als Vermieter an, um eine Fläche zu erstellen.
              </p>
              <Button asChild>
                <Link to="/auth?mode=register&role=landlord">Als Vermieter registrieren</Link>
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard/landlord">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zuruck
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-display-sm text-foreground mb-2">
                  Neue Fläche erstellen
                </h1>
                <p className="text-muted-foreground">
                  Erstellen Sie ein neues Inserat für Ihre Gewerbefläche.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard/landlord')}
                  disabled={createMutation.isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Abbrechen
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Erstellen
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Images Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Bilder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {/* New images */}
                  {newImagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`Bild ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2" variant="secondary">
                          Hauptbild
                        </Badge>
                      )}
                    </div>
                  ))}

                  {/* Upload button */}
                  {canAddMoreImages && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Bild hinzufugen
                      </span>
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <p className="text-xs text-muted-foreground">
                  JPG, PNG oder WebP. Max. 10 MB pro Bild. Max. {MAX_IMAGES} Bilder pro Fläche ({newImages.length}/{MAX_IMAGES} verwendet). Das erste Bild wird als Hauptbild verwendet.
                </p>

                {isUploading && (
                  <div className="mt-4 flex items-center gap-2 text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Bilder werden hochgeladen...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Grundinformationen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Titel *
                  </label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="z.B. Modernes Loft im Herzen von München"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Beschreibung
                  </label>
                  <Textarea
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Beschreiben Sie Ihre Fläche..."
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Kategorie
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange('category', value as SpaceCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategorie wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Größe (m²) *
                    </label>
                    <Input
                      type="number"
                      value={formData.size || ''}
                      onChange={(e) => handleChange('size', Number(e.target.value))}
                      min={1}
                      placeholder="z.B. 100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Adresse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Straße und Hausnummer
                  </label>
                  <Input
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="z.B. Musterstrasse 123"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      PLZ
                    </label>
                    <Input
                      value={formData.postalCode || ''}
                      onChange={(e) => handleChange('postalCode', e.target.value)}
                      placeholder="z.B. 80331"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Stadt *
                    </label>
                    <Input
                      value={formData.city || ''}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="z.B. München"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Preise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preis pro Tag (EUR) *
                    </label>
                    <Input
                      type="number"
                      value={formData.pricePerDay || ''}
                      onChange={(e) => handleChange('pricePerDay', Number(e.target.value))}
                      min={0}
                      placeholder="z.B. 150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preis pro Woche (EUR)
                    </label>
                    <Input
                      type="number"
                      value={formData.pricePerWeek || ''}
                      onChange={(e) => handleChange('pricePerWeek', Number(e.target.value) || undefined)}
                      min={0}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preis pro Monat (EUR)
                    </label>
                    <Input
                      type="number"
                      value={formData.pricePerMonth || ''}
                      onChange={(e) => handleChange('pricePerMonth', Number(e.target.value) || undefined)}
                      min={0}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="depositRequired"
                      checked={formData.depositRequired}
                      onCheckedChange={(checked) => handleChange('depositRequired', checked)}
                    />
                    <label htmlFor="depositRequired" className="text-sm font-medium">
                      Kaution erforderlich
                    </label>
                  </div>
                  {formData.depositRequired && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Kautionsbetrag (EUR)
                      </label>
                      <Input
                        type="number"
                        value={formData.depositAmount || ''}
                        onChange={(e) => handleChange('depositAmount', Number(e.target.value))}
                        min={0}
                        placeholder="z.B. 300"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ausstattung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(amenityLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`amenity-${key}`}
                        checked={formData.amenities?.includes(key as Amenity)}
                        onCheckedChange={() => handleAmenityToggle(key as Amenity)}
                      />
                      <label htmlFor={`amenity-${key}`} className="text-sm">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Erlaubte Nutzungsarten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(usageTypeLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`usage-${key}`}
                        checked={formData.allowedUsageTypes?.includes(key as UsageType)}
                        onCheckedChange={() => handleUsageTypeToggle(key as UsageType)}
                      />
                      <label htmlFor={`usage-${key}`} className="text-sm">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Booking Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Buchungseinstellungen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Min. Mietdauer (Tage)
                    </label>
                    <Input
                      type="number"
                      value={formData.minRentalDays || 1}
                      onChange={(e) => handleChange('minRentalDays', Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max. Mietdauer (Tage)
                    </label>
                    <Input
                      type="number"
                      value={formData.maxRentalDays || 365}
                      onChange={(e) => handleChange('maxRentalDays', Number(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Stornierungsbedingungen
                  </label>
                  <Select
                    value={formData.cancellationPolicy}
                    onValueChange={(value) => handleChange('cancellationPolicy', value as CancellationPolicy)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cancellationLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="instantBooking"
                    checked={formData.instantBooking}
                    onCheckedChange={(checked) => handleChange('instantBooking', checked)}
                  />
                  <label htmlFor="instantBooking" className="text-sm font-medium">
                    Sofortbuchung aktivieren (keine Bestatigung erforderlich)
                  </label>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button (bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-2 justify-end"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/landlord')}
              disabled={createMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Abbrechen
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Fläche erstellen
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
