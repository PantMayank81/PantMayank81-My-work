
import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, sendEmailVerification } from '../../services/firebase';
import Input from '../shared/Input';
import Button from '../shared/Button';

const SignUpForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            setMessage("Verification email sent! Please check your inbox to complete registration.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Create Account</h2>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm mb-4 text-center">{message}</p>}
            <form onSubmit={handleSignUp} className="space-y-6">
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
                <Input
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    icon={<i className="fa-solid fa-check-double text-gray-400"></i>}
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </form>
        </div>
    );
};

export default SignUpForm;
