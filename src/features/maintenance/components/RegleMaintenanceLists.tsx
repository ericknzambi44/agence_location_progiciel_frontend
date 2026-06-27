import { useState } from 'react';
import { useReglesMaintenance, useUpdateReglesMaintenance } from '../hooks/useMaintenance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Loader2, Settings } from 'lucide-react';
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Règles de tarification maintenance
          </h2>
          <p className="text-sm text-muted-foreground">
            Configurez les remises, majorations et forfaits pour les interventions.
          </p>
        </div>
        <Button onClick={() => { setEditingIndex(null); setShowForm(true); }} className="btn-elite">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une règle
        </Button>
      </div>

      {reglesList.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucune règle définie.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reglesList.map((regle, index) => (
            <Card key={index} className="card-glass">
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg capitalize">
                    <Badge className={`mr-2 ${typeColors[regle.type]}`}>
                      {typeLabels[regle.type]}
                    </Badge>
                    {regle.type === 'forfait' ? `${regle.valeur} €` : `${regle.valeur} %`}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{regle.description || 'Sans description'}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(index)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(index)} disabled={isPending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Durée min</span>
                  <p>{regle.duree_min} h</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Durée max</span>
                  <p>{regle.duree_max ?? 'Illimitée'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Actif</span>
                  <Badge variant={regle.active !== false ? 'default' : 'secondary'}>
                    {regle.active !== false ? 'Oui' : 'Non'}
                  </Badge>
                </div>
                {regle.periode_debut || regle.periode_fin ? (
                  <div>
                    <span className="text-muted-foreground">Période</span>
                    <p>{regle.periode_debut || 'Début'} → {regle.periode_fin || 'Fin'}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};