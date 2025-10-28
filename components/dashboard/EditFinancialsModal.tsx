import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../shared/Button';
import Input from '../shared/Input';
import type { FinancialData } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface EditFinancialsModalProps {
    onClose: () => void;
}

const EditFinancialsModal: React.FC<EditFinancialsModalProps> = ({ onClose }) => {
    const { data, updateData } = useData();
    const [formData, setFormData] = useState<Partial<FinancialData>>({
        incomeSources: [],
        monthlyExpenses: { general: 0, education: 0, healthcare: 0, food: 0 }
    });
    const lastIncomeSourceNameRef = useRef<HTMLInputElement>(null); // Ref for the last source name input
    const modalContentRef = useRef<HTMLDivElement>(null); // Ref for the scrollable modal content

    useEffect(() => {
        if (data) {
            setFormData({
                incomeGrowthRate: data.incomeGrowthRate,
                investmentReturnRate: data.investmentReturnRate,
                monthlyExpenses: { ...data.monthlyExpenses },
                // Deep copy incomeSources to prevent direct mutation of context state
                incomeSources: data.incomeSources ? JSON.parse(JSON.stringify(data.incomeSources)) : [],
            });
        }
    }, [data]);

    // This effect will focus the new input field and scroll to it when an income source is added.
    useEffect(() => {
        if (lastIncomeSourceNameRef.current) {
            lastIncomeSourceNameRef.current.focus();
            if (modalContentRef.current) {
                modalContentRef.current.scrollTo({
                    top: modalContentRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [formData.incomeSources?.length]);


    const handleGenericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
    };
    
    const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            monthlyExpenses: {
                ...prev.monthlyExpenses,
                [name]: Number(value)
            }
        }));
    };
    
    const handleIncomeSourceChange = (id: string, field: 'name' | 'amount', value: string) => {
        const newIncomeSources = formData.incomeSources?.map(source => {
            if (source.id === id) {
                return { ...source, [field]: field === 'amount' ? Number(value) : value };
            }
            return source;
        });
        setFormData(prev => ({ ...prev, incomeSources: newIncomeSources }));
    };

    const addIncomeSource = () => {
        const newSource = { id: crypto.randomUUID(), name: '', amount: 0 };
        setFormData(prev => ({
            ...prev,
            incomeSources: [...(prev.incomeSources || []), newSource]
        }));
    };
    
    const removeIncomeSource = (id: string) => {
        setFormData(prev => ({
            ...prev,
            incomeSources: prev.incomeSources?.filter(source => source.id !== id)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const totalIncome = formData.incomeSources?.reduce((sum, source) => sum + (source.amount || 0), 0) || 0;
        await updateData({ ...formData, monthlyIncome: totalIncome });
        onClose();
    };

    const totalIncome = useMemo(() => {
        return formData.incomeSources?.reduce((sum, source) => sum + (source.amount || 0), 0) || 0;
    }, [formData.incomeSources]);

    if (!data) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div ref={modalContentRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl m-4 overflow-y-auto max-h-screen">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Financials</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Monthly Income Sources</h3>
                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                            {formData.incomeSources?.length === 0 && <p className="text-center text-sm text-gray-500 dark:text-gray-400">Add an income source to get started.</p>}
                            {formData.incomeSources?.map((source, index) => {
                                const isLast = index === (formData.incomeSources?.length ?? 0) - 1;
                                return (
                                <div key={source.id} className="flex items-end gap-2">
                                    <div className="flex-grow">
                                        <Input
                                            label="Source Name"
                                            name="name"
                                            type="text"
                                            value={source.name}
                                            onChange={(e) => handleIncomeSourceChange(source.id, 'name', e.target.value)}
                                            placeholder="e.g., Salary, Freelance"
                                            ref={isLast ? lastIncomeSourceNameRef : null}
                                        />
                                    </div>
                                    <div className="w-40">
                                        <Input
                                            label="Amount (INR)"
                                            name="amount"
                                            type="number"
                                            value={source.amount}
                                            onChange={(e) => handleIncomeSourceChange(source.id, 'amount', e.target.value)}
                                            placeholder="50000"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeIncomeSource(source.id)}
                                        className="h-12 w-12 flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                                        aria-label="Remove income source"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            )})}
                             <Button
                                type="button"
                                variant="ghost"
                                onClick={addIncomeSource}
                                className="mt-2 !text-sm"
                             >
                                <i className="fa-solid fa-plus mr-2"></i>Add Source
                            </Button>
                        </div>
                        <div className="text-right font-bold text-lg text-gray-800 dark:text-white mt-2 pr-16">
                            Total Monthly Income: {formatCurrency(totalIncome)}
                        </div>
                    </div>

                    <Input label="Annual Income Growth (%)" name="incomeGrowthRate" type="number" value={formData.incomeGrowthRate || ''} onChange={handleGenericChange} />
                    <Input label="Expected Investment Return (%)" name="investmentReturnRate" type="number" value={formData.investmentReturnRate || ''} onChange={handleGenericChange} />
                    
                    <div>
                      <h3 className="text-lg font-semibold pt-4 border-t dark:border-gray-700 text-gray-800 dark:text-white">Monthly Expenses (INR)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <Input label="General" name="general" type="number" value={formData.monthlyExpenses?.general || ''} onChange={handleExpenseChange} />
                          <Input label="Education" name="education" type="number" value={formData.monthlyExpenses?.education || ''} onChange={handleExpenseChange} />
                          <Input label="Healthcare" name="healthcare" type="number" value={formData.monthlyExpenses?.healthcare || ''} onChange={handleExpenseChange} />
                          <Input label="Food" name="food" type="number" value={formData.monthlyExpenses?.food || ''} onChange={handleExpenseChange} />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFinancialsModal;