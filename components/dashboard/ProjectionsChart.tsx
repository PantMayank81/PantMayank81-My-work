
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/helpers';
import Spinner from '../shared/Spinner';

const ProjectionsChart: React.FC = () => {
    const { data, loading } = useData();

    const projectionData = useMemo(() => {
        if (!data) return [];
        
        const years = 30;
        const projection = [];
        const monthlyRate = data.investmentReturnRate / 100 / 12;
        const totalExpenses = Object.values(data.monthlyExpenses).reduce((a, b) => a + b, 0);
        const monthlySavings = data.monthlyIncome - totalExpenses;
        const initialCapital = data.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

        let currentCapital = initialCapital;

        for (let year = 1; year <= years; year++) {
            let yearEndCapital = currentCapital;
            for(let month = 1; month <= 12; month++) {
                yearEndCapital = yearEndCapital * (1 + monthlyRate) + monthlySavings;
            }
            projection.push({
                year: new Date().getFullYear() + year,
                value: yearEndCapital,
            });
            currentCapital = yearEndCapital;
        }
        return projection;
    }, [data]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md flex justify-center items-center h-full">
                <Spinner />
            </div>
        );
    }
    
    if (!data || projectionData.length === 0) {
        return <p>Not enough data for projections.</p>;
    }

    const maxValue = projectionData[projectionData.length - 1]?.value || 1;

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">30-Year Wealth Projection</h2>
            <div className="w-full h-64 flex items-end gap-2 border-l border-b border-gray-300 dark:border-gray-600 p-2">
                {projectionData.map((d, index) => (
                    <div key={d.year} className="flex-1 flex flex-col items-center justify-end group relative">
                        <div 
                            className="w-full bg-primary hover:bg-primary-dark transition-all duration-300 rounded-t"
                            style={{ height: `${(d.value / maxValue) * 100}%`}}
                        ></div>
                         <div className="absolute bottom-full mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="font-bold">{d.year}:</span> {formatCurrency(d.value)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{projectionData[0]?.year}</span>
                <span>{projectionData[Math.floor(projectionData.length / 2)]?.year}</span>
                <span>{projectionData[projectionData.length - 1]?.year}</span>
            </div>
        </div>
    );
};

export default ProjectionsChart;
