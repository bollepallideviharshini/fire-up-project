import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import {
  Search,
  UserPlus,
  FileDown,
  Eye,
  Edit,
  Trash2,
  Filter
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Employees() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.department === departmentFilter);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeToDelete);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Employee deleted successfully',
      });

      fetchEmployees();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Position', 'Status', 'Hire Date'];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(emp =>
        [
          emp.employee_id,
          `${emp.first_name} ${emp.last_name}`,
          emp.email,
          emp.department,
          emp.position,
          emp.status,
          emp.hire_date
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    
    toast({
      title: 'Success',
      description: 'Employee data exported successfully',
    });
  };

  // Get unique departments
  const departments = Array.from(new Set(employees.map((emp) => emp.department)));

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <FileDown className="h-4 w-4" />
              Export CSV
            </Button>
            {isAdmin && (
              <Link to="/employees/new">
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Employee
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employees Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading employees...</p>
          </div>
        ) : currentEmployees.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No employees found</p>
              {isAdmin && (
                <Link to="/employees/new">
                  <Button className="mt-4" size="sm">
                    Add Employee
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {employee.first_name[0]}{employee.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {employee.first_name} {employee.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {employee.employee_id}
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
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Position:</span> {employee.position}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Department:</span> {employee.department}
                      </p>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/employees/${employee.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      {isAdmin && (
                        <>
                          <Link to={`/employees/${employee.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive"
                            onClick={() => {
                              setEmployeeToDelete(employee.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the employee
              record from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
