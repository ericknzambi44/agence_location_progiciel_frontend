
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ThemeToggle } from '../ThemeToggle';

interface HeaderProps {
  toggleSidebar: () => void;
}

/**
 * En-tête de l'application avec le bouton de menu, le toggle de thème et la déconnexion.
 */
export const Header = ({ toggleSidebar }: HeaderProps) => {
  const { logout } = useAuth();
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Ouvrir le menu">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Se déconnecter">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};