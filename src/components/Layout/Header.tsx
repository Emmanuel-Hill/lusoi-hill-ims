
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, ChevronDown, LogOut } from 'lucide-react';
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
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* Menu button for mobile only */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-lusoi-500"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* User info - desktop view */}
          <div className="hidden md:flex items-center border-r border-gray-200 pr-4">
            <div className="text-right mr-2">
              <p className="font-medium text-sm text-black">{currentUser?.role || 'User'}</p>
              <p className="text-xs text-gray-500">{currentUser?.email || 'user@example.com'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          
          {/* Logout button */}
          <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200">
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
