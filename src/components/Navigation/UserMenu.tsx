
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const UserMenu: React.FC = () => {
  const { currentUser, logoutUser } = useAppContext();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  if (!currentUser) return null;
  
  const handleLogout = () => {
    logoutUser();
    toast.success("You have been successfully logged out");
    navigate('/login');
  };
  
  const getInitials = (name: string) => {
    return name
      ? name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
      : 'U';
  };

  return (
    <div className="flex items-center gap-4">
      {/* User info - desktop view */}
      <div className="hidden md:flex items-center border-r border-gray-200 pr-4">
        <div className="text-right mr-2">
          <p className="font-medium text-sm text-black">{currentUser?.role || 'User'}</p>
          <p className="text-xs text-gray-500">{currentUser?.email || 'user@example.com'}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </div>
      
      {/* Logout button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-1" />
        Logout
      </Button>

      {/* User avatar dropdown menu */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{currentUser.name}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => navigate('/change-password')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
