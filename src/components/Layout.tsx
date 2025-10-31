import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  Shield,
  User as UserIcon
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', href: '/employees', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <Shield className="h-6 w-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                EmployeeHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user?.email}</span>
              {isAdmin && (
                <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  Admin
                </span>
              )}
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="hidden md:flex gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex flex-col gap-1 pb-4 border-b">
                    <p className="text-sm font-medium">{user?.email}</p>
                    {isAdmin && (
                      <span className="text-xs text-primary">Administrator</span>
                    )}
                  </div>
                  
                  <nav className="flex flex-col gap-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setOpen(false)}
                      >
                        <Button
                          variant={isActive(item.href) ? 'default' : 'ghost'}
                          className="w-full justify-start gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}
