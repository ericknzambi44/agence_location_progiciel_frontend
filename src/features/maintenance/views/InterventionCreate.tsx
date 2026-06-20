import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerIntervention, usePieces, useTechniciens } from '../hooks/useMaintenance';
import { useBiens } from '@/features/stock/hooks/useBiens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

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

/**
 * Formulaire de planification d'une nouvelle intervention.
 * Utilise les bons endpoints : techniciens depuis maintenance/interventions/techniciens/
 */
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

  if (biensLoading || techLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Planifier une intervention</CardTitle>
          <p className="text-sm text-muted-foreground">
            Renseignez les informations ci-dessous pour créer une nouvelle intervention de maintenance.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Sélection du bien */}
            <div>
              <Label>Bien *</Label>
              <Select onValueChange={(val) => setValue('bien_id', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bien" />
                </SelectTrigger>
                <SelectContent>
                  {biens?.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.nom} (Réf: {b.reference})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bien_id && <p className="text-destructive text-sm">{errors.bien_id.message}</p>}
            </div>

            {/* Sélection du technicien (depuis maintenance) */}
            <div>
              <Label>Technicien *</Label>
              <Select onValueChange={(val) => setValue('technicien_id', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un technicien" />
                </SelectTrigger>
                <SelectContent>
                  {techniciens?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.prenom} {t.nom} ({t.cout_horaire} €/h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.technicien_id && <p className="text-destructive text-sm">{errors.technicien_id.message}</p>}
            </div>

            {/* Date de début */}
            <div>
              <Label>Date et heure de début *</Label>
              <Input type="datetime-local" {...register('date_debut')} />
              {errors.date_debut && <p className="text-destructive text-sm">{errors.date_debut.message}</p>}
            </div>

            {/* Date de fin */}
            <div>
              <Label>Date et heure de fin *</Label>
              <Input type="datetime-local" {...register('date_fin')} />
              {errors.date_fin && <p className="text-destructive text-sm">{errors.date_fin.message}</p>}
            </div>

            {/* Erreur globale */}
            {submitError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {submitError}
              </div>
            )}

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate('/maintenance')}>
                Annuler
              </Button>
              <Button type="submit" className="btn-elite" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Planification...
                  </>
                ) : (
                  'Planifier'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};