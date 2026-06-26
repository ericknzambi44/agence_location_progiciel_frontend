import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerAgence } from '../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Building, MapPin, Phone, Mail, AlertCircle, Globe } from 'lucide-react';

const schema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  adresse_ligne1: z.string().min(1, 'Adresse ligne 1 requise'),
  adresse_ligne2: z.string().optional(),
  code_postal: z.string().optional(),
  ville: z.string().min(1, 'Ville requise'),
  pays: z.string().min(1, 'Pays requis'),
  telephone: z.string().min(1, 'Téléphone requis'),
  email: z.string().email('Email invalide'),
});

type FormData = z.infer<typeof schema>;

export const AgenceCreate = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreerAgence();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: '',
      adresse_ligne1: '',
      adresse_ligne2: '',
      code_postal: '',
      ville: '',
      pays: 'France',
      telephone: '',
      email: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/administration'),
      onError: (err: any) => {
        setSubmitError(err.response?.data?.error || 'Erreur lors de la création.');
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in">
      <Card className="card-glass border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Nouvelle agence</CardTitle>
              <p className="text-sm text-muted-foreground">
                Renseignez les informations ci-dessous pour créer une nouvelle agence.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom (pleine largeur) */}
            <div className="space-y-2">
              <Label htmlFor="nom" className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Nom *
              </Label>
              <Input
                id="nom"
                className={errors.nom ? 'border-destructive' : ''}
                {...register('nom')}
              />
              {errors.nom && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.nom.message}
                </p>
              )}
            </div>

            {/* Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="adresse_ligne1" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Adresse ligne 1 *
                </Label>
                <Input
                  id="adresse_ligne1"
                  className={errors.adresse_ligne1 ? 'border-destructive' : ''}
                  {...register('adresse_ligne1')}
                />
                {errors.adresse_ligne1 && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.adresse_ligne1.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse_ligne2" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Adresse ligne 2
                </Label>
                <Input
                  id="adresse_ligne2"
                  {...register('adresse_ligne2')}
                />
              </div>
            </div>

            {/* Code postal, Ville, Pays */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code_postal" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Code postal
                </Label>
                <Input
                  id="code_postal"
                  {...register('code_postal')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ville" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Ville *
                </Label>
                <Input
                  id="ville"
                  className={errors.ville ? 'border-destructive' : ''}
                  {...register('ville')}
                />
                {errors.ville && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.ville.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pays" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Pays *
                </Label>
                <Input
                  id="pays"
                  className={errors.pays ? 'border-destructive' : ''}
                  {...register('pays')}
                />
                {errors.pays && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.pays.message}
                  </p>
                )}
              </div>
            </div>

            {/* Téléphone et Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="telephone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Téléphone *
                </Label>
                <Input
                  id="telephone"
                  className={errors.telephone ? 'border-destructive' : ''}
                  {...register('telephone')}
                />
                {errors.telephone && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.telephone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  className={errors.email ? 'border-destructive' : ''}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.email.message}
                  </p>
                )}
              </div>
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
              <Button variant="outline" onClick={() => navigate('/administration')} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" className="btn-elite w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer l\'agence'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};