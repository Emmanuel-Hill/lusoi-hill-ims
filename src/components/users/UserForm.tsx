
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  DialogFooter, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { User, UserRole, ModuleAccess } from '@/types';

interface UserFormProps {
  user: User | Partial<User & { moduleAccess: ModuleAccess }>;
  onSubmit: () => void;
  onCancel: () => void;
  isNew?: boolean;
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
  isNew = false,
  applyRoleTemplate,
  handleNameChange,
  handleEmailChange,
  handleTempPasswordChange,
  toggleModuleAccess,
  setUserActive
}) => {
  const formTitle = isNew ? 'Add New User' : 'Edit User';
  const formDescription = isNew 
    ? 'Create a new user account and assign permissions' 
    : 'Update user details and permissions';
  const submitButtonText = isNew ? 'Add User' : 'Save Changes';
  
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{formTitle}</DialogTitle>
        <DialogDescription>{formDescription}</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={isNew ? "name" : "edit-name"}>Name</Label>
            <Input 
              id={isNew ? "name" : "edit-name"}
              placeholder="Enter user name" 
              value={user.name || ''}
              onChange={handleNameChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={isNew ? "email" : "edit-email"}>Email</Label>
            <Input 
              id={isNew ? "email" : "edit-email"}
              type="email" 
              placeholder="Email will be auto-generated" 
              value={user.email || ''}
              onChange={handleEmailChange}
            />
            <p className="text-xs text-muted-foreground">
              Email will be auto-generated using the domain lusoihillfarm.co.ke
              {!isNew && ' when name is changed'}
            </p>
          </div>
          {isNew && (
            <div className="space-y-2">
              <Label htmlFor="temp-password">Temporary Password</Label>
              <Input 
                id="temp-password"
                type="password"
                placeholder="Set a temporary password" 
                value={user.password || ''}
                onChange={handleTempPasswordChange}
              />
              <p className="text-xs text-muted-foreground">
                User will be prompted to change this password on first login
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={isNew ? "role" : "edit-role"}>Role</Label>
            <Select 
              value={user.role} 
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
                <SelectItem value="SalesTeamMember">Sales Team Member</SelectItem>
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="WarehouseManager">Warehouse Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id={isNew ? "active" : "edit-active"}
              checked={user.active}
              onCheckedChange={(checked) => setUserActive(checked as boolean)}
            />
            <Label htmlFor={isNew ? "active" : "edit-active"} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Active Account
            </Label>
          </div>
        </div>
        
        <div className="border rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-3">Module Access</h3>
          <div className="space-y-2">
            {user.moduleAccess && Object.keys(user.moduleAccess).map((module) => (
              <div key={module} className="flex items-center space-x-2">
                <Checkbox 
                  id={`${isNew ? '' : 'edit-'}module-${module}`}
                  checked={user.moduleAccess[module as keyof ModuleAccess]}
                  onCheckedChange={(checked) => 
                    toggleModuleAccess(module as keyof ModuleAccess, checked as boolean)
                  }
                />
                <Label htmlFor={`${isNew ? '' : 'edit-'}module-${module}`} className="text-sm capitalize">
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
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>{submitButtonText}</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserForm;
