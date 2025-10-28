import React, { useState, useMemo } from 'react';
import { formatCurrency, calculateMonthlyContribution, calculateRequiredRateOfReturn } from '../../utils/helpers';
import type { Goal } from '../../types';
import { useData } from '../../context/DataContext';

interface GoalCardProps {
    goal: Goal;
    onUpdate: (goal: Goal) => void;
}

const getStatus = (progress: number) => {
    if (progress >= 100) return { text: 'Achieved', color: 'bg-green-500' };
    if (progress > 70) return { text: 'On Track', color: 'bg-blue-500' };
    if (progress > 30) return { text: 'Needs Attention', color: 'bg-yellow-500' };
    return { text: 'Just Started', color: 'bg-red-500' };
};

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate }) => {
    const { data } = useData();
    const [currentAmount, setCurrentAmount] = useState(goal.currentAmount);
    const [isEditing, setIsEditing] = useState(false);

    const investmentReturnRate = data?.investmentReturnRate || 8;
    
    const monthlySavings = useMemo(() => {
        if (!data) return 0;
        const totalExpenses = Object.values(data.monthlyExpenses).reduce((a, b) => a + b, 0);
        return data.monthlyIncome - totalExpenses;
    }, [data]);

    const progress = useMemo(() => (goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 100), [goal.currentAmount, goal.targetAmount]);
    const status = getStatus(progress);
    
    const yearsRemaining = goal.deadlineYear > 0 ? goal.deadlineYear - new Date().getFullYear() : 0;
    
    const monthlyContribution = useMemo(() => calculateMonthlyContribution(goal.targetAmount, goal.currentAmount, yearsRemaining, investmentReturnRate), [goal.targetAmount, goal.currentAmount, yearsRemaining, investmentReturnRate]);

    const requiredRate = useMemo(() => {
        if (monthlySavings <= 0 || yearsRemaining <= 0 || goal.targetAmount <= goal.currentAmount) return null;
        return calculateRequiredRateOfReturn(goal.targetAmount, goal.currentAmount, yearsRemaining, monthlySavings);
    }, [goal.targetAmount, goal.currentAmount, yearsRemaining, monthlySavings]);


    const handleSave = () => {
        onUpdate({ ...goal, currentAmount });
        setIsEditing(false);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{goal.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${status.color}`}>
                        {status.text}
                    </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Target: {formatCurrency(goal.targetAmount)}</p>

                <div className="mt-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                </div>

                <div className="mt-4">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                             <input 
                                type="number" 
                                value={currentAmount}
                                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                                className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
                             />
                             <button onClick={handleSave} className="text-green-500"><i className="fa-solid fa-check"></i></button>
                             <button onClick={() => setIsEditing(false)} className="text-red-500"><i className="fa-solid fa-times"></i></button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <p className="text-gray-800 dark:text-white font-semibold">{formatCurrency(goal.currentAmount)}</p>
                            <button onClick={() => setIsEditing(true)} className="text-sm text-primary hover:underline">
                                Edit <i className="fa-solid fa-pencil text-xs"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Contribution Needed:</p>
                        <p className="font-bold text-primary text-lg">
                            {monthlyContribution === Infinity ? 'Goal is near' : formatCurrency(monthlyContribution)} / month
                        </p>
                    </div>
                     {requiredRate !== null && (
                         <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Required Annual Return:</p>
                            <p className="font-bold text-secondary text-lg">
                                {requiredRate.toFixed(2)}% / year
                            </p>
                             <p className="text-xs text-gray-500 dark:text-gray-400">
                                With current savings of {formatCurrency(monthlySavings)}.
                             </p>
                         </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    {yearsRemaining > 0 ? `Projections based on ${yearsRemaining} years at ${investmentReturnRate}% return.` : 'Deadline has passed'}
                </p>
            </div>
        </div>
    );
};

export default GoalCard;