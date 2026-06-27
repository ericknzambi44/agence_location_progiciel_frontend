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
import { Loader2, AlertCircle, Settings, Tag, Clock, Calendar, Info } from 'lucide-react';
import { RegleMaintenance, TypeRegleMaintenance } from '../types/regleMaintenance.types';

// Schéma de validation
const schema = z.object({
  type: z.enum(['forfait', 'remise', 'majoration']),
  valeur: z.number().min(0, 'La valeur doit être positive'),
  duree_min: z.number().int().min(0, 'Durée minimale >= 0'),
  duree_max: z.number().int().nullable().optional(),
  periode_debut: z.string().nullable().optional(),
  periode_fin: z.string().nullable().optional(),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface RegleMaintenanceFormProps {
  initialData?: RegleMaintenance;
  onSave: (data: RegleMaintenance) => void;
  onCancel: () => void;
  isEditing: boolean;
  isSaving?: boolean;
  error?: string | null;
}

export const RegleMaintenanceForm = ({
  initialData,
  onSave,
  onCancel,
  isEditing,
  isSaving = false,
  error: submitError = null,
}: RegleMaintenanceFormProps) => {
  const [active, setActive] = useState(initialData?.active !== false);

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
    const regle: RegleMaintenance = {
      type: data.type,
      valeur: data.valeur,
      duree_min: data.duree_min,
      duree_max: data.duree_max ?? undefined,
      periode_debut: data.periode_debut ?? undefined,
      periode_fin: data.periode_fin ?? undefined,
      description: data.description ?? undefined,
      active: active,
    };
    onSave(regle);
  };

  return (
    <Card className="card-glass border-0 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">{isEditing ? 'Modifier la règle' : 'Nouvelle règle'}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? 'Modifiez les paramètres de la règle de tarification maintenance.'
                : 'Créez une nouvelle règle pour moduler les coûts des interventions.'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Encart d'explication */}
          <div className="bg-muted/50 border rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium">À quoi sert cette règle ?</p>
              <p className="text-muted-foreground">
                Une règle de tarification modifie le coût final d'une intervention.
                Elle s'applique <strong>automatiquement</strong> lors de la terminaison de l'intervention,
                si les conditions (durée, période) sont remplies.
              </p>
              <ul className="list-disc list-inside text-muted-foreground text-xs">
                <li><strong>Remise</strong> : réduit le coût total d'un pourcentage.</li>
                <li><strong>Majoration</strong> : augmente le coût total d'un pourcentage.</li>
                <li><strong>Forfait</strong> : remplace le coût total par un montant fixe (prioritaire).</li>
              </ul>
            </div>
          </div>

          {/* Type de règle */}
          <div className="space-y-2">
            <Label htmlFor="type" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Type de règle *
            </Label>
            <Select
              onValueChange={(val) => setValue('type', val as TypeRegleMaintenance)}
              value={currentType}
            >
              <SelectTrigger id="type" className={errors.type ? 'border-destructive' : ''}>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remise">Remise (%)</SelectItem>
                <SelectItem value="majoration">Majoration (%)</SelectItem>
                <SelectItem value="forfait">Forfait (€)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choisissez le type d'impact : <strong>Remise</strong> (réduction), <strong>Majoration</strong> (augmentation) ou <strong>Forfait</strong> (montant fixe).
            </p>
            {errors.type && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Valeur */}
          <div className="space-y-2">
            <Label htmlFor="valeur" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Valeur *
            </Label>
            <Input
              id="valeur"
              type="number"
              step="0.01"
              className={errors.valeur ? 'border-destructive' : ''}
              {...register('valeur', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Pour une <strong>remise</strong> ou <strong>majoration</strong> : saisissez un pourcentage (ex: 10 pour 10%).
              Pour un <strong>forfait</strong> : saisissez un montant en euros (ex: 100).
            </p>
            {errors.valeur && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.valeur.message}
              </p>
            )}
          </div>

          {/* Durées */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duree_min" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Durée minimale (heures) *
              </Label>
              <Input
                id="duree_min"
                type="number"
                className={errors.duree_min ? 'border-destructive' : ''}
                {...register('duree_min', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                La règle s'applique si la durée de l'intervention est <strong>≥</strong> à cette valeur.
                Exemple : 2 pour s'appliquer à partir de 2 heures.
              </p>
              {errors.duree_min && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.duree_min.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duree_max" className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Durée maximale (heures)
              </Label>
              <Input
                id="duree_max"
                type="number"
                className={errors.duree_max ? 'border-destructive' : ''}
                {...register('duree_max', { valueAsNumber: true })}
              />
              <p className="text-xs text-muted-foreground">
                La règle s'applique si la durée est <strong>≤</strong> à cette valeur. 
                Laissez vide pour <strong>illimité</strong>.
              </p>
              {errors.duree_max && (
                <p className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.duree_max.message}
                </p>
              )}
            </div>
          </div>

          {/* Période */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="periode_debut" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Période début (optionnel)
              </Label>
              <Input
                id="periode_debut"
                type="date"
                className={errors.periode_debut ? 'border-destructive' : ''}
                {...register('periode_debut')}
              />
              <p className="text-xs text-muted-foreground">
                La règle s'applique à partir de cette date. Laissez vide pour <strong>dès maintenant</strong>.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="periode_fin" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Période fin (optionnel)
              </Label>
              <Input
                id="periode_fin"
                type="date"
                className={errors.periode_fin ? 'border-destructive' : ''}
                {...register('periode_fin')}
              />
              <p className="text-xs text-muted-foreground">
                La règle s'applique jusqu'à cette date. Laissez vide pour <strong>illimitée</strong>.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Description (optionnel)
            </Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="Ex: Remise pour interventions longues"
            />
            <p className="text-xs text-muted-foreground">
              Une description courte pour identifier la règle (ex: "Promotion été").
            </p>
          </div>

          {/* Actif */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
            />
            <Label htmlFor="active" className="cursor-pointer">Règle active</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Une règle <strong>active</strong> est appliquée automatiquement. Désactivez-la pour la suspendre sans la supprimer.
          </p>

          {/* Erreur globale */}
          {submitError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{submitError}</span>
            </div>
          )}

          {/* Boutons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto">
              Annuler
            </Button>
            <Button type="submit" className="btn-elite w-full sm:w-auto" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                isEditing ? 'Mettre à jour' : 'Ajouter'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};