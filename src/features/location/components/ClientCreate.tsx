import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerClient } from '../hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, User, Mail, Phone, MapPin, UserPlus } from 'lucide-react';

const schema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  prenom: z.string().min(1, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(1, 'Téléphone requis'),
  adresse: z.string().min(1, 'Adresse requise'),
});

type FormData = z.infer<typeof schema>;

export const ClientCreate = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreerClient();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nom: '', prenom: '', email: '', telephone: '', adresse: '' },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/location/clients'),
      onError: (err: any) => {
        const msg = err.response?.data?.error || 'Erreur lors de la création du client.';
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
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Nouveau client</CardTitle>
              <p className="text-sm text-muted-foreground">
                Renseignez les informations du client.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
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
              <div className="space-y-2">
                <Label htmlFor="prenom" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Prénom *
                </Label>
                <Input
                  id="prenom"
                  className={errors.prenom ? 'border-destructive' : ''}
                  {...register('prenom')}
                />
                {errors.prenom && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.prenom.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
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

            {/* Téléphone */}
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

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="adresse" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Adresse *
              </Label>
              <Input
                id="adresse"
                className={errors.adresse ? 'border-destructive' : ''}
                {...register('adresse')}
              />
              {errors.adresse && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.adresse.message}
                </p>
              )}
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
              <Button variant="outline" onClick={() => navigate('/location/clients')} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" className="btn-elite w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer le client'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};