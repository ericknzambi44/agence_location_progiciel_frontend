import { Link } from 'react-router-dom';
import { usePieces, useSupprimerPiece } from '../hooks/useMaintenance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Pencil, Loader2, Package, Tag, DollarSign, PackageCheck } from 'lucide-react';
import { useState } from 'react';

export const PieceList = () => {
  const { data: pieces, isLoading, error, refetch } = usePieces();
  const { mutate: supprimer, isPending: isDeleting } = useSupprimerPiece();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette pièce définitivement ?')) {
      setDeletingId(id);
      supprimer(id, {
        onSuccess: () => {
          setDeletingId(null);
          refetch();
        },
        onError: () => setDeletingId(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Chargement des pièces détachées...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-6 border border-destructive/20 rounded-lg bg-destructive/5">
        <p className="font-semibold">Erreur de chargement</p>
        <p className="text-sm">Impossible de récupérer la liste des pièces.</p>
      </div>
    );
  }

  const piecesList = pieces || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Pièces détachées
          </h1>
          <p className="text-sm text-muted-foreground">
            {piecesList.length} pièce{piecesList.length > 1 ? 's' : ''} en stock
          </p>
        </div>
        <Link to="/maintenance/pieces/nouvelle">
          <Button className="btn-elite w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Ajouter une pièce
          </Button>
        </Link>
      </div>

      {/* Liste */}
      {piecesList.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg border-muted-foreground/20">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">Aucune pièce détachée enregistrée.</p>
          <p className="text-sm text-muted-foreground">Cliquez sur "Ajouter une pièce" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {piecesList.map((piece) => {
            const isLowStock = piece.stock <= 5 && piece.stock > 0;
            const isOutOfStock = piece.stock === 0;
            // Convertir le prix en nombre pour éviter l'erreur toFixed()
            const prix = typeof piece.prix_unitaire === 'string' 
              ? parseFloat(piece.prix_unitaire) 
              : piece.prix_unitaire;

            return (
              <Card key={piece.id} className="card-glass hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row justify-between items-start">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg truncate" title={piece.nom}>
                      {piece.nom}
                    </CardTitle>
                  </div>
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
                      disabled={isDeleting && deletingId === piece.id}
                      title="Supprimer"
                    >
                      {isDeleting && deletingId === piece.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-xs">{piece.reference}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-primary">
                      {isNaN(prix) ? '—' : prix.toFixed(2)} €
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PackageCheck className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Stock: <span className="font-medium">{piece.stock}</span>
                      </span>
                    </div>
                    {isLowStock && !isOutOfStock && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300">
                        Stock faible
                      </Badge>
                    )}
                    {isOutOfStock && (
                      <Badge variant="destructive">Rupture</Badge>
                    )}
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