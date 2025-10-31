import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    onLeave: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch employee statistics
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (employees) {
        setStats({
          total: employees.length,
          active: employees.filter(e => e.status === 'active').length,
          inactive: employees.filter(e => e.status === 'inactive').length,
          onLeave: employees.filter(e => e.status === 'on_leave').length,
        });

        setRecentEmployees(employees.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.total,
      icon: Users,
      description: 'All registered employees',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active',
      value: stats.active,
      icon: UserCheck,
      description: 'Currently working',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'On Leave',
      value: stats.onLeave,
      icon: TrendingUp,
      description: 'Employees on leave',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Inactive',
      value: stats.inactive,
      icon: UserX,
      description: 'Not currently employed',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your employee management system
            </p>
          </div>
          {isAdmin && (
            <Link to="/employees/new">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Employee
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="transition-all hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? '...' : stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Employees */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recent Employees
                </CardTitle>
                <CardDescription>
                  Latest additions to your workforce
                </CardDescription>
              </div>
              <Link to="/employees">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : recentEmployees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No employees added yet</p>
                {isAdmin && (
                  <Link to="/employees/new">
                    <Button className="mt-4" size="sm">
                      Add Your First Employee
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recentEmployees.map((employee) => (
                  <Link
                    key={employee.id}
                    to={`/employees/${employee.id}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {employee.first_name[0]}{employee.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {employee.first_name} {employee.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {employee.position} • {employee.department}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        employee.status === 'active'
                          ? 'default'
                          : employee.status === 'on_leave'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {employee.status.replace('_', ' ')}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
