import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await register(form);
      setMessage('Un email de confirmation vous a été envoyé. Vérifiez votre boîte mail.');
    } catch (err) {
      setError('Erreur lors de l\'inscription. Vérifiez les champs.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 p-4">
      <Card className="w-full max-w-md card-glass">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="username" placeholder="Nom d'utilisateur" value={form.username} onChange={handleChange} required />
            <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
            <Input name="password" placeholder="Mot de passe" type="password" value={form.password} onChange={handleChange} required />
            <div className="grid grid-cols-2 gap-2">
              <Input name="first_name" placeholder="Prénom" value={form.first_name} onChange={handleChange} />
              <Input name="last_name" placeholder="Nom" value={form.last_name} onChange={handleChange} />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            {message && <p className="text-primary text-sm">{message}</p>}
            <Button type="submit" className="w-full btn-elite">S'inscrire</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ? <Link to="/login" className="text-primary hover:underline">Connectez-vous</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};