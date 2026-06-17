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

// Schéma simplifié : pas de coerce, on utilise valueAsNumber dans le register
const schema = z.object({
  reference: z.string().min(1, 'La référence est requise'),
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  prix_unitaire_ht: z.number().min(0, 'Le prix doit être >= 0'),
  date_achat: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const BienCreate = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreerBien();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      reference: '',
      nom: '',
      description: '',
      prix_unitaire_ht: 0,
      date_achat: '',
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/stock'),
      onError: (error: any) => {
        const msg = error.response?.data?.error || 'Erreur lors de la création.';
        setSubmitError(msg);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau bien</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="reference">Référence *</Label>
              <Input id="reference" {...register('reference')} />
              {errors.reference && (
                <p className="text-destructive text-sm">{errors.reference.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input id="nom" {...register('nom')} />
              {errors.nom && <p className="text-destructive text-sm">{errors.nom.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...register('description')} />
            </div>
            <div>
              <Label htmlFor="prix_unitaire_ht">Prix unitaire HT</Label>
              <Input
                id="prix_unitaire_ht"
                type="number"
                step="0.01"
                {...register('prix_unitaire_ht', { valueAsNumber: true })}
              />
              {errors.prix_unitaire_ht && (
                <p className="text-destructive text-sm">{errors.prix_unitaire_ht.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="date_achat">Date d'achat</Label>
              <Input id="date_achat" type="date" {...register('date_achat')} />
            </div>

            {submitError && (
              <p className="text-destructive text-sm">{submitError}</p>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/stock')}
              >
                Annuler
              </Button>
              <Button type="submit" className="btn-elite" disabled={isPending}>
                {isPending ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};