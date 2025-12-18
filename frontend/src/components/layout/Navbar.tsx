import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, ShoppingCart, Phone, User, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/rooms', label: 'Rooms' },
  { path: '/events', label: 'Events' },
  { path: '/about', label: 'About' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isHomePage
          ? 'bg-transparent'
          : 'bg-background/95 backdrop-blur-md shadow-soft'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">OP</span>
            </div>
            <span
              className={cn(
                'font-display text-xl font-semibold hidden sm:block',
                isHomePage ? 'text-primary-foreground' : 'text-foreground'
              )}
            >
              Orchid Petals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-medium transition-colors duration-200 relative group',
                  isHomePage
                    ? 'text-primary-foreground/80 hover:text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                  location.pathname === link.path &&
                    (isHomePage ? 'text-primary-foreground' : 'text-foreground')
                )}
              >
                {link.label}
                <span
                  className={cn(
                    'absolute -bottom-1 left-0 h-0.5 transition-all duration-300',
                    isHomePage ? 'bg-accent' : 'bg-primary',
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className={cn(
                'hidden lg:flex items-center gap-2 text-sm font-medium',
                isHomePage ? 'text-primary-foreground/80' : 'text-muted-foreground'
              )}
            >
              <Phone className="w-4 h-4" />
              +91 98765 43210
            </a>

            <Link to="/cart" className="relative">
              <Button
                variant={isHomePage ? 'ghost' : 'outline'}
                size="icon"
                className={cn(
                  'relative',
                  isHomePage && 'text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isHomePage ? 'ghost' : 'outline'}
                    size="icon"
                    className={cn(
                      isHomePage && 'text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10'
                    )}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  variant={isHomePage ? 'ghost' : 'outline'}
                  size="sm"
                  className={cn(
                    isHomePage && 'text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10'
                  )}
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn('md:hidden', isHomePage && 'text-primary-foreground')}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-4 bg-card rounded-xl p-6 shadow-elevated">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'font-medium py-2 transition-colors',
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border" />
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 font-medium text-primary"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="font-medium text-primary"
                >
                  Sign In
                </Link>
              )}
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};