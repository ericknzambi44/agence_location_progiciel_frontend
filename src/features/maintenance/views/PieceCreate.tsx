import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerPiece } from '../hooks/useMaintenance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Schéma avec z.number() explicite (pas de coerce)
const schema = z.object({
  reference: z.string().min(1, 'Référence requise'),
  nom: z.string().min(1, 'Nom requis'),
  prix_unitaire: z.number().min(0, 'Le prix doit être >= 0'),
  stock: z.number().int().min(0, 'Le stock doit être >= 0'),
});

type FormData = z.infer<typeof schema>;

export const PieceCreate = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreerPiece();
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
      prix_unitaire: 0,
      stock: 0,
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/maintenance/pieces'),
      onError: (err: any) => {
        setSubmitError(err.response?.data?.error || 'Erreur lors de la création.');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle pièce détachée</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Référence *</Label>
              <Input {...register('reference')} />
              {errors.reference && <p className="text-destructive text-sm">{errors.reference.message}</p>}
            </div>
            <div>
              <Label>Nom *</Label>
              <Input {...register('nom')} />
              {errors.nom && <p className="text-destructive text-sm">{errors.nom.message}</p>}
            </div>
            <div>
              <Label>Prix unitaire HT *</Label>
              <Input
                type="number"
                step="0.01"
                {...register('prix_unitaire', { valueAsNumber: true })}
              />
              {errors.prix_unitaire && <p className="text-destructive text-sm">{errors.prix_unitaire.message}</p>}
            </div>
            <div>
              <Label>Stock initial *</Label>
              <Input
                type="number"
                step="1"
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && <p className="text-destructive text-sm">{errors.stock.message}</p>}
            </div>

            {submitError && <p className="text-destructive text-sm">{submitError}</p>}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate('/maintenance/pieces')}>Annuler</Button>
              <Button type="submit" className="btn-elite" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};