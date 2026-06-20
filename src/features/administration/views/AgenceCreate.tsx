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
import { Loader2 } from 'lucide-react';

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
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
    <div className="max-w-2xl mx-auto animate-in fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle agence</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Champs du formulaire */}
            <div>
              <Label>Nom *</Label>
              <Input {...register('nom')} />
              {errors.nom && <p className="text-destructive text-sm">{errors.nom.message}</p>}
            </div>
            <div>
              <Label>Adresse ligne 1 *</Label>
              <Input {...register('adresse_ligne1')} />
              {errors.adresse_ligne1 && <p className="text-destructive text-sm">{errors.adresse_ligne1.message}</p>}
            </div>
            <div>
              <Label>Adresse ligne 2</Label>
              <Input {...register('adresse_ligne2')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Code postal</Label>
                <Input {...register('code_postal')} />
              </div>
              <div>
                <Label>Ville *</Label>
                <Input {...register('ville')} />
                {errors.ville && <p className="text-destructive text-sm">{errors.ville.message}</p>}
              </div>
            </div>
            <div>
              <Label>Pays *</Label>
              <Input {...register('pays')} />
              {errors.pays && <p className="text-destructive text-sm">{errors.pays.message}</p>}
            </div>
            <div>
              <Label>Téléphone *</Label>
              <Input {...register('telephone')} />
              {errors.telephone && <p className="text-destructive text-sm">{errors.telephone.message}</p>}
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            {submitError && <p className="text-destructive text-sm">{submitError}</p>}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate('/administration')}>Annuler</Button>
              <Button type="submit" className="btn-elite" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Création...</> : 'Créer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};