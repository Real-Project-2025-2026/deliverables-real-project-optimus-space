import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthMode = 'login' | 'register';
type UserRole = 'tenant' | 'landlord';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') === 'landlord' ? 'landlord' : 'tenant';
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'register') {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Fehler',
            description: 'Die Passwörter stimmen nicht überein',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 6) {
          toast({
            title: 'Fehler',
            description: 'Das Passwort muss mindestens 6 Zeichen lang sein',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        // Register with Supabase
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: role,
            },
          },
        });

        if (error) throw error;

        toast({
          title: 'Erfolgreich registriert!',
          description: 'Bitte überprüfen Sie Ihre E-Mails zur Bestätigung.',
        });

        // Redirect based on role
        if (role === 'landlord') {
          navigate('/dashboard/landlord');
        } else {
          navigate('/dashboard/tenant');
        }
      } else {
        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: 'Willkommen zurück!',
          description: 'Sie wurden erfolgreich angemeldet.',
        });

        // Get user role from metadata
        const userRole = data.user?.user_metadata?.role || 'tenant';

        // Redirect based on role
        if (userRole === 'landlord') {
          navigate('/dashboard/landlord');
        } else {
          navigate('/dashboard/tenant');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Ein Fehler ist aufgetreten',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold">spacefindr</span>
          </Link>

          <h1 className="text-display-sm mb-6">
            {mode === 'login' 
              ? 'Willkommen zurück!' 
              : 'Starten Sie jetzt'
            }
          </h1>
          
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-md">
            {mode === 'login'
              ? 'Melden Sie sich an, um auf Ihre Buchungen und Flächen zuzugreifen.'
              : 'Erstellen Sie ein kostenloses Konto und entdecken Sie flexible Gewerbeflächen.'
            }
          </p>

          <div className="space-y-4">
            {[
              'Über 1.200 Gewerbeflächen',
              'Sichere Zahlungsabwicklung',
              'Flexibles tageweises Mieten',
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </div>
                <span className="text-primary-foreground/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">spacefindr</span>
          </Link>

          <Card className="p-8">
            {/* Mode tabs */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg mb-8">
              <button
                onClick={() => setMode('login')}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-md transition-all",
                  mode === 'login'
                    ? "bg-surface shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Anmelden
              </button>
              <button
                onClick={() => setMode('register')}
                className={cn(
                  "flex-1 py-2.5 text-sm font-medium rounded-md transition-all",
                  mode === 'register'
                    ? "bg-surface shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Registrieren
              </button>
            </div>

            {/* Role selection for registration */}
            {mode === 'register' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ich möchte...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('tenant')}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      role === 'tenant'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="font-medium text-foreground">Flächen mieten</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Als Mieter registrieren
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('landlord')}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      role === 'landlord'
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="font-medium text-foreground">Flächen vermieten</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Als Vermieter registrieren
                    </div>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Max Mustermann"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@beispiel.de"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Passwort
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Passwort bestätigen
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Passwort vergessen?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                variant="accent"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Bitte warten...</span>
                ) : mode === 'login' ? (
                  'Anmelden'
                ) : (
                  'Konto erstellen'
                )}
              </Button>
            </form>

            {mode === 'register' && (
              <p className="text-xs text-muted-foreground text-center mt-4">
                Mit der Registrierung akzeptieren Sie unsere{' '}
                <Link to="/terms" className="text-primary hover:underline">AGB</Link> und{' '}
                <Link to="/privacy" className="text-primary hover:underline">Datenschutzerklärung</Link>.
              </p>
            )}
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? (
              <>
                Noch kein Konto?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-primary font-medium hover:underline"
                >
                  Jetzt registrieren
                </button>
              </>
            ) : (
              <>
                Bereits registriert?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-primary font-medium hover:underline"
                >
                  Anmelden
                </button>
              </>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
