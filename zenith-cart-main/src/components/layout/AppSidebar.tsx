import {
  LayoutDashboard, Package, ShoppingCart, ClipboardList,
  CreditCard, MessageSquare, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useState } from 'react';

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Products', url: '/products', icon: Package },
  { title: 'Cart', url: '/cart', icon: ShoppingCart },
  { title: 'Orders', url: '/orders', icon: ClipboardList },
  { title: 'Payments', url: '/payments', icon: CreditCard },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col bg-secondary text-secondary-foreground transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === '/'}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary-foreground/70 hover:bg-sidebar-accent hover:text-secondary-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-primary"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-sidebar-border text-secondary-foreground/50 hover:text-secondary-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
