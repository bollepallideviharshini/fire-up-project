import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Shield, Users, BarChart3, Lock, Zap, Cloud } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              EmployeeHub
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Modern Employee Management System
          </p>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your HR operations with our comprehensive employee management solution. 
            Track employees, manage departments, and access insights all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
            <p className="text-muted-foreground">
              Comprehensive CRUD operations with search, filter, and pagination capabilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
            <p className="text-muted-foreground">
              Secure authentication with Admin and User roles for granular access control.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dashboard Analytics</h3>
            <p className="text-muted-foreground">
              Real-time statistics and insights about your workforce at a glance.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">File Upload</h3>
            <p className="text-muted-foreground">
              Easy profile picture uploads with secure cloud storage integration.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Export Data</h3>
            <p className="text-muted-foreground">
              Export employee data to CSV format for external processing and reporting.
            </p>
          </div>

          <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-muted-foreground">
              Built with security best practices and powered by enterprise-grade infrastructure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
