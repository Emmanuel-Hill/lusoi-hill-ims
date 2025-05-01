
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown } from 'lucide-react';
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
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:flex hidden mr-2"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn("md:hidden", !isSidebarOpen && "block")}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User selector - for demo purposes */}
          <div className="hidden md:block">
            <Select
              value={currentUser?.id || ''}
              onValueChange={handleUserSwitch}
            >
              <SelectTrigger className="border border-gray-200 rounded-lg bg-gray-50 text-sm focus:ring-lusoi-500 min-w-[200px]">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-full bg-lusoi-100 text-lusoi-700 flex items-center justify-center font-medium mr-2">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                  <SelectValue 
                    placeholder={currentUser?.name || 'Select User'}
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full bg-lusoi-100 text-lusoi-700 flex items-center justify-center text-xs font-medium mr-2">
                        {user.name.charAt(0)}
                      </span>
                      {user.name} ({user.role})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <span className="md:hidden px-4 py-2 text-sm font-medium text-gray-700 flex items-center">
            <div className="w-7 h-7 rounded-full bg-lusoi-100 text-lusoi-700 flex items-center justify-center font-medium mr-2">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            {currentUser?.name || 'User'}
          </span>
          
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default Header;
