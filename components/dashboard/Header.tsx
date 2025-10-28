
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signOut, auth } from '../../services/firebase';

const Header: React.FC = () => {
    const { user } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);
    
    const exportData = () => {
        // In a real app, this would get data from the context
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ note: "Data export from context would be here" }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "financial_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }


    return (
        <header className="bg-white dark:bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <i className="fa-solid fa-seedling text-primary text-2xl"></i>
                        <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">Zenith</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                            {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
                        </button>
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2">
                                <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=00A65A&color=fff`} alt="profile" className="w-8 h-8 rounded-full"/>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                                        Signed in as <br/> <strong className="truncate">{user?.email}</strong>
                                    </div>
                                    <button onClick={exportData} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                      <i className="fa-solid fa-download mr-2"></i>Export Data
                                    </button>
                                    <button onClick={() => signOut(auth)} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                      <i className="fa-solid fa-right-from-bracket mr-2"></i>Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
