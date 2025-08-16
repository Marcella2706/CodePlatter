import React from 'react';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const ForgotPassword: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            CodeQuest
          </h1>
          <p className="text-gray-400">
            Reset your password to continue your coding journey
          </p>
        </div>
        
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPassword;