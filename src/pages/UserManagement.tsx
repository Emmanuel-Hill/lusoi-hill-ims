
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { User, UserRole, ModuleAccess } from '@/types';
import UsersTable from '@/components/users/UsersTable';
import UserForm from '@/components/users/UserForm';

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
    password: 'password123',
    role: 'SalesTeamMember' as UserRole,
    active: true,
    moduleAccess: { ...defaultModuleAccess },
  });

  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: 'password123',
      role: 'SalesTeamMember' as UserRole,
      active: true,
      moduleAccess: { ...defaultModuleAccess },
    });
  };

  // Set up selected user in the form
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      active: user.active,
      moduleAccess: { ...user.moduleAccess },
    });
    setIsEditDialogOpen(true);
  };

  // Form handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, name: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, email: e.target.value });
  };

  const handleTempPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({ ...userForm, password: e.target.value });
  };

  const toggleModuleAccess = (module: keyof ModuleAccess, value: boolean) => {
    setUserForm({
      ...userForm,
      moduleAccess: { ...userForm.moduleAccess, [module]: value },
    });
  };

  const setUserActive = (active: boolean) => {
    setUserForm({ ...userForm, active });
  };

  const applyRoleTemplate = (role: UserRole) => {
    setUserForm({
      ...userForm,
      role,
      moduleAccess: getRoleBasedPermissions(role),
    });
  };

  // Role-based permissions
  const getRoleBasedPermissions = (role: UserRole): ModuleAccess => {
    const baseAccess = { ...defaultModuleAccess };
    
    switch (role) {
      case 'Admin':
      case 'Owner':
      case 'ITSpecialist':
      case 'OperationsManager':
        return baseAccess; // Full access
        
      case 'ProductionManager':
        return {
          ...baseAccess,
          userManagement: false,
          sales: false,
          customers: false,
        };
        
      case 'SalesManager':
        return {
          ...baseAccess,
          feedManagement: false,
          vaccination: false,
          userManagement: false,
        };
        
      case 'SalesTeamMember':
        return {
          dashboard: true,
          batches: false,
          eggCollection: false,
          feedManagement: false,
          vaccination: false,
          sales: true,
          customers: true,
          calendar: true,
          reports: false,
          userManagement: false,
          warehouse: false,
        };
        
      case 'Driver':
        return {
          dashboard: true,
          batches: false,
          eggCollection: false,
          feedManagement: false,
          vaccination: false,
          sales: false,
          customers: true,
          calendar: true,
          reports: false,
          userManagement: false,
          warehouse: true,
        };
        
      case 'WarehouseManager':
        return {
          dashboard: true,
          batches: true,
          eggCollection: true,
          feedManagement: true,
          vaccination: false,
          sales: true,
          customers: false,
          calendar: true,
          reports: true,
          userManagement: false,
          warehouse: true,
        };
        
      default:
        return baseAccess;
    }
  };

  // CRUD operations
  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: userForm.name,
      email: userForm.email,
      password: userForm.password,
      role: userForm.role,
      active: userForm.active,
      moduleAccess: userForm.moduleAccess,
      initialLoginComplete: false,
      createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success('User added successfully');
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
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add User
          </Button>
          
          {isAddDialogOpen && (
            <UserForm 
              user={userForm}
              onSubmit={handleAddUser}
              onCancel={() => setIsAddDialogOpen(false)}
              isNew={true}
              applyRoleTemplate={applyRoleTemplate}
              handleNameChange={handleNameChange}
              handleEmailChange={handleEmailChange}
              handleTempPasswordChange={handleTempPasswordChange}
              toggleModuleAccess={toggleModuleAccess}
              setUserActive={setUserActive}
            />
          )}
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable 
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {isEditDialogOpen && selectedUser && (
          <UserForm 
            user={userForm}
            onSubmit={handleUpdateUser}
            onCancel={() => {
              setIsEditDialogOpen(false);
              setSelectedUser(null);
            }}
            isNew={false}
            applyRoleTemplate={applyRoleTemplate}
            handleNameChange={handleNameChange}
            handleEmailChange={handleEmailChange}
            toggleModuleAccess={toggleModuleAccess}
            setUserActive={setUserActive}
          />
        )}
      </Dialog>
    </div>
  );
};

export default UserManagement;
