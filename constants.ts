import { Goal } from './types';

export const INFLATION_RATES = {
    general: 0.06,
    education: 0.11,
    healthcare: 0.12,
    food: 0.08,
};

export const PREDEFINED_GOALS: Omit<Goal, 'currentAmount'>[] = [
    { id: 'emergency_fund', name: 'Emergency Fund', targetAmount: 0, deadlineYear: 2025 }, // Target is calculated dynamically
    { id: 'retirement', name: 'Retirement', targetAmount: 30000000, deadlineYear: 2053 },
    { id: 'child_education', name: 'Child Education', targetAmount: 5000000, deadlineYear: 2043 },
    { id: 'home_down_payment', name: 'Home Down Payment', targetAmount: 2000000, deadlineYear: 2030 },
    { id: 'car_purchase', name: 'Car Purchase', targetAmount: 1200000, deadlineYear: 2028 },
    { id: 'vacation_fund', name: 'Vacation Fund', targetAmount: 300000, deadlineYear: 2026 },
    { id: 'wedding_fund', name: 'Wedding Fund', targetAmount: 2500000, deadlineYear: 2032 },
    { id: 'wealth_building', name: 'Wealth Building', targetAmount: 10000000, deadlineYear: 2040 },
];
