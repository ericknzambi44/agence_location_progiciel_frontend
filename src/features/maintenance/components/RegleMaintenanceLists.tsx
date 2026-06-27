import { useState } from 'react';
import { useReglesMaintenance, useUpdateReglesMaintenance } from '../hooks/useMaintenance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Loader2, Settings, Info, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { RegleMaintenanceList } from '../types/regleMaintenance.types';
import { RegleMaintenanceForm } from './RegleMaintenanceForm';

const typeColors: Record<string, string> = {
  remise: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  majoration: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  forfait: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const typeLabels: Record<string, string> = {
  remise: 'Remise',
  majoration: 'Majoration',
  forfait: 'Forfait',
};

const typeDescriptions: Record<string, string> = {
  remise: 'Réduit le coût total d\'un pourcentage',
  majoration: 'Augmente le coût total d\'un pourcentage',
  forfait: 'Remplace le coût total par un montant fixe',
};

export const RegleMaintenanceLists = () => {
  const { data: regles, isLoading, error } = useReglesMaintenance();
  const { mutate: updateRegles, isPending } = useUpdateReglesMaintenance();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des règles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-4">
        Erreur de chargement des règles de maintenance.
      </div>
    );
  }

  const handleDelete = (index: number) => {
    if (!regles) return;
    if (!confirm('Supprimer cette règle ?')) return;
    const newRegles = [...regles];
    newRegles.splice(index, 1);
    updateRegles(newRegles);
  };

  const handleSave = (newRegles: RegleMaintenanceList) => {
    setSubmitError(null);
    updateRegles(newRegles, {
      onSuccess: () => {
        setShowForm(false);
        setEditingIndex(null);
      },
      onError: (err: any) => {
        setSubmitError(err.response?.data?.error || 'Erreur lors de l\'enregistrement.');
      },
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  if (showForm) {
    const initialData = editingIndex !== null && regles ? regles[editingIndex] : undefined;
    return (
      <RegleMaintenanceForm
        initialData={initialData}
        onSave={(data) => {
          if (!regles) return;
          let newRegles = [...regles];
          if (editingIndex !== null) {
            newRegles[editingIndex] = data;
          } else {
            newRegles.push(data);
          }
          handleSave(newRegles);
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingIndex(null);
        }}
        isEditing={editingIndex !== null}
        isSaving={isPending}
        error={submitError}
      />
    );
  }

  const reglesList = regles || [];

  return (
    <div className="space-y-6">
      {/* En-tête avec informations */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Règles de tarification maintenance
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configurez les remises, majorations et forfaits pour les interventions.
          </p>
        </div>
        <Button onClick={() => { setEditingIndex(null); setShowForm(true); }} className="btn-elite">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une règle
        </Button>
      </div>

      {/* Encart d'information sur l'application des règles */}
      <div className="bg-muted/50 border rounded-lg p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          <p className="font-medium">Comment fonctionnent les règles ?</p>
          <p>
            Les règles s'appliquent automatiquement lors de la <strong>terminaison</strong> d'une intervention.
            Le coût total est d'abord calculé (main-d'œuvre + pièces), puis les règles sont appliquées dans l'ordre suivant :
          </p>
          <ul className="list-disc list-inside text-muted-foreground">
            <li><strong>Forfait</strong> : remplace le coût total (prioritaire sur les autres règles).</li>
            <li><strong>Remise</strong> : réduit le coût total d'un pourcentage.</li>
            <li><strong>Majoration</strong> : augmente le coût total d'un pourcentage.</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-1">
            <Clock className="inline h-3 w-3 mr-1" />
            Les règles sont appliquées si la durée de l'intervention est comprise entre <strong>durée min</strong> et <strong>durée max</strong> (si définie), et si la date est dans la période (si définie).
          </p>
        </div>
      </div>

      {/* Liste des règles */}
      {reglesList.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">Aucune règle de tarification définie.</p>
          <p className="text-sm text-muted-foreground">
            Cliquez sur <strong>"Ajouter une règle"</strong> pour configurer vos premières règles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reglesList.map((regle, index) => {
            const isActive = regle.active !== false;
            const typeClass = typeColors[regle.type] || 'bg-gray-100 text-gray-800';
            const typeLabel = typeLabels[regle.type] || regle.type;
            const typeDesc = typeDescriptions[regle.type] || '';

            // Construction de la description des conditions
            const conditions = [];
            if (regle.duree_min !== undefined) {
              conditions.push(`durée ≥ ${regle.duree_min}h`);
            }
            if (regle.duree_max !== undefined && regle.duree_max !== null) {
              conditions.push(`durée ≤ ${regle.duree_max}h`);
            }
            if (regle.periode_debut || regle.periode_fin) {
              const debut = regle.periode_debut || 'début';
              const fin = regle.periode_fin || 'fin';
              conditions.push(`période : ${debut} → ${fin}`);
            }
            const conditionText = conditions.length > 0 ? conditions.join(' · ') : 'Toujours applicable';

            return (
              <Card key={index} className={`card-glass transition-all hover:shadow-md ${!isActive ? 'opacity-60' : ''}`}>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={`capitalize ${typeClass} px-3 py-1 text-sm font-medium`}>
                      {typeLabel}
                    </Badge>
                    <span className="text-lg font-bold">
                      {regle.type === 'forfait' ? `${regle.valeur} €` : `${regle.valeur} %`}
                    </span>
                    <Badge variant={isActive ? 'default' : 'secondary'} className="ml-2">
                      {isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                      {isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">{typeDesc}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(index)}
                      title="Modifier la règle"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(index)}
                      disabled={isPending}
                      title="Supprimer la règle"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {/* Conditions d'application */}
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Conditions</span>
                    <p className="font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {conditionText}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Description</span>
                    <p className="font-medium truncate" title={regle.description || 'Aucune description'}>
                      {regle.description || '—'}
                    </p>
                  </div>

                  {/* Statut détaillé */}
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Portée</span>
                    <p className="font-medium text-muted-foreground">Toutes les interventions</p>
                    <p className="text-xs text-muted-foreground">(s'applique à toutes les agences)</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Message d'exemple */}
      {reglesList.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium">Exemple d'application</p>
            <p>
              Une intervention de <strong>3 heures</strong> avec un technicien à <strong>8 €/h</strong> et <strong>2 pièces à 10 €</strong> :
              <br />
              Coût de base = (3 × 8) + (2 × 10) = <strong>44 €</strong>.
              <br />
              Si une règle de <strong>remise de 10 %</strong> (durée min = 2h) est active, le coût final est <strong>44 × 0.9 = 39.6 €</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};