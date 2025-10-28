
import React, { useState, useEffect, useRef } from 'react';
import Button from '../shared/Button';
// FIX: Imported the Spinner component to resolve the 'Cannot find name' error.
import Spinner from '../shared/Spinner';

interface EditPromptsModalProps {
    onClose: () => void;
}

export const DEFAULT_INSIGHTS_PROMPT = `Analyze the following financial data for a user in India and provide 3-4 actionable, concise, and personalized insights. 
Focus on their savings rate, goal feasibility, and potential areas for improvement. 
Format the output as a simple list. Do not use markdown formatting like bolding or bullet points. Start each insight with a dash (-).

DATA:
- Monthly Income: INR {monthlyIncome}
- Monthly Expenses (General): INR {monthlyExpenses.general}
- Monthly Expenses (Education): INR {monthlyExpenses.education}
- Monthly Expenses (Healthcare): INR {monthlyExpenses.healthcare}
- Monthly Expenses (Food): INR {monthlyExpenses.food}
- Annual Income Growth Rate: {incomeGrowthRate}%
- Expected Investment Return Rate: {investmentReturnRate}%
- Financial Goals:
{goals}`;

const EditPromptsModal: React.FC<EditPromptsModalProps> = ({ onClose }) => {
    const [prompt, setPrompt] = useState('');
    const [saveStatus, setSaveStatus] = useState<'synced' | 'saving'>('synced');
    const isInitialMount = useRef(true);

    useEffect(() => {
        const customPrompt = localStorage.getItem('customInsightsPrompt');
        setPrompt(customPrompt || DEFAULT_INSIGHTS_PROMPT);
    }, []);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        setSaveStatus('saving');
        const handler = setTimeout(() => {
            localStorage.setItem('customInsightsPrompt', prompt);
            setSaveStatus('synced');
        }, 800); // 800ms debounce delay

        return () => {
            clearTimeout(handler);
        };
    }, [prompt]);
    
    const handleReset = () => {
        setPrompt(DEFAULT_INSIGHTS_PROMPT);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl m-4 flex flex-col" style={{ maxHeight: '90vh' }}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Customize AI Prompt</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Edit the prompt used to generate your financial insights. Use placeholders like <code>{'{monthlyIncome}'}</code>, <code>{'{goals}'}</code>, etc., to include your data.
                </p>
                <div className="flex-grow">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-full p-3 border rounded-md resize-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        rows={15}
                    />
                </div>
                <div className="flex justify-between items-center gap-4 pt-6 mt-4 border-t dark:border-gray-600">
                    <Button type="button" variant="ghost" onClick={handleReset} className="text-red-500 hover:bg-red-500/10">
                        Reset to Default
                    </Button>
                    <div className="flex items-center gap-4">
                         <span className="text-sm text-gray-500 dark:text-gray-400 italic flex items-center gap-2 transition-opacity">
                            {saveStatus === 'saving' ? (
                                <>
                                    <Spinner size="sm" /> Saving...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check text-green-500"></i> All changes saved
                                </>
                            )}
                        </span>
                        <Button type="button" variant="ghost" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPromptsModal;
