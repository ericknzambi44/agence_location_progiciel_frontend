import { Link } from 'react-router-dom';
import { usePieces, useSupprimerPiece } from '../hooks/useMaintenance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import { useState } from 'react';

export const PieceList = () => {
  const { data: pieces, isLoading, error, refetch } = usePieces();
  const { mutate: supprimer, isPending: isDeleting } = useSupprimerPiece();

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette pièce ?')) {
      supprimer(id, { onSuccess: () => refetch() });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des pièces...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-center p-4">Erreur de chargement.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Pièces détachées</h1>
        {/* LIEN VERS LE FORMULAIRE DE CRÉATION */}
        <Link to="/maintenance/pieces/nouvelle">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une pièce
          </Button>
        </Link>
      </div>

      {pieces?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Aucune pièce enregistrée.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pieces?.map((piece) => (
            <Card key={piece.id} className="card-glass">
              <CardHeader className="flex flex-row justify-between items-start">
                <CardTitle className="text-lg">{piece.nom}</CardTitle>
                <div className="flex gap-1">
                  <Link to={`modifier/${piece.id}`}>
                    <Button variant="ghost" size="icon" title="Modifier">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(piece.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>Réf: {piece.reference}</p>
                <p className="font-semibold">{piece.prix_unitaire} €</p>
                <p>Stock: {piece.stock}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};