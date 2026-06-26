import { useState } from 'react';
import { useReglesTarification, useUpdateReglesTarification } from '../hooks/useLocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Loader2, Tag, Package, Layers } from 'lucide-react';
import { RegleTarificationList } from '../types/tarification.types';
import { RegleTarificationForm } from './RegleTarificationForm';

// Couleurs par type de règle
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

export const RegleTarificationLists = () => {
  const { data: regles, isLoading, error } = useReglesTarification();
  const { mutate: updateRegles, isPending } = useUpdateReglesTarification();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Chargement des règles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-4">
        <p>Erreur de chargement des règles de tarification.</p>
        <p className="text-sm text-muted-foreground">Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  const handleDelete = (index: number) => {
    if (!regles) return;
    if (!confirm('Supprimer cette règle de tarification ?')) return;
    const newRegles = [...regles];
    newRegles.splice(index, 1);
    updateRegles(newRegles);
  };

  const handleSave = (newRegles: RegleTarificationList) => {
    updateRegles(newRegles, {
      onSuccess: () => {
        setShowForm(false);
        setEditingIndex(null);
      },
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  // Mode formulaire (édition ou création)
  if (showForm) {
    const initialData = editingIndex !== null && regles ? regles[editingIndex] : undefined;
    return (
      <RegleTarificationForm
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
      />
    );
  }

  const reglesList = regles || [];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Règles de tarification</h2>
          <p className="text-sm text-muted-foreground">
            Gérez les remises, majorations et forfaits applicables aux locations.
            {reglesList.length > 0 && ` ${reglesList.length} règle(s) active(s).`}
          </p>
        </div>
        <Button onClick={() => { setEditingIndex(null); setShowForm(true); }} className="btn-elite">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une règle
        </Button>
      </div>

      {/* Liste des règles */}
      {reglesList.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Tag className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">Aucune règle de tarification définie.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Ajouter une règle" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reglesList.map((regle, index) => {
            const isActive = regle.active !== false;
            const typeClass = typeColors[regle.type] || 'bg-gray-100 text-gray-800';
            const typeLabel = typeLabels[regle.type] || regle.type;

            return (
              <Card key={index} className={`card-glass transition-all hover:shadow-md ${!isActive ? 'opacity-60' : ''}`}>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Badge du type */}
                    <Badge className={`capitalize ${typeClass} px-3 py-1 text-sm font-medium`}>
                      {typeLabel}
                    </Badge>
                    {/* Valeur */}
                    <span className="text-lg font-bold">
                      {regle.type === 'forfait' ? `${regle.valeur} €` : `${regle.valeur} %`}
                    </span>
                    {/* Statut actif/inactif */}
                    <Badge variant={isActive ? 'default' : 'secondary'} className="ml-2">
                      {isActive ? 'Actif' : 'Inactif'}
                    </Badge>
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
                  {/* Durée */}
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Durée</span>
                    <p className="font-medium">
                      {regle.duree_min} jour{regle.duree_min > 1 ? 's' : ''}
                      {regle.duree_max !== null && regle.duree_max !== undefined
                        ? ` → ${regle.duree_max} jours`
                        : ' et +'}
                    </p>
                  </div>

                  {/* Ciblage */}
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Ciblage</span>
                    {regle.bien_id ? (
                      <p className="font-medium flex items-center gap-1">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate" title={`Bien: ${regle.bien_id}`}>
                          Bien spécifique
                        </span>
                      </p>
                    ) : regle.categorie_id ? (
                      <p className="font-medium flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate" title={`Catégorie: ${regle.categorie_id}`}>
                          Catégorie
                        </span>
                      </p>
                    ) : (
                      <p className="font-medium text-muted-foreground">Tous les biens</p>
                    )}
                  </div>

                  {/* Période */}
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Période</span>
                    {regle.periode_debut || regle.periode_fin ? (
                      <p className="font-medium">
                        {regle.periode_debut || 'Début'}
                        {regle.periode_debut && regle.periode_fin && ' → '}
                        {regle.periode_fin || 'Fin'}
                      </p>
                    ) : (
                      <p className="font-medium text-muted-foreground">Toute l'année</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Description</span>
                    <p className="font-medium truncate" title={regle.description || 'Aucune description'}>
                      {regle.description || '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};