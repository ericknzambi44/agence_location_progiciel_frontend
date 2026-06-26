/**
 * Formulaire de création de contrat de location.
 * Intègre l'estimation du montant avec détail du calcul et devise.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreerContrat, useCalculerMontant } from '../hooks/useLocation';
import { useClients } from '../hooks/useLocation';
import { useBiens } from '@/features/stock/hooks/useBiens';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Calculator, AlertCircle } from 'lucide-react';
import { EstimationDetail } from './EstimationDetail';


const schema = z.object({
  client_id: z.string().min(1, 'Client requis'),
  bien_id: z.string().min(1, 'Bien requis'),
  date_debut: z.string().min(1, 'Date de début requise'),
  date_fin: z.string().min(1, 'Date de fin requise'),
}).refine((data) => new Date(data.date_fin) > new Date(data.date_debut), {
  message: 'La date de fin doit être après la date de début',
  path: ['date_fin'],
});

type FormData = z.infer<typeof schema>;

/**
 * Convertit une valeur en nombre de manière sécurisée.
 */
const toNumber = (value: any): number => {
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return typeof value === 'number' && !isNaN(value) ? value : 0;
};

export const ContratCreate = () => {
  const navigate = useNavigate();
  const { mutate: creerContrat, isPending: isCreating } = useCreerContrat();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: biens, isLoading: biensLoading } = useBiens();
  const { mutate: calculerMontant, data: estimation, isPending: isCalcul, error: estimationError } = useCalculerMontant();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { client_id: '', bien_id: '', date_debut: '', date_fin: '' },
  });

  const bienId = watch('bien_id');
  const dateDebut = watch('date_debut');
  const dateFin = watch('date_fin');

  const handleCalculEstimation = () => {
    if (bienId && dateDebut && dateFin) {
      calculerMontant({ bien_id: bienId, date_debut: dateDebut, date_fin: dateFin });
    }
  };

  const onSubmit = (data: FormData) => {
    setSubmitError(null);
    creerContrat(data, {
      onSuccess: () => navigate('/location/contrats'),
      onError: (err: any) => {
        const msg = err.response?.data?.error || 'Erreur lors de la création du contrat.';
        setSubmitError(msg);
      },
    });
  };

  const isLoading = clientsLoading || biensLoading;

  // Récupération du bien sélectionné
  const bien = biens?.find(b => b.id === bienId);
  // Devise par défaut USD
  const devise = bien?.devise || 'USD';
  const prixUnitaire = bien?.prix_unitaire_ht !== undefined ? toNumber(bien.prix_unitaire_ht) : 0;

  // Calcul de la durée et du sous-total
  let duree = 0;
  let sousTotal = 0;
  if (dateDebut && dateFin) {
    const diff = new Date(dateFin).getTime() - new Date(dateDebut).getTime();
    duree = Math.max(0, diff / (1000 * 3600 * 24));
    sousTotal = prixUnitaire * duree;
  }

  const total = estimation !== undefined ? toNumber(estimation) : sousTotal;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in">
      <Card className="card-glass border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-2xl">Nouveau contrat de location</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sélectionnez le client, le bien et les dates. Le montant sera calculé automatiquement.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Client et Bien */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client_id">Client *</Label>
                <Select onValueChange={(val) => setValue('client_id', val)}>
                  <SelectTrigger id="client_id" className={errors.client_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Choisir un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      clients?.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.prenom} {c.nom}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.client_id && (
                  <p className="text-destructive text-sm flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.client_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bien_id">Bien *</Label>
                <Select onValueChange={(val) => setValue('bien_id', val)}>
                  <SelectTrigger id="bien_id" className={errors.bien_id ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Choisir un bien" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Chargement...</SelectItem>
                    ) : (
                      biens?.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.nom} (réf: {b.reference}) - {toNumber(b.prix_unitaire_ht).toFixed(2)} {b.devise || 'USD'}/jour
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
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date_debut">Date de début *</Label>
                <Input
                  id="date_debut"
                  type="date"
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
                <Label htmlFor="date_fin">Date de fin *</Label>
                <Input
                  id="date_fin"
                  type="date"
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

            {/* Estimation */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCalculEstimation}
                disabled={isCalcul || !bienId || !dateDebut || !dateFin}
                className="gap-2"
              >
                {isCalcul ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Calcul...</>
                ) : (
                  <><Calculator className="h-4 w-4" /> Estimer le montant</>
                )}
              </Button>
              {estimation !== undefined && (
                <span className="text-sm text-muted-foreground">
                  Montant estimé : <span className="font-bold text-primary">{toNumber(estimation).toFixed(2)} {devise}</span>
                </span>
              )}
              {estimationError && (
                <span className="text-destructive text-sm flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {estimationError.message}
                </span>
              )}
            </div>

            {/* Détail du calcul */}
            {estimation !== undefined && bien && duree > 0 && (
              <div className="mt-4">
                <EstimationDetail
                  prixUnitaire={prixUnitaire}
                  duree={duree}
                  sousTotal={sousTotal}
                  total={estimation}
                  devise={devise}
                  // À terme, on pourra ajouter remises, majorations, forfait si l'API les renvoie
                />
              </div>
            )}

            {/* Erreur globale */}
            {submitError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{submitError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => navigate('/location/contrats')} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button type="submit" className="btn-elite w-full sm:w-auto" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer le contrat'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};