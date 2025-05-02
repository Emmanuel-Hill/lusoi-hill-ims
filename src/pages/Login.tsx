
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const { users, authenticateUser, currentUser, isInitialLogin, setInitialLoginComplete } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // If already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  // Function to handle login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Artificial delay to simulate server request
    setTimeout(() => {
      const user = authenticateUser(email, password);
      
      if (user) {
        toast({
          title: "Login successful",
          description: `Welcome, ${user.name}!`,
        });
        
        // Check if it's initial login
        // Fixed: Make sure isInitialLogin is a function and user exists before checking
        if (isInitialLogin && typeof isInitialLogin === 'function' && user.id) {
          const isFirstLogin = isInitialLogin(user.id);
          if (isFirstLogin) {
            navigate('/change-password');
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid email or password');
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
      }
      setLoading(false);
    }, 1500);
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
            <CardTitle className="text-2xl font-bold text-center">Login to EggTrack</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
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

export default Login;
