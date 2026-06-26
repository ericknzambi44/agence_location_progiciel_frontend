import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerEmploye } from '../hooks/useRH';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, UserPlus, Mail, Calendar, DollarSign, Badge } from 'lucide-react';

const schema = z.object({
  matricule: z.string().min(1, 'Matricule requis'),
  nom: z.string().min(1, 'Nom requis'),
  prenom: z.string().min(1, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  date_embauche: z.string().min(1, "Date d'embauche requise"),
  taux_horaire: z.number().min(0, 'Taux horaire >= 0'),
  poste: z.string().min(1, 'Poste requis'),
});

type FormData = z.infer<typeof schema>;

export const EmployeCreate = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreerEmploye();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      date_embauche: '',
      taux_horaire: 0,
      poste: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/rh'),
      onError: (err: any) => {
        const msg = err.response?.data?.error || "Erreur lors de l'embauche.";
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
              <CardTitle className="text-2xl">Embaucher un employé</CardTitle>
              <p className="text-sm text-muted-foreground">
                Renseignez les informations du nouvel employé.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Matricule */}
            <div className="space-y-2">
              <Label htmlFor="matricule" className="flex items-center gap-2">
                <Badge className="h-4 w-4" /> Matricule *
              </Label>
              <Input
                id="matricule"
                className={errors.matricule ? 'border-destructive' : ''}
                {...register('matricule')}
              />
              {errors.matricule && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.matricule.message}
                </p>
              )}
            </div>

            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
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
                <Label htmlFor="prenom">Prénom *</Label>
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

            {/* Date d'embauche et Taux horaire */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_embauche" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Date d'embauche *
                </Label>
                <Input
                  id="date_embauche"
                  type="date"
                  className={errors.date_embauche ? 'border-destructive' : ''}
                  {...register('date_embauche')}
                />
                {errors.date_embauche && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.date_embauche.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="taux_horaire" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Taux horaire *
                </Label>
                <Input
                  id="taux_horaire"
                  type="number"
                  step="0.01"
                  className={errors.taux_horaire ? 'border-destructive' : ''}
                  {...register('taux_horaire', { valueAsNumber: true })}
                />
                {errors.taux_horaire && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.taux_horaire.message}
                  </p>
                )}
              </div>
            </div>

            {/* Poste */}
            <div className="space-y-2">
              <Label htmlFor="poste">Poste *</Label>
              <Input
                id="poste"
                className={errors.poste ? 'border-destructive' : ''}
                {...register('poste')}
              />
              {errors.poste && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.poste.message}
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
              <Button variant="outline" onClick={() => navigate('/rh')} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" className="btn-elite w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Embauche...
                  </>
                ) : (
                  "Embaucher l'employé"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};