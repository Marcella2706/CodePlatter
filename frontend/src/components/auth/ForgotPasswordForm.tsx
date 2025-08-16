import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPassword(email);
      setSent(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: "Please check your email and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-gray-300 dark:text-gray-400">
            We've sent a password reset link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-gray-300">
            Don't see the email? Check your spam folder or wait a few minutes.
          </div>
          <Link
            to="/login"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-gray-300 dark:text-gray-400">
          Enter your email to receive a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200 dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;