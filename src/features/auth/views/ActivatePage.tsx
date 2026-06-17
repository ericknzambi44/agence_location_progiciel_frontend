import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ActivatePage = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { activate } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (uid && token) {
      activate(uid, token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    }
  }, [uid, token, activate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Activation en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'success' ? '✅ Compte activé' : '❌ Échec de l\'activation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'success' ? (
            <p>Votre compte est activé. Vous pouvez maintenant <Link to="/login" className="text-primary hover:underline">vous connecter</Link>.</p>
          ) : (
            <p>Le lien d'activation est invalide ou expiré. Veuillez réessayer.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};