import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Shield, Clock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate=useNavigate();
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
        title: "Verification code sent! 📧",
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
        title: "Welcome to CodePlatter! ",
        description: "Your account has been created successfully.",
      });
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
      navigate('/dashboard')
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
        title: "Code resent! 📨",
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
    <div className="w-full max-w-md mx-auto mt-10">
      <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Join CodePlatter
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-gray-400 text-sm sm:text-base">
            Create your account to start your coding journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-700 dark:text-gray-200 text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-1" />
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700 dark:text-gray-200 text-sm font-medium flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-blue-700 dark:text-gray-200 text-sm font-medium flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-12 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-blue-700 dark:text-gray-200 text-sm font-medium flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Confirm Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 pr-12 h-12 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-700/30">
              <div className="text-sm text-blue-600 dark:text-gray-400 mb-2 font-medium">Password Requirements:</div>
              <div className="space-y-1 text-xs">
                <div className={`flex items-center ${password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  <CheckCircle className="w-3 h-3 mr-2" /> At least 6 characters
                </div>
                <div className={`flex items-center ${password === confirmPassword && password ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  <CheckCircle className="w-3 h-3 mr-2" /> Passwords match
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || password.length < 6 || password !== confirmPassword}
              className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending verification...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-base sm:text-lg">Send Verification Code</span>
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-blue-600 dark:text-gray-400 pt-4 border-t border-blue-100 dark:border-white/10">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold hover:underline"
              >
                Sign in instead
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderOTPStep = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 px-3 sm:px-4 py-2 rounded-full text-sm mb-4 animate-fade-in">
          <Shield className="w-4 h-4" />
          <span className="font-medium">Email Verification</span>
        </div>
      </div>

      <Card className="bg-white dark:bg-white/5 border-blue-200 dark:border-white/10 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-gray-400 text-sm sm:text-base">
            We've sent a 6-digit code to <span className="font-semibold text-blue-700 dark:text-blue-300">{email}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-blue-700 dark:text-gray-200 text-sm font-medium flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" />
                Verification Code
              </Label>
              <div className="relative">
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="text-center text-xl sm:text-2xl tracking-widest h-16 bg-white dark:bg-white/5 border-blue-200 dark:border-white/20 text-blue-700 dark:text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              {timeLeft > 0 ? (
                <div className="text-sm text-blue-600 dark:text-gray-400 flex items-center justify-center bg-blue-50 dark:bg-blue-900/10 py-2 px-4 rounded-full border border-blue-200 dark:border-blue-700/30">
                  <Clock className="w-4 h-4 mr-2" /> 
                  Code expires in {formatTime(timeLeft)}
                </div>
              ) : (
                <div className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 py-2 px-4 rounded-full border border-red-200 dark:border-red-700/30">
                  Code has expired
                </div>
              )}
              
              {canResend && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={handleResendOTP}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Resend Code
                </Button>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || otp.length !== 6 || timeLeft === 0}
              className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold py-3 sm:py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-base sm:text-lg">Verify & Create Account</span>
                  <CheckCircle className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
            </Button>

            <div className="text-center pt-4 border-t border-blue-100 dark:border-white/10">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change Email Address
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white dark:bg-white/5 border-green-200 dark:border-green-700/30 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-600/20 dark:to-emerald-600/20 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          
          <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Welcome to CodePlatter! 🎉
          </CardTitle>
          <CardDescription className="text-blue-600 dark:text-gray-400 text-sm sm:text-base mb-8">
            Your account has been created successfully. Get ready to accelerate your coding journey!
          </CardDescription>
          
          <div className="space-y-4">
            <div className="text-blue-700 dark:text-gray-300 text-sm leading-relaxed">
              🚀 You're all set! Redirecting you to your dashboard where you can start exploring 
              hundreds of coding questions and track your progress.
            </div>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  switch (currentStep) {
    case 'details': return renderDetailsStep();
    case 'otp': return renderOTPStep();
    case 'success': return renderSuccessStep();
    default: return renderDetailsStep();
  }
};

export default RegisterForm;