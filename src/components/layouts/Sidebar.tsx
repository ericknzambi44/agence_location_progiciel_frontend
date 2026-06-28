import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Users,
  Wrench,
  Building2,
  Settings,
  FileText,
  DollarSign,
  UserCog,
  Boxes,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

const navItems = [
  { type: 'link' as const, path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, color: 'text-blue-500' },
  { type: 'divider' as const },
  { type: 'link' as const, path: '/stock', label: 'Stock', icon: Package, color: 'text-emerald-500' },
  { type: 'divider' as const },
  { type: 'link' as const, path: '/rh', label: 'RH', icon: Users, color: 'text-teal-500' },
  { type: 'divider' as const },
  { type: 'link' as const, path: '/maintenance', label: 'Maintenance', icon: Wrench, color: 'text-amber-500' },
  { type: 'link' as const, path: '/maintenance/techniciens', label: 'Techniciens', icon: UserCog, color: 'text-amber-400' },
  { type: 'link' as const, path: '/maintenance/pieces', label: 'Pièces', icon: Boxes, color: 'text-amber-400' },
  { type: 'link' as const, path: '/maintenance/regles-maintenance', label: 'Règles maintenance', icon: Settings, color: 'text-amber-400' },
  { type: 'divider' as const },
  { type: 'link' as const, path: '/location/clients', label: 'Clients', icon: Users, color: 'text-purple-500' },
  { type: 'link' as const, path: '/location/contrats', label: 'Contrats', icon: ClipboardList, color: 'text-purple-400' },
  { type: 'link' as const, path: '/location/tarification', label: 'Tarification location', icon: DollarSign, color: 'text-purple-400' },
  { type: 'divider' as const },
  { type: 'link' as const, path: '/administration', label: 'Agences', icon: Building2, color: 'text-slate-500' },
  { type: 'link' as const, path: '/administration/modules', label: 'Modules', icon: Settings, color: 'text-slate-400' },
  { type: 'link' as const, path: '/statistiques', label: 'Statistiques', icon: BarChart3, color: 'text-indigo-500' }
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  return (
    <aside
      className={cn(
        'h-screen border-r bg-card transition-all duration-300 flex flex-col',
        open ? 'w-64' : 'w-16'
      )}
    >
      {/* En-tête */}
      <div className="p-3 flex items-center justify-between border-b">
        <h2 className={cn(
          'font-bold text-xl transition-opacity duration-300 whitespace-nowrap overflow-hidden',
          !open && 'opacity-0 w-0'
        )}>
          Progiciel
        </h2>
        {!open && (
          <span className="text-xl font-bold text-primary mx-auto">P</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-1">
        {navItems.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <div
                key={`divider-${index}`}
                className={cn(
                  'h-px bg-border my-2',
                  !open && 'mx-auto w-8'
                )}
              />
            );
          }

          const { path, label, icon: Icon, color } = item;

          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-accent hover:text-accent-foreground',
                  !open && 'justify-center'
                )
              }
              title={!open ? label : undefined}
            >
              <Icon
                size={20}
                className={cn(
                  'shrink-0',
                  !open && 'mx-auto',
                  color
                )}
              />
              <span
                className={cn(
                  'text-sm whitespace-nowrap overflow-hidden transition-all duration-200',
                  open ? 'max-w-full opacity-100' : 'max-w-0 opacity-0'
                )}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};