
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { User, UserRole, ModuleAccess } from '@/types';
import { PlusCircle } from 'lucide-react';

// Import the refactored components
import UsersTable from '@/components/users/UsersTable';
import UserForm from '@/components/users/UserForm';

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
      case 'SalesTeamMember':
        moduleAccess = {
          ...moduleAccess,
          sales: true,
          customers: true,
          calendar: true
        };
        break;
      case 'Driver':
        moduleAccess = {
          ...moduleAccess,
          customers: true,
          calendar: true
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
  
  // Handle setting user active status
  const setUserActive = (active: boolean) => {
    if (isEditDialogOpen && selectedUser) {
      setSelectedUser({
        ...selectedUser,
        active
      });
    } else {
      setNewUser({
        ...newUser,
        active
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
          <UserForm
            user={newUser}
            onSubmit={handleAddUser}
            onCancel={() => setIsAddDialogOpen(false)}
            isNew={true}
            applyRoleTemplate={applyRoleTemplate}
            handleNameChange={handleNameChange}
            handleEmailChange={handleEmailChange}
            toggleModuleAccess={toggleModuleAccess}
            setUserActive={setUserActive}
          />
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage system users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable 
            users={users} 
            onEdit={openEditDialog} 
            onDelete={handleDeleteUser} 
          />
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <UserForm
            user={selectedUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setIsEditDialogOpen(false)}
            isNew={false}
            applyRoleTemplate={applyRoleTemplate}
            handleNameChange={handleEditNameChange}
            handleEmailChange={handleEditEmailChange}
            toggleModuleAccess={toggleModuleAccess}
            setUserActive={setUserActive}
          />
        </Dialog>
      )}
    </div>
  );
};

export default UserManagement;
