import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerBien } from '../hooks/useBiens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';

// Devises autorisées
const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR', 'BRL'];

// Schéma de validation
const schema = z.object({
  reference: z.string().min(1, 'La référence est requise'),
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  prix_unitaire_ht: z.number().min(0, 'Le prix doit être >= 0'),
  devise: z.string().default('USD'),
  date_achat: z.string().optional(),
});

// Type inféré par Zod (équivalent à FormData)
type FormData = z.infer<typeof schema>;

export const BienCreate = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreerBien();
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ✅ Utilisation de useForm SANS type générique explicite
  // pour éviter les conflits de typage avec zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      reference: '',
      nom: '',
      description: '',
      prix_unitaire_ht: 0,
      devise: 'USD' as const,
      date_achat: '',
    },
  });

  const currentDevise = watch('devise');

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/stock'),
      onError: (error: any) => {
        const msg = error.response?.data?.error || error.response?.data?.details || 'Erreur lors de la création.';
        setSubmitError(msg);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in">
      <Card className="card-glass border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-2xl">Nouveau bien</CardTitle>
              <p className="text-sm text-muted-foreground">Renseignez les informations du bien à louer.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Référence */}
            <div className="space-y-2">
              <Label htmlFor="reference" className="flex items-center gap-2">
                <span>Référence *</span>
              </Label>
              <Input id="reference" className={errors.reference ? 'border-destructive' : ''} {...register('reference')} />
              {errors.reference && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.reference.message}
                </p>
              )}
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="nom" className="flex items-center gap-2">
                <span>Nom *</span>
              </Label>
              <Input id="nom" className={errors.nom ? 'border-destructive' : ''} {...register('nom')} />
              {errors.nom && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.nom.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} />
            </div>

            {/* Prix et devise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prix_unitaire_ht" className="flex items-center gap-2">
                  <span>Prix unitaire HT *</span>
                </Label>
                <Input
                  id="prix_unitaire_ht"
                  type="number"
                  step="0.01"
                  className={errors.prix_unitaire_ht ? 'border-destructive' : ''}
                  {...register('prix_unitaire_ht', { valueAsNumber: true })}
                />
                {errors.prix_unitaire_ht && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.prix_unitaire_ht.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="devise" className="flex items-center gap-2">
                  <span>Devise *</span>
                </Label>
                <Select
                  onValueChange={(val) => setValue('devise', val)}
                  value={currentDevise}
                >
                  <SelectTrigger id="devise" className={errors.devise ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((cur) => (
                      <SelectItem key={cur} value={cur}>{cur}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.devise && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.devise.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date d'achat */}
            <div className="space-y-2">
              <Label htmlFor="date_achat">Date d'achat</Label>
              <Input id="date_achat" type="date" {...register('date_achat')} />
            </div>

            {/* Erreur globale */}
            {submitError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{submitError}</span>
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate('/stock')} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" className="btn-elite w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer le bien'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};