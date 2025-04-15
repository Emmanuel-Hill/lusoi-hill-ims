import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { User, UserRole } from '@/types';
import { ModuleAccess } from '@/types/moduleAccess';

interface UserFormProps {
  user: User | {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    active: boolean;
    initialLoginComplete?: boolean;
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
  setUserActive
}) => {
  return (
    <DialogContent className="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>{isNew ? 'Add User' : 'Edit User'}</DialogTitle>
        <DialogDescription>
          {isNew ? 'Create a new user account.' : 'Edit user details and permissions.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            value={user.name}
            onChange={handleNameChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            value={user.email}
            onChange={handleEmailChange}
            className="col-span-3"
          />
        </div>
        {isNew && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tempPassword" className="text-right">
              Temporary Password
            </Label>
            <Input
              type="text"
              id="tempPassword"
              defaultValue="password123"
              onChange={handleTempPasswordChange}
              className="col-span-3"
            />
          </div>
        )}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right">
            Role
          </Label>
          <Select onValueChange={(role: UserRole) => applyRoleTemplate(role)}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a role" defaultValue={user.role} />
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
          <Label htmlFor="active" className="text-right">
            Active
          </Label>
          <Switch
            id="active"
            checked={user.active}
            onCheckedChange={setUserActive}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right mt-2">Module Access</Label>
          <div className="col-span-3 space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="dashboard">Dashboard</Label>
              <Switch
                id="dashboard"
                checked={user.moduleAccess.dashboard}
                onCheckedChange={(value) => toggleModuleAccess('dashboard', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="batches">Batches</Label>
              <Switch
                id="batches"
                checked={user.moduleAccess.batches}
                onCheckedChange={(value) => toggleModuleAccess('batches', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="eggCollection">Egg Collection</Label>
              <Switch
                id="eggCollection"
                checked={user.moduleAccess.eggCollection}
                onCheckedChange={(value) => toggleModuleAccess('eggCollection', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="feedManagement">Feed Management</Label>
              <Switch
                id="feedManagement"
                checked={user.moduleAccess.feedManagement}
                onCheckedChange={(value) => toggleModuleAccess('feedManagement', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="vaccination">Vaccination</Label>
              <Switch
                id="vaccination"
                checked={user.moduleAccess.vaccination}
                onCheckedChange={(value) => toggleModuleAccess('vaccination', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="sales">Sales</Label>
              <Switch
                id="sales"
                checked={user.moduleAccess.sales}
                onCheckedChange={(value) => toggleModuleAccess('sales', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="customers">Customers</Label>
              <Switch
                id="customers"
                checked={user.moduleAccess.customers}
                onCheckedChange={(value) => toggleModuleAccess('customers', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="calendar">Calendar</Label>
              <Switch
                id="calendar"
                checked={user.moduleAccess.calendar}
                onCheckedChange={(value) => toggleModuleAccess('calendar', value)}
              />
            </div>
             <div className="flex items-center space-x-2">
              <Label htmlFor="reports">Reports</Label>
              <Switch
                id="reports"
                checked={user.moduleAccess.reports}
                onCheckedChange={(value) => toggleModuleAccess('reports', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="userManagement">User Management</Label>
              <Switch
                id="userManagement"
                checked={user.moduleAccess.userManagement}
                onCheckedChange={(value) => toggleModuleAccess('userManagement', value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="warehouse">Warehouse</Label>
              <Switch
                id="warehouse"
                checked={user.moduleAccess.warehouse}
                onCheckedChange={(value) => toggleModuleAccess('warehouse', value)}
              />
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" onClick={onSubmit}>
          {isNew ? 'Create' : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default UserForm;
