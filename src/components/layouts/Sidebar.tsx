import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package, Users, Wrench, Building2 } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/stock', label: 'Stock', icon: Package },
  { path: '/rh', label: 'RH', icon: Users },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/administration', label: 'Administration', icon: Building2 },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/**
 * Barre latérale de navigation. S'ouvre/se ferme au clic sur le bouton du header.
 * En mode fermé, seule l'icône est visible.
 */
export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "h-screen border-r bg-card transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <h2 className={cn("font-bold text-xl transition-opacity", !open && "opacity-0")}>
          Progiciel
        </h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground",
                !open && "justify-center"
              )
            }
            title={!open ? label : undefined}
          >
            <Icon size={20} />
            <span className={cn(!open && "hidden")}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};