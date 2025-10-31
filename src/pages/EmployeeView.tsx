import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building2,
  User,
  AlertCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { format } from 'date-fns';

export default function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Employee not found</p>
          <Button onClick={() => navigate('/employees')} className="mt-4">
            Back to Employees
          </Button>
        </div>
      </Layout>
    );
  }

  const InfoItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/employees')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Employee Details
              </h1>
              <p className="text-muted-foreground">
                View complete employee information
              </p>
            </div>
          </div>
          {isAdmin && (
            <Link to={`/employees/${id}/edit`}>
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Employee
              </Button>
            </Link>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                {employee.profile_picture_url ? (
                  <img
                    src={employee.profile_picture_url}
                    alt={`${employee.first_name} ${employee.last_name}`}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">
                      {employee.first_name[0]}{employee.last_name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {employee.first_name} {employee.last_name}
                  </h2>
                  <p className="text-muted-foreground">
                    {employee.position} • {employee.department}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{employee.employee_id}</Badge>
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
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={employee.email}
                  />
                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={employee.phone}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <InfoItem
                icon={Building2}
                label="Department"
                value={employee.department}
              />
              <InfoItem
                icon={User}
                label="Position"
                value={employee.position}
              />
              <InfoItem
                icon={Calendar}
                label="Hire Date"
                value={employee.hire_date ? format(new Date(employee.hire_date), 'PPP') : 'N/A'}
              />
              {employee.salary && (
                <InfoItem
                  icon={DollarSign}
                  label="Salary"
                  value={new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(employee.salary)}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        {(employee.address || employee.city || employee.state || employee.zip_code) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employee.address && <p>{employee.address}</p>}
                {(employee.city || employee.state || employee.zip_code) && (
                  <p>
                    {[employee.city, employee.state, employee.zip_code]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact */}
        {(employee.emergency_contact_name || employee.emergency_contact_phone) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {employee.emergency_contact_name && (
                  <InfoItem
                    icon={User}
                    label="Contact Name"
                    value={employee.emergency_contact_name}
                  />
                )}
                {employee.emergency_contact_phone && (
                  <InfoItem
                    icon={Phone}
                    label="Contact Phone"
                    value={employee.emergency_contact_phone}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {employee.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {employee.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
