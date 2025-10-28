
import React from 'react';
// FIX: Corrected import path for Dashboard component.
import Dashboard from './components/dashboard/Dashboard';
import AuthPage from './components/auth/AuthPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Spinner from './components/shared/Spinner';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return user ? (
        <DataProvider>
            <Dashboard />
        </DataProvider>
    ) : (
        <AuthPage />
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
