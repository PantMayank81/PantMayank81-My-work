
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthPage: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="text-center mb-8">
                <i className="fa-solid fa-seedling text-primary text-5xl mb-3"></i>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome to Zenith</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Your journey to financial freedom starts here.</p>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                {isLoginView ? <LoginForm /> : <SignUpForm />}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="text-sm font-medium text-primary hover:underline dark:text-secondary"
                    >
                        {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
