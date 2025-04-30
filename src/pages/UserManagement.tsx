import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { User, UserRole, ModuleAccess } from '@/types';
import { CheckCheck } from "lucide-react";

const defaultModuleAccess: ModuleAccess = {
  dashboard: true,
  batches: true,
  eggCollection: true,
  feedManagement: true,
  vaccination: true,
  sales: true,
  customers: true,
  calendar: true,
  reports: true,
  userManagement: true,
  warehouse: true,
};

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SalesTeamMember' as UserRole,
    active: true,
    moduleAccess: defaultModuleAccess,
  });

  useEffect(() => {
    if (selectedUser) {
      setUserForm({
        name: selectedUser.name,
        email: selectedUser.email,
        password: '', // Do not pre-fill password for security
        role: selectedUser.role,
        active: selectedUser.active,
        moduleAccess: selectedUser.moduleAccess,
      });
    }
  }, [selectedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value,
    });
  };

  const handleRoleChange = (role: UserRole) => {
    setUserForm({
      ...userForm,
      role: role,
    });
  };

  const handleActiveChange = (active: boolean) => {
    setUserForm({
      ...userForm,
      active: active,
    });
  };

  const handleModuleAccessChange = (module: keyof ModuleAccess, checked: boolean) => {
    setUserForm({
      ...userForm,
      moduleAccess: {
        ...userForm.moduleAccess,
        [module]: checked,
      },
    });
  };

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    addUser({
      id: crypto.randomUUID(),
      name: userForm.name,
      email: userForm.email,
      password: userForm.password,
      role: userForm.role,
      active: userForm.active,
      moduleAccess: userForm.moduleAccess,
      initialLoginComplete: false,
      createdAt: new Date().toISOString(), // Add createdAt field
    });

    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'SalesTeamMember',
      active: true,
      moduleAccess: defaultModuleAccess,
    });

    setIsAddDialogOpen(false);
    toast.success('User added successfully');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    const updatedUser = {
      ...selectedUser,
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      active: userForm.active,
      moduleAccess: userForm.moduleAccess,
    };

    updateUser(updatedUser);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
    toast.success('User deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={userForm.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={userForm.password}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select onValueChange={(value) => handleRoleChange(value as UserRole)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="ProductionManager">Production Manager</SelectItem>
                    <SelectItem value="OperationsManager">Operations Manager</SelectItem>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="ITSpecialist">IT Specialist</SelectItem>
                    <SelectItem value="SalesManager">Sales Manager</SelectItem>
                    <SelectItem value="SalesTeamMember">Sales Team Member</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="WarehouseManager">Warehouse Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">Active</Label>
                <Switch
                  id="active"
                  checked={userForm.active}
                  onCheckedChange={handleActiveChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <ModuleAccessForm 
              moduleAccess={userForm.moduleAccess}
              onModuleAccessChange={handleModuleAccessChange}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>
                Add User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.active ? (
                      <Badge variant="outline">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-destructive"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit an existing user account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                value={userForm.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select value={userForm.role} onValueChange={(value) => handleRoleChange(value as UserRole)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="ProductionManager">Production Manager</SelectItem>
                  <SelectItem value="OperationsManager">Operations Manager</SelectItem>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="ITSpecialist">IT Specialist</SelectItem>
                  <SelectItem value="SalesManager">Sales Manager</SelectItem>
                  <SelectItem value="SalesTeamMember">Sales Team Member</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="WarehouseManager">Warehouse Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">Active</Label>
              <Switch
                id="active"
                checked={userForm.active}
                onCheckedChange={handleActiveChange}
                className="col-span-3"
              />
            </div>
          </div>
          <ModuleAccessForm 
            moduleAccess={userForm.moduleAccess}
            onModuleAccessChange={handleModuleAccessChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedUser(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ModuleAccessFormProps {
  moduleAccess: ModuleAccess;
  onModuleAccessChange: (module: keyof ModuleAccess, checked: boolean) => void;
}

const ModuleAccessForm: React.FC<ModuleAccessFormProps> = ({ moduleAccess, onModuleAccessChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Module Access</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(moduleAccess).map(([module, hasAccess]) => (
          <div key={module} className="flex items-center space-x-2">
            <Switch
              id={module}
              checked={hasAccess}
              onCheckedChange={(checked) => onModuleAccessChange(module as keyof ModuleAccess, checked)}
            />
            <Label htmlFor={module}>{module.charAt(0).toUpperCase() + module.slice(1)}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
}

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variant === "default" && "bg-primary/10 text-primary-foreground",
          variant === "secondary" && "bg-secondary/10 text-secondary-foreground",
          variant === "destructive" && "bg-destructive/10 text-destructive-foreground",
          variant === "outline" && "text-foreground",
          variant === "success" && "bg-green-100 text-green-500",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export default UserManagement;
