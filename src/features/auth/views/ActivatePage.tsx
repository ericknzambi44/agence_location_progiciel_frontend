import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const ActivatePage = () => {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const { activate } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (uid && token) {
      activate(uid, token)
        .then(() => {
          setStatus('success');
          setMessage('✅ Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.');
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.response?.data?.error || '❌ Lien d\'activation invalide ou expiré.');
        });
    }
  }, [uid, token, activate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4">
        <Card className="w-full max-w-md card-glass">
          <CardContent className="flex items-center justify-center gap-3 p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span>Activation en cours...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4">
      <Card className="w-full max-w-md card-glass">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'success' ? '✅ Compte activé' : '❌ Échec de l\'activation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">{message}</p>
          {status === 'success' && (
            <Link to="/login" className="text-primary hover:underline">
              Se connecter
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};