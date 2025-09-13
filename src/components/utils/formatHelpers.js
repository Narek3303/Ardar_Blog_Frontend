// Տարեթիվի ֆորմատավորում
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Արժույթի ֆորմատավորում
export const formatCurrency = (amount) => {
    if (typeof amount === 'string') amount = parseFloat(amount);
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};