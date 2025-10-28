
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadlineYear: number;
}

export interface IncomeSource {
    id: string;
    name: string;
    amount: number;
}

export interface FinancialData {
    monthlyIncome: number; // This will be a calculated field: sum of incomeSources
    incomeSources: IncomeSource[];
    incomeGrowthRate: number; // percentage
    investmentReturnRate: number; // percentage
    monthlyExpenses: {
        general: number;
        education: number;
        healthcare: number;
        food: number;
    };
    goals: Goal[];
}