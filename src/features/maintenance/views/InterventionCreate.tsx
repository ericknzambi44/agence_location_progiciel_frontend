import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerIntervention, useTechniciens } from '../hooks/useMaintenance';
import { useBiens } from '@/features/stock/hooks/useBiens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calendar, Clock, User, Package, AlertCircle } from 'lucide-react';

const schema = z.object({
  bien_id: z.string().min(1, 'Choisissez un bien'),
  technicien_id: z.string().min(1, 'Choisissez un technicien'),
  date_debut: z.string().min(1, 'Date de début requise'),
  date_fin: z.string().min(1, 'Date de fin requise'),
}).refine((data) => new Date(data.date_fin) > new Date(data.date_debut), {
  message: 'La date de fin doit être postérieure à la date de début',
  path: ['date_fin'],
});

type FormData = z.infer<typeof schema>;

export const InterventionCreate = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreerIntervention();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: biens, isLoading: biensLoading } = useBiens();
  const { data: techniciens, isLoading: techLoading } = useTechniciens();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      bien_id: '',
      technicien_id: '',
      date_debut: '',
      date_fin: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/maintenance'),
      onError: (err: any) => {
        const msg = err.response?.data?.error || 'Erreur lors de la planification.';
        setSubmitError(msg);
      },
    });
  };

  const isLoading = biensLoading || techLoading;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in">
      <Card className="card-glass border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Planifier une intervention</CardTitle>
              <p className="text-sm text-muted-foreground">
                Renseignez les informations ci-dessous pour créer une nouvelle intervention de maintenance.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Champs en grille 2 colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sélection du bien */}
              <div className="space-y-2">
                <Label htmlFor="bien" className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Bien *
                </Label>
                <Select onValueChange={(val) => setValue('bien_id', val)}>
                  <SelectTrigger id="bien" className={errors.bien_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Sélectionner un bien" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      biens?.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.nom} (Réf: {b.reference})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.bien_id && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.bien_id.message}
                  </p>
                )}
              </div>

              {/* Sélection du technicien */}
              <div className="space-y-2">
                <Label htmlFor="technicien" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Technicien *
                </Label>
                <Select onValueChange={(val) => setValue('technicien_id', val)}>
                  <SelectTrigger id="technicien" className={errors.technicien_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Sélectionner un technicien" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      techniciens?.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.prenom} {t.nom} ({t.cout_horaire} €/h)
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.technicien_id && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.technicien_id.message}
                  </p>
                )}
              </div>
            </div>

            {/* Dates (pleine largeur) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_debut" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Date et heure de début *
                </Label>
                <Input
                  id="date_debut"
                  type="datetime-local"
                  className={errors.date_debut ? 'border-destructive' : ''}
                  {...register('date_debut')}
                />
                {errors.date_debut && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.date_debut.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_fin" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Date et heure de fin *
                </Label>
                <Input
                  id="date_fin"
                  type="datetime-local"
                  className={errors.date_fin ? 'border-destructive' : ''}
                  {...register('date_fin')}
                />
                {errors.date_fin && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.date_fin.message}
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

            {/* Boutons d'action */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate('/maintenance')} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" className="btn-elite w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Planification...
                  </>
                ) : (
                  'Planifier l\'intervention'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};