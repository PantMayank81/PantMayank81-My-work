
import React, { useState } from 'react';
import { auth, googleProvider, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from '../../services/firebase';
import Input from '../shared/Input';
import Button from '../shared/Button';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError("Please enter your email address to reset password.");
            return;
        }
        setError('');
        setMessage('');
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign In</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
            <form onSubmit={handleLogin} className="space-y-6">
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<i className="fa-solid fa-envelope text-gray-400"></i>}
                />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    icon={<i className="fa-solid fa-lock text-gray-400"></i>}
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>
             <div className="mt-4 text-right">
                <button onClick={handlePasswordReset} className="text-xs text-gray-500 hover:underline">Forgot Password?</button>
            </div>
            <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
                <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
                <hr className="flex-grow border-gray-300 dark:border-gray-600"/>
            </div>
            <Button
                variant="secondary"
                onClick={handleGoogleSignIn}
                className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                icon={<i className="fa-brands fa-google"></i>}
            >
                Sign In with Google
            </Button>
        </div>
    );
};

export default LoginForm;
