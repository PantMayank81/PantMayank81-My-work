
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useData } from '../../context/DataContext';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import EditPromptsModal, { DEFAULT_INSIGHTS_PROMPT } from './EditPromptsModal';

const InsightsCard: React.FC = () => {
    const { data } = useData();
    const [insights, setInsights] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

    const generateInsights = useCallback(async () => {
        if (!data || !process.env.API_KEY) {
            setError('API key is not configured.');
            return;
        }

        setLoading(true);
        setError('');
        setInsights('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const promptTemplate = localStorage.getItem('customInsightsPrompt') || DEFAULT_INSIGHTS_PROMPT;
            
            const goalsString = data.goals.map(g => `  - ${g.name}: Target INR ${g.targetAmount}, Current INR ${g.currentAmount}, Deadline Year ${g.deadlineYear}`).join('\n');

            const prompt = promptTemplate
                .replace(/{monthlyIncome}/g, String(data.monthlyIncome))
                .replace(/{monthlyExpenses.general}/g, String(data.monthlyExpenses.general))
                .replace(/{monthlyExpenses.education}/g, String(data.monthlyExpenses.education))
                .replace(/{monthlyExpenses.healthcare}/g, String(data.monthlyExpenses.healthcare))
                .replace(/{monthlyExpenses.food}/g, String(data.monthlyExpenses.food))
                .replace(/{incomeGrowthRate}/g, String(data.incomeGrowthRate))
                .replace(/{investmentReturnRate}/g, String(data.investmentReturnRate))
                .replace(/{goals}/g, goalsString);


            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const text = response.text;
            
            if (text) {
                setInsights(text);
            } else {
                setError('Could not generate insights. The response was empty.');
            }

        } catch (e: any) {
            setError('An error occurred while generating insights. Please try again.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            generateInsights();
        }
    }, [data, generateInsights]);
    
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Financial Insights</h2>
                    <Button onClick={() => setIsPromptModalOpen(true)} variant="ghost" className="!p-2 h-8 w-8 !rounded-full">
                        <i className="fa-solid fa-cog"></i>
                    </Button>
                </div>
                <Button onClick={generateInsights} disabled={loading} variant="ghost" className="!p-2">
                     <i className={`fa-solid fa-sync ${loading ? 'animate-spin' : ''}`}></i>
                </Button>
            </div>
            {loading && (
                <div className="flex justify-center items-center h-24">
                    <Spinner size="sm" />
                </div>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {!loading && !error && insights && (
                <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                    {insights.split('- ').filter(line => line.trim() !== '').map((insight, index) => (
                        <li key={index} className="flex items-start">
                           <i className="fa-solid fa-lightbulb text-yellow-400 mr-3 mt-1"></i>
                           <span>{insight.trim()}</span>
                        </li>
                    ))}
                </ul>
            )}
            {isPromptModalOpen && <EditPromptsModal onClose={() => setIsPromptModalOpen(false)} />}
        </div>
    );
};

export default InsightsCard;
