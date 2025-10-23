import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M24 9.5c3.23 0 5.45.98 7.2 2.6l5.5-5.5C33.56 3.82 29.27 2 24 2 14.53 2 6.86 7.6 4.14 15.86l6.4 4.93C12.01 14.2 17.5 9.5 24 9.5z"></path>
        <path fill="#34A853" d="M46.2 25.18c0-1.68-.15-3.3-.44-4.88H24v9.1h12.45c-.54 2.97-2.1 5.48-4.63 7.18l6.1 4.73C42.85 37.47 46.2 31.87 46.2 25.18z"></path>
        <path fill="#FBBC05" d="M10.54 20.79c-.4-.98-.64-2.08-.64-3.23s.23-2.25.64-3.23l-6.4-4.93C2.46 12.2 1 15.93 1 20s1.46 7.8 4.14 10.54l6.4-4.75z"></path>
        <path fill="#EA4335" d="M24 46c5.27 0 9.56-1.75 12.75-4.7l-6.1-4.73c-1.75 1.18-4 1.9-6.65 1.9-6.5 0-11.99-4.7-13.86-11.14l-6.4 4.93C6.86 38.4 14.53 46 24 46z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);

const AdminLoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate('/admin');
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg text-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">כניסת מנהל</h2>
                    <p className="mt-2 text-gray-600">התחבר עם חשבון גוגל כדי לנהל את החנות.</p>
                </div>
                <div className="pt-4">
                    <button
                        onClick={handleLogin}
                        className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        <GoogleIcon />
                        התחבר עם Google
                    </button>
                </div>
                <p className="text-xs text-gray-500">
                    <strong>הערה:</strong> זוהי הדגמה. במערכת האמיתית, ההתחברות תהיה מאובטחת ותקושר לחשבון הגוגל שסיפקת.
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;