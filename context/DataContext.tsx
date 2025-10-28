import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db, doc, onSnapshot, setDoc } from '../services/firebase';
import { PREDEFINED_GOALS } from '../constants';
import type { FinancialData, Goal } from '../types';

interface DataContextType {
    data: FinancialData | null;
    loading: boolean;
    updateData: (newData: Partial<FinancialData>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const defaultFinancialData: FinancialData = {
    monthlyIncome: 50000,
    incomeSources: [{ id: 'default-source', name: 'Primary Job', amount: 50000 }],
    incomeGrowthRate: 10,
    investmentReturnRate: 8,
    monthlyExpenses: {
        general: 20000,
        education: 0,
        healthcare: 2000,
        food: 8000,
    },
    goals: PREDEFINED_GOALS.map(g => ({ ...g, currentAmount: 0 }))
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [data, setData] = useState<FinancialData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setData(null);
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const docData = docSnap.data() as FinancialData;

                // Backward compatibility: If incomeSources is missing, create it from monthlyIncome
                if (!docData.incomeSources || docData.incomeSources.length === 0) {
                    docData.incomeSources = [{ id: crypto.randomUUID(), name: 'Primary Income', amount: docData.monthlyIncome || 0 }];
                } else {
                    // Ensure all sources have a unique ID for React keys
                    docData.incomeSources = docData.incomeSources.map(source => ({
                        ...source,
                        id: source.id || crypto.randomUUID()
                    }));
                }

                // Ensure monthlyIncome is always the sum of sources for data consistency
                docData.monthlyIncome = docData.incomeSources.reduce((sum, source) => sum + (source.amount || 0), 0);
                
                setData(docData);
            } else {
                // Initialize with default data for new users
                const initialData = { ...defaultFinancialData };
                const totalExpenses = Object.values(initialData.monthlyExpenses).reduce((a, b) => a + b, 0);
                const emergencyGoal = initialData.goals.find(g => g.id === 'emergency_fund');
                if (emergencyGoal) {
                    emergencyGoal.targetAmount = totalExpenses * 6;
                }
                setDoc(docRef, initialData);
                setData(initialData);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);
    
    const updateData = async (newData: Partial<FinancialData>) => {
        if (user && data) {
            const updatedData = { ...data, ...newData };
            
            // Recalculate emergency fund target if expenses change
            if (newData.monthlyExpenses) {
                const mergedExpenses = { ...data.monthlyExpenses, ...newData.monthlyExpenses };
                // FIX: Added explicit types to the reduce function to prevent type errors.
                // This ensures `totalExpenses` is correctly inferred as a number.
                const totalExpenses = Object.values(mergedExpenses).reduce((sum: number, value: number | undefined) => sum + (value || 0), 0);
                
                const emergencyGoal = updatedData.goals.find(g => g.id === 'emergency_fund');
                if (emergencyGoal) {
                    emergencyGoal.targetAmount = totalExpenses * 6;
                }

                // Ensure the data being saved contains the fully merged expenses.
                updatedData.monthlyExpenses = mergedExpenses;
            }

            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, updatedData, { merge: true });
        }
    };


    return (
        <DataContext.Provider value={{ data, loading, updateData }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};