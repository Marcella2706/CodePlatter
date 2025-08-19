import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type Step = 'details' | 'otp' | 'success';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { sendRegistrationOTP, verifyRegistrationOTP } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (currentStep === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [currentStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await sendRegistrationOTP(name, email, password);
      setCurrentStep('otp');
      setTimeLeft(300);
      setCanResend(false);
      toast({
        title: "Verification code sent!",
        description: "Check your email for the 6-digit code.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await verifyRegistrationOTP(name, email, password, otp);
      setCurrentStep('success');
      toast({
        title: "Welcome to CodePlatter!",
        description: "Your account has been created successfully.",
      });
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid or expired code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setTimeLeft(300);
    try {
      await sendRegistrationOTP(name, email, password);
      toast({
        title: "Code resent!",
        description: "Check your email for the new verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend code",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('details');
      setOtp('');
      setTimeLeft(300);
      setCanResend(false);
    }
  };

  const renderDetailsStep = () => (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Join CodePlatter
        </CardTitle>
        <CardDescription className="text-blue-600 dark:text-gray-400">
          Create your account to start coding
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-blue-700 dark:text-gray-200">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-700 dark:text-gray-200">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-700 dark:text-gray-200">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-blue-700 dark:text-gray-200">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 pr-10 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-blue-600 dark:text-gray-400">Password Requirements:</div>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center ${password.length >= 6 ? 'text-green-400' : 'text-gray-500'}`}>
                <CheckCircle className="w-3 h-3 mr-1" /> At least 6 characters
              </div>
              <div className={`flex items-center ${password === confirmPassword && password ? 'text-green-400' : 'text-gray-500'}`}>
                <CheckCircle className="w-3 h-3 mr-1" /> Passwords match
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || password.length < 6 || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending verification...
              </div>
            ) : (
              'Send Verification Code'
            )}
          </Button>

          <div className="text-center text-sm text-blue-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderOTPStep = () => (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-blue-600 dark:text-gray-400">
          We've sent a 6-digit code to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-blue-700 dark:text-gray-200">Verification Code</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                className="pl-10 text-center text-lg tracking-widest bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            {timeLeft > 0 ? (
              <div className="text-sm text-blue-600 dark:text-gray-400 flex items-center justify-center">
                <Clock className="w-4 h-4 mr-1" /> 
                Code expires in {formatTime(timeLeft)}
              </div>
            ) : (
              <div className="text-sm text-red-400">Code has expired</div>
            )}
            
            {canResend && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleResendOTP}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Resend Code
              </Button>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || otp.length !== 6 || timeLeft === 0}
            className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Verify & Create Account'
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Details
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card className="w-full max-w-md mx-auto bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-600/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to CodePlatter!
        </CardTitle>
        <CardDescription className="text-blue-600 dark:text-gray-400">
          Your account has been created successfully
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-blue-700 dark:text-gray-300">
          You're all set! Redirecting you to your dashboard...
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
        </div>
      </CardContent>
    </Card>
  );

  switch (currentStep) {
    case 'details': return renderDetailsStep();
    case 'otp': return renderOTPStep();
    case 'success': return renderSuccessStep();
    default: return renderDetailsStep();
  }
};

export default RegisterForm;