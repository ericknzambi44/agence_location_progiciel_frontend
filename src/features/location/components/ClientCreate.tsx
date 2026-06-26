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
import { Loader2 } from 'lucide-react';

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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nom: '', prenom: '', email: '', telephone: '', adresse: '' },
  });

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    mutate(data, {
      onSuccess: () => navigate('/location/clients'),
      onError: (err: any) => setSubmitError(err.response?.data?.error || 'Erreur'),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader><CardTitle>Nouveau client</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div>
              <Label>Email *</Label>
              <Input type="email" {...register('email')} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Téléphone *</Label>
              <Input {...register('telephone')} />
              {errors.telephone && <p className="text-destructive text-sm">{errors.telephone.message}</p>}
            </div>
            <div>
              <Label>Adresse *</Label>
              <Input {...register('adresse')} />
              {errors.adresse && <p className="text-destructive text-sm">{errors.adresse.message}</p>}
            </div>
            {submitError && <p className="text-destructive text-sm">{submitError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigate('/location/clients')}>Annuler</Button>
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