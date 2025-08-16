import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/hooks/use-toast';
import { Mail, ArrowLeft, Lock, Shield, Eye, EyeOff, CheckCircle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type Step = 'email' | 'otp' | 'password' | 'success';

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();

  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setLoading(true);
    try {
      await forgotPassword(email);
      setCurrentStep('otp');
      setTimeLeft(300);
      setCanResend(false);
      toast({ title: "OTP Sent!", description: "Check your email for the code." });
    } catch (error: any) {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Enter a 6-digit code.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const token = await verifyOTP(email, otp);
      setResetToken(token);
      setCurrentStep('password');
      toast({ title: "OTP Verified!", description: "Now set your new password." });
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "At least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setCurrentStep('success');
      toast({ title: "Password Reset Successful!" });
    } catch (error: any) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setTimeLeft(300);
    try {
      await forgotPassword(email);
      toast({ title: "OTP Resent!", description: "Check your email for the new code." });
    } catch (error: any) {
      toast({ title: "Failed to resend OTP", description: error.message, variant: "destructive" });
    }
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('email');
      setOtp('');
    } else if (currentStep === 'password') {
      setCurrentStep('otp');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const renderEmailStep = () => (
    <Card className="w-full max-w-md mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-gray-300 dark:text-gray-400">
          Enter your email to receive a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200 dark:text-gray-300">Email Address</Label>
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
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {loading ? 'Sending OTP...' : 'Send Verification Code'}
          </Button>
          <div className="text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderOTPStep = () => (
    <Card className="w-full max-w-md mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Enter Verification Code
        </CardTitle>
        <CardDescription className="text-gray-300 dark:text-gray-400">
          We've sent a 6-digit code to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-gray-200 dark:text-gray-300">Verification Code</Label>
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
                className="pl-10 text-center text-lg tracking-widest bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"
              />
            </div>
          </div>
          <div className="text-center space-y-2">
            {timeLeft > 0 ? <div className="text-sm text-gray-400 flex items-center justify-center"><Clock className="w-4 h-4 mr-1" /> Code expires in {formatTime(timeLeft)}</div> : <div className="text-sm text-red-400">Code has expired</div>}
            {canResend && <Button type="button" variant="ghost" onClick={handleResendOTP} className="text-blue-400">Resend Code</Button>}
          </div>
          <Button type="submit" disabled={loading || otp.length !== 6 || timeLeft === 0} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            {loading ? 'Verifying...' : 'Verify Code'}
          </Button>
          <div className="text-center">
            <button type="button" onClick={handleBack} className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300">
              <ArrowLeft className="w-4 h-4 mr-2" /> Change Email
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderPasswordStep = () => (
    <Card className="w-full max-w-md mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Set New Password
        </CardTitle>
        <CardDescription className="text-gray-300 dark:text-gray-400">
          Create a strong password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-200 dark:text-gray-300">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input id="newPassword" type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" required className="pl-10 pr-10 bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-300">{showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-200 dark:text-gray-300">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
              <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required className="pl-10 pr-10 bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 transition-colors"/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-300">{showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-400">Password Requirements:</div>
            <div className="space-y-1 text-xs">
              <div className={`flex items-center ${newPassword.length >= 6 ? 'text-green-400' : 'text-gray-500'}`}><CheckCircle className="w-3 h-3 mr-1"/>At least 6 characters</div>
              <div className={`flex items-center ${newPassword === confirmPassword && newPassword ? 'text-green-400' : 'text-gray-500'}`}><CheckCircle className="w-3 h-3 mr-1"/>Passwords match</div>
            </div>
          </div>

          <Button type="submit" disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">{loading ? 'Updating...' : 'Update Password'}</Button>
          <div className="text-center">
            <button type="button" onClick={handleBack} className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"><ArrowLeft className="w-4 h-4 mr-2"/>Back to Verification</button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card className="w-full max-w-md mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border-white/20 dark:border-white/10">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-400"/>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Password Reset Successful!</CardTitle>
        <CardDescription className="text-gray-300 dark:text-gray-400">Your password has been updated successfully</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-gray-300">You can now sign in with your new password.</div>
        <Button onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white">Continue to Login</Button>
      </CardContent>
    </Card>
  );

  switch (currentStep) {
    case 'email': return renderEmailStep();
    case 'otp': return renderOTPStep();
    case 'password': return renderPasswordStep();
    case 'success': return renderSuccessStep();
    default: return renderEmailStep();
  }
};

export default ForgotPasswordForm;
