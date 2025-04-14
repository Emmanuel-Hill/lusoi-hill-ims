
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import UserMenu from '../Navigation/UserMenu';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { users, currentUser, setCurrentUser } = useAppContext();
  
  // Handle user switch
  const handleUserSwitch = (userId: string) => {
    const userToSwitch = users.find(user => user.id === userId);
    if (userToSwitch) {
      setCurrentUser(userToSwitch);
      toast.success(`Switched to ${userToSwitch.name}`);
    }
  };
  
  return (
    <div className="bg-white shadow">
      <div className="px-4 py-2 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn("md:hidden", !isSidebarOpen && "block")}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center space-x-4 ml-auto">
          {/* User selector - for demo purposes */}
          <div className="hidden md:block">
            <Select
              value={currentUser?.id || ''}
              onValueChange={handleUserSwitch}
            >
              <SelectTrigger className="w-[200px] border-none">
                <SelectValue 
                  placeholder={currentUser?.name || 'Select User'}
                />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="md:hidden px-4 py-2 text-sm font-medium text-gray-700">
            {currentUser?.name || 'User'}
          </span>
          
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
