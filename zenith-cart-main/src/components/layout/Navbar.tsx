import { Search, ShoppingCart, User, ChevronDown, LogOut, Settings, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-secondary text-secondary-foreground flex items-center px-4 gap-3 shadow-md">
      <Link to="/" className="flex items-center gap-1 shrink-0">
        <span className="text-xl font-bold text-primary">Shop</span>
        <span className="text-xl font-bold">Hub</span>
      </Link>

      <div className="flex-1 max-w-2xl mx-auto">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-4 pr-10 rounded-lg bg-card text-card-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="absolute right-0 top-0 h-9 w-10 flex items-center justify-center bg-primary rounded-r-lg hover:opacity-90 transition-opacity">
            <Search className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/cart"
          className="relative p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[1rem] flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1">
              {totalItems}
            </span>
          )}
        </Link>

        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(user.email)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline-block text-sm font-medium max-w-[120px] truncate">
                {user.email.split('@')[0]}
              </span>
              <ChevronDown className="h-3 w-3 hidden sm:block" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-lg shadow-lg border border-border py-1 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:flex">
              <Link to="/register">Sign Up</Link>
            </Button>
            <Link to="/login" className="sm:hidden p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
              <User className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
