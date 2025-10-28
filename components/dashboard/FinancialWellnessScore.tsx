
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import Spinner from '../shared/Spinner';

const FinancialWellnessScore: React.FC = () => {
    const { data, loading } = useData();

    const score = useMemo(() => {
        if (!data) return 0;

        // 1. Savings Rate (40 points)
        const totalExpenses = Object.values(data.monthlyExpenses).reduce((a, b) => a + b, 0);
        const savings = data.monthlyIncome - totalExpenses;
        const savingsRate = data.monthlyIncome > 0 ? savings / data.monthlyIncome : 0;
        let savingsScore = 0;
        if (savingsRate > 0.3) savingsScore = 40;
        else if (savingsRate > 0.2) savingsScore = 30;
        else if (savingsRate > 0.1) savingsScore = 20;
        else if (savingsRate > 0) savingsScore = 10;

        // 2. Emergency Fund (30 points)
        const emergencyGoal = data.goals.find(g => g.id === 'emergency_fund');
        let emergencyScore = 0;
        if (emergencyGoal && emergencyGoal.targetAmount > 0) {
            const progress = (emergencyGoal.currentAmount / emergencyGoal.targetAmount);
            emergencyScore = Math.min(progress * 30, 30);
        }

        // 3. Retirement Progress (30 points)
        const retirementGoal = data.goals.find(g => g.id === 'retirement');
        let retirementScore = 0;
        if (retirementGoal && retirementGoal.targetAmount > 0) {
             const progress = (retirementGoal.currentAmount / retirementGoal.targetAmount);
             retirementScore = Math.min(progress * 30, 30);
        }

        return Math.round(savingsScore + emergencyScore + retirementScore);
    }, [data]);

    const scoreColor = useMemo(() => {
        if (score > 75) return 'text-green-500';
        if (score > 50) return 'text-blue-500';
        if (score > 25) return 'text-yellow-500';
        return 'text-red-500';
    }, [score]);

    const getMessage = (s: number) => {
        if (s > 75) return "Excellent! You're in a strong financial position.";
        if (s > 50) return "Good job! You're on the right track.";
        if (s > 25) return "There's room for improvement. Keep working at it!";
        return "Let's work on a plan to improve your financial health.";
    }

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex justify-center items-center h-full">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Financial Wellness Score</h2>
            <div className={`text-6xl font-bold ${scoreColor}`}>{score}</div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">out of 100</p>
            <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm">{getMessage(score)}</p>
        </div>
    );
};

export default FinancialWellnessScore;
