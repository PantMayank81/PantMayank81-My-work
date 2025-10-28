
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const addRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
};

// Calculates the required monthly contribution to reach a target amount.
export const calculateMonthlyContribution = (
    targetAmount: number,
    currentAmount: number,
    years: number,
    annualRate: number
): number => {
    if (years <= 0) return Infinity;
    
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;

    const fvCurrent = currentAmount * Math.pow(1 + monthlyRate, months);
    const remainingAmount = targetAmount - fvCurrent;

    if (remainingAmount <= 0) return 0;

    const pmt = remainingAmount * (monthlyRate / (Math.pow(1 + monthlyRate, months) - 1));

    return pmt > 0 ? pmt : 0;
};

// Iteratively calculates the required rate of return using the bisection method.
export const calculateRequiredRateOfReturn = (
    targetAmount: number,
    currentAmount: number,
    years: number,
    monthlyContribution: number
): number => {
    if (years <= 0 || monthlyContribution <= 0 || targetAmount <= currentAmount) return 0;

    const months = years * 12;
    const totalContribution = monthlyContribution * months;
    if (targetAmount <= currentAmount + totalContribution) return 0;

    let low = 0;
    let high = 100; // Assume 100% is max annual rate
    let mid = 0;

    for (let i = 0; i < 100; i++) {
        mid = (low + high) / 2;
        const monthlyRate = mid / 100 / 12;

        if (monthlyRate === 0) { // Avoid division by zero
            low = mid;
            continue;
        }

        const fvCurrent = currentAmount * Math.pow(1 + monthlyRate, months);
        const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        const futureValue = fvCurrent + fvContributions;

        if (futureValue > targetAmount) {
            high = mid;
        } else {
            low = mid;
        }
    }

    return mid;
};
