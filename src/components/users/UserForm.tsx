
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UserRole, ModuleAccess } from '@/types';
import { allModules } from '@/context/ModuleAccessContext';

// Define the component props
interface UserFormProps {
  user: {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    active: boolean;
    moduleAccess: ModuleAccess;
  };
  onSubmit: () => void;
  onCancel: () => void;
  isNew: boolean;
  applyRoleTemplate: (role: UserRole) => void;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTempPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleModuleAccess: (module: keyof ModuleAccess, value: boolean) => void;
  setUserActive: (active: boolean) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isNew,
  applyRoleTemplate,
  handleNameChange,
  handleEmailChange,
  handleTempPasswordChange,
  toggleModuleAccess,
  setUserActive,
}) => {
  // Available user roles
  const userRoles: UserRole[] = [
    'Admin',
    'OperationsManager',
    'Owner',
    'ProductionManager',
    'SalesManager',
    'SalesTeamMember',
    'Driver',
    'WarehouseManager',
    'ITSpecialist',
  ];

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isNew ? 'Add New User' : 'Edit User'}</DialogTitle>
        <DialogDescription>
          {isNew
            ? 'Create a new user account and set their access permissions.'
            : 'Update user details and access permissions.'}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {/* User Details */}
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">User Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={user.name}
                onChange={handleNameChange}
                placeholder="User's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                onChange={handleEmailChange}
                placeholder="user@example.com"
              />
            </div>
          </div>

          {isNew && (
            <div className="space-y-2">
              <Label htmlFor="temp-password">Temporary Password</Label>
              <Input
                id="temp-password"
                type="text"
                value={user.password}
                onChange={handleTempPasswordChange}
                placeholder="Temporary password for initial login"
              />
              <p className="text-xs text-muted-foreground">
                User will be prompted to change password on first login.
              </p>
            </div>
          )}
        </div>

        {/* Role Selection */}
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Role</h3>
          <div className="grid grid-cols-3 gap-2">
            {userRoles.map((role) => (
              <Button
                key={role}
                type="button"
                variant={user.role === role ? 'default' : 'outline'}
                className="justify-start text-left"
                onClick={() => applyRoleTemplate(role)}
              >
                {role.replace(/([A-Z])/g, ' $1').trim()}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selecting a role will apply its default permissions, which you can customize below.
          </p>
        </div>

        {/* Module Access */}
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Module Access</h3>
          <div className="space-y-4">
            {allModules.map((module) => (
              <div key={module.key} className="flex items-center justify-between">
                <Label htmlFor={`module-${module.key}`} className="flex-1">
                  {module.label}
                </Label>
                <Switch
                  id={`module-${module.key}`}
                  checked={user.moduleAccess[module.key]}
                  onCheckedChange={(checked) =>
                    toggleModuleAccess(module.key, checked)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* User Status */}
        <div className="grid gap-2">
          <h3 className="text-sm font-medium">Status</h3>
          <div className="flex items-center space-x-2">
            <Switch
              id="user-active"
              checked={user.active}
              onCheckedChange={setUserActive}
            />
            <Label htmlFor="user-active">User is active</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Inactive users cannot log into the system.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isNew ? 'Create User' : 'Update User'}
        </Button>
      </div>
    </DialogContent>
  );
};

export default UserForm;
