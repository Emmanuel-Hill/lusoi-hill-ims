
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

const ChangePassword = () => {
  const { currentUser, changeUserPassword, setInitialLoginComplete } = useAppContext();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate passwords
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Artificial delay to simulate server request
    setTimeout(() => {
      // Change password and mark initial login complete
      changeUserPassword(currentUser.id, newPassword);
      setInitialLoginComplete(currentUser.id);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      // Redirect to dashboard
      navigate('/');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/9eebc39c-2e9e-45dd-a2f3-7edc6d9d8bec.png" 
            alt="Lusoi Hill Farm" 
            className="h-24"
          />
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Change Your Password</CardTitle>
            <CardDescription className="text-center">
              Please set a new password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="New password"
                    className="pl-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Lusoi Hill Farm Poultry Management System
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
