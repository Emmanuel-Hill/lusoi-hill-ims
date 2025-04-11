
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, UserRole, ModuleAccess } from '@/types';
import { formatDate } from '@/utils/formatUtils';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, Check, X } from 'lucide-react';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, hasAccess } = useAppContext();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'ProductionManager' as UserRole,
    active: true,
    moduleAccess: {
      dashboard: true,
      batches: false,
      eggCollection: false,
      feedManagement: false,
      vaccination: false,
      sales: false,
      customers: false,
      calendar: false,
      reports: false,
      userManagement: false
    } as ModuleAccess
  });
  
  // Generate email from name
  const generateEmail = (name: string): string => {
    // Remove any special characters and spaces, convert to lowercase
    const cleanName = name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
    return `${cleanName}@lusoihillfarm.co.ke`;
  };

  // Handle name change and auto-generate email
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setNewUser({
      ...newUser,
      name,
      email: generateEmail(name)
    });
  };
  
  // Handle email change for direct modifications
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      email: e.target.value
    });
  };
  
  // Handle name change and auto-generate email for edit mode
  const handleEditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) return;
    
    const name = e.target.value;
    setSelectedUser({
      ...selectedUser,
      name,
      email: generateEmail(name)
    });
  };
  
  // Handle email change for direct modifications in edit mode
  const handleEditEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedUser) return;
    
    setSelectedUser({
      ...selectedUser,
      email: e.target.value
    });
  };
  
  // Handle role templates
  const applyRoleTemplate = (role: UserRole) => {
    let moduleAccess: ModuleAccess = {
      dashboard: true,
      batches: false,
      eggCollection: false,
      feedManagement: false,
      vaccination: false,
      sales: false,
      customers: false,
      calendar: false,
      reports: false,
      userManagement: false
    };
    
    switch(role) {
      case 'Admin':
      case 'OperationsManager':
      case 'Owner':
      case 'ITSpecialist':
        // Full access for these roles
        Object.keys(moduleAccess).forEach(key => {
          moduleAccess[key as keyof ModuleAccess] = true;
        });
        break;
      case 'ProductionManager':
        moduleAccess = {
          ...moduleAccess,
          batches: true,
          eggCollection: true,
          feedManagement: true,
          vaccination: true,
          calendar: true,
          reports: true
        };
        break;
      case 'SalesManager':
        moduleAccess = {
          ...moduleAccess,
          sales: true,
          customers: true,
          calendar: true,
          reports: true
        };
        break;
      case 'WarehouseManager':
        moduleAccess = {
          ...moduleAccess,
          batches: true,
          eggCollection: true,
          calendar: true
        };
        break;
    }
    
    if (isEditDialogOpen && selectedUser) {
      setSelectedUser({
        ...selectedUser,
        role,
        moduleAccess
      });
    } else {
      setNewUser({
        ...newUser,
        role,
        moduleAccess
      });
    }
  };
  
  // Handle form submission for adding a new user
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Name and email are required');
      return;
    }
    
    addUser(newUser);
    toast.success('User added successfully');
    setIsAddDialogOpen(false);
    resetNewUserForm();
  };
  
  // Handle form submission for editing a user
  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    updateUser(selectedUser);
    toast.success('User updated successfully');
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };
  
  // Handle user deletion
  const handleDeleteUser = (id: string) => {
    deleteUser(id);
    toast.success('User deleted successfully');
  };
  
  // Reset new user form
  const resetNewUserForm = () => {
    setNewUser({
      name: '',
      email: '',
      role: 'ProductionManager',
      active: true,
      moduleAccess: {
        dashboard: true,
        batches: false,
        eggCollection: false,
        feedManagement: false,
        vaccination: false,
        sales: false,
        customers: false,
        calendar: false,
        reports: false,
        userManagement: false
      }
    });
  };
  
  // Open edit dialog and set selected user
  const openEditDialog = (user: User) => {
    setSelectedUser({...user});
    setIsEditDialogOpen(true);
  };
  
  // Handle module access toggle
  const toggleModuleAccess = (module: keyof ModuleAccess, value: boolean) => {
    if (isEditDialogOpen && selectedUser) {
      setSelectedUser({
        ...selectedUser,
        moduleAccess: {
          ...selectedUser.moduleAccess,
          [module]: value
        }
      });
    } else {
      setNewUser({
        ...newUser,
        moduleAccess: {
          ...newUser.moduleAccess,
          [module]: value
        }
      });
    }
  };
  
  if (!hasAccess('userManagement')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You do not have permission to access the User Management module.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and access control</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account and assign permissions</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter user name" 
                    value={newUser.name}
                    onChange={handleNameChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email will be auto-generated" 
                    value={newUser.email}
                    onChange={handleEmailChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Email will be auto-generated using the domain lusoihillfarm.co.ke
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value: UserRole) => {
                      applyRoleTemplate(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="ProductionManager">Production Manager</SelectItem>
                      <SelectItem value="OperationsManager">Operations Manager</SelectItem>
                      <SelectItem value="Owner">Owner</SelectItem>
                      <SelectItem value="ITSpecialist">IT Specialist</SelectItem>
                      <SelectItem value="SalesManager">Sales Manager</SelectItem>
                      <SelectItem value="WarehouseManager">Warehouse Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="active" 
                    checked={newUser.active}
                    onCheckedChange={(checked) => 
                      setNewUser({...newUser, active: checked as boolean})
                    }
                  />
                  <Label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Active Account
                  </Label>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h3 className="text-sm font-semibold mb-3">Module Access</h3>
                <div className="space-y-2">
                  {Object.keys(newUser.moduleAccess).map((module) => (
                    <div key={module} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`module-${module}`} 
                        checked={newUser.moduleAccess[module as keyof ModuleAccess]}
                        onCheckedChange={(checked) => 
                          toggleModuleAccess(module as keyof ModuleAccess, checked as boolean)
                        }
                      />
                      <Label htmlFor={`module-${module}`} className="text-sm capitalize">
                        {module === 'eggCollection' ? 'Egg Collection' : 
                          module === 'feedManagement' ? 'Feed Management' : 
                          module === 'userManagement' ? 'User Management' : module}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage system users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                  <TableCell>
                    {user.active ? (
                      <Badge variant="success" className="bg-green-500 hover:bg-green-600">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details and permissions</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedUser.name}
                    onChange={handleEditNameChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    type="email" 
                    value={selectedUser.email}
                    onChange={handleEditEmailChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Email will be auto-generated using the domain lusoihillfarm.co.ke when name is changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value: UserRole) => {
                      applyRoleTemplate(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="ProductionManager">Production Manager</SelectItem>
                      <SelectItem value="OperationsManager">Operations Manager</SelectItem>
                      <SelectItem value="Owner">Owner</SelectItem>
                      <SelectItem value="ITSpecialist">IT Specialist</SelectItem>
                      <SelectItem value="SalesManager">Sales Manager</SelectItem>
                      <SelectItem value="WarehouseManager">Warehouse Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="edit-active" 
                    checked={selectedUser.active}
                    onCheckedChange={(checked) => 
                      setSelectedUser({...selectedUser, active: checked as boolean})
                    }
                  />
                  <Label htmlFor="edit-active">
                    Active Account
                  </Label>
                </div>
              </div>
              
              <div className="border rounded-lg p-3">
                <h3 className="text-sm font-semibold mb-3">Module Access</h3>
                <div className="space-y-2">
                  {Object.keys(selectedUser.moduleAccess).map((module) => (
                    <div key={module} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit-module-${module}`} 
                        checked={selectedUser.moduleAccess[module as keyof ModuleAccess]}
                        onCheckedChange={(checked) => 
                          toggleModuleAccess(module as keyof ModuleAccess, checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-module-${module}`} className="text-sm capitalize">
                        {module === 'eggCollection' ? 'Egg Collection' : 
                          module === 'feedManagement' ? 'Feed Management' : 
                          module === 'userManagement' ? 'User Management' : module}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
