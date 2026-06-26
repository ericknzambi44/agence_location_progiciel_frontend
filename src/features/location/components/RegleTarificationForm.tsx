import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RegleTarification, TypeRegle } from '../types/tarification.types';

// Schéma de validation
const schema = z.object({
  type: z.enum(['forfait', 'remise', 'majoration']),
  valeur: z.number().min(0, 'La valeur doit être positive'),
  duree_min: z.number().int().min(0, 'Durée minimale >= 0'),
  duree_max: z.number().int().nullable().optional(),
  bien_id: z.string().nullable().optional(),
  categorie_id: z.string().nullable().optional(),
  periode_debut: z.string().nullable().optional(),
  periode_fin: z.string().nullable().optional(),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface RegleTarificationFormProps {
  initialData?: RegleTarification;
  onSave: (data: RegleTarification) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const RegleTarificationForm = ({
  initialData,
  onSave,
  onCancel,
  isEditing,
}: RegleTarificationFormProps) => {
  const [active, setActive] = useState(initialData?.active ?? true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'remise' as const,
      valeur: 0,
      duree_min: 0,
      duree_max: null,
      bien_id: null,
      categorie_id: null,
      periode_debut: null,
      periode_fin: null,
      description: '',
      active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        valeur: initialData.valeur,
        duree_min: initialData.duree_min,
        duree_max: initialData.duree_max ?? null,
        bien_id: initialData.bien_id ?? null,
        categorie_id: initialData.categorie_id ?? null,
        periode_debut: initialData.periode_debut ?? null,
        periode_fin: initialData.periode_fin ?? null,
        description: initialData.description ?? '',
        active: initialData.active ?? true,
      });
      setActive(initialData.active ?? true);
    }
  }, [initialData, reset]);

  const currentType = watch('type');

  const onSubmit = (data: FormData) => {
    const regle: RegleTarification = {
      type: data.type,
      valeur: data.valeur,
      duree_min: data.duree_min,
      duree_max: data.duree_max ?? undefined,
      bien_id: data.bien_id ?? undefined,
      categorie_id: data.categorie_id ?? undefined,
      periode_debut: data.periode_debut ?? undefined,
      periode_fin: data.periode_fin ?? undefined,
      description: data.description ?? undefined,
      active: active,
    };
    onSave(regle);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Modifier la règle' : 'Nouvelle règle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="type">Type de règle *</Label>
            <Select
              onValueChange={(val) => setValue('type', val as TypeRegle)}
              value={currentType}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remise">Remise (%)</SelectItem>
                <SelectItem value="majoration">Majoration (%)</SelectItem>
                <SelectItem value="forfait">Forfait (€)</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-destructive text-sm">{errors.type.message}</p>}
          </div>

          <div>
            <Label htmlFor="valeur">Valeur *</Label>
            <Input
              id="valeur"
              type="number"
              step="0.01"
              {...register('valeur', { valueAsNumber: true })}
            />
            {errors.valeur && <p className="text-destructive text-sm">{errors.valeur.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duree_min">Durée minimale (jours) *</Label>
              <Input
                id="duree_min"
                type="number"
                {...register('duree_min', { valueAsNumber: true })}
              />
              {errors.duree_min && <p className="text-destructive text-sm">{errors.duree_min.message}</p>}
            </div>
            <div>
              <Label htmlFor="duree_max">Durée maximale (jours)</Label>
              <Input
                id="duree_max"
                type="number"
                {...register('duree_max', { valueAsNumber: true })}
              />
              {errors.duree_max && <p className="text-destructive text-sm">{errors.duree_max.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="bien_id">ID du bien (ciblage spécifique, optionnel)</Label>
            <Input id="bien_id" {...register('bien_id')} />
          </div>

          <div>
            <Label htmlFor="categorie_id">ID de la catégorie (ciblage global, optionnel)</Label>
            <Input id="categorie_id" {...register('categorie_id')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periode_debut">Période début (optionnel)</Label>
              <Input id="periode_debut" type="date" {...register('periode_debut')} />
            </div>
            <div>
              <Label htmlFor="periode_fin">Période fin (optionnel)</Label>
              <Input id="periode_fin" type="date" {...register('periode_fin')} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
            />
            <Label htmlFor="active">Actif</Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="btn-elite">
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};