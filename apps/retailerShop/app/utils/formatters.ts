export const formatAmount = (value: number | string | undefined | null) => {
    if (value === undefined || value === null || value === '') return value;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return value;
    return parseFloat(num.toFixed(2));
};
