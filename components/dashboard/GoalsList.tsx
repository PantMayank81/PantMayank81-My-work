
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import GoalCard from './GoalCard';
import Spinner from '../shared/Spinner';
import type { Goal } from '../../types';

const GoalsList: React.FC = () => {
    const { data, loading, updateData } = useData();
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const handleUpdateGoal = (updatedGoal: Goal) => {
        if (data) {
            const newGoals = data.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
            updateData({ goals: newGoals });
            setEditingGoal(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center"><Spinner /></div>;
    }

    if (!data || !data.goals) {
        return <p>No goals found.</p>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Your Financial Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onUpdate={handleUpdateGoal} />
                ))}
            </div>
        </div>
    );
};

export default GoalsList;
