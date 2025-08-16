import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';
import { useEffect } from 'react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            CodeQuest
          </h1>
          <p className="text-gray-400">
            Join thousands of developers improving their skills
          </p>
        </div>
        
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
};

export default Register;
