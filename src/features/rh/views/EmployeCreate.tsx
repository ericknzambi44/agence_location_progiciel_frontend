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

const schema = z.object({
  matricule: z.string().min(1, 'Matricule requis'),
  nom: z.string().min(1, 'Nom requis'),
  prenom: z.string().min(1, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  date_embauche: z.string().min(1, 'Date d\'embauche requise'),
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
        const msg = err.response?.data?.error || 'Erreur lors de l\'embauche.';
        setSubmitError(msg);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Embaucher un employé</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Matricule *</Label>
              <Input {...register('matricule')} />
              {errors.matricule && <p className="text-destructive text-sm">{errors.matricule.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Nom *</Label>
                <Input {...register('nom')} />
                {errors.nom && <p className="text-destructive text-sm">{errors.nom.message}</p>}
              </div>
              <div>
                <Label>Prénom *</Label>
                <Input {...register('prenom')} />
                {errors.prenom && <p className="text-destructive text-sm">{errors.prenom.message}</p>}
              </div>
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Date d'embauche *</Label>
              <Input type="date" {...register('date_embauche')} />
              {errors.date_embauche && <p className="text-destructive text-sm">{errors.date_embauche.message}</p>}
            </div>
            <div>
              <Label>Taux horaire *</Label>
              <Input
                type="number"
                step="0.01"
                {...register('taux_horaire', { valueAsNumber: true })}
              />
              {errors.taux_horaire && <p className="text-destructive text-sm">{errors.taux_horaire.message}</p>}
            </div>
            <div>
              <Label>Poste *</Label>
              <Input {...register('poste')} />
              {errors.poste && <p className="text-destructive text-sm">{errors.poste.message}</p>}
            </div>

            {submitError && <p className="text-destructive text-sm">{submitError}</p>}

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate('/rh')}>Annuler</Button>
              <Button type="submit" className="btn-elite" disabled={isPending}>
                {isPending ? 'Création...' : 'Embaucher'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};