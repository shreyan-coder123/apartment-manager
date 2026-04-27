const generateInsights = (bills, messages) => {
  const insights = [];

  if (!bills || bills.length === 0) return insights;

  // Group bills by type and month
  const billsByType = {};
  bills.forEach(bill => {
    if (!billsByType[bill.type]) {
      billsByType[bill.type] = [];
    }
    billsByType[bill.type].push(bill);
  });

  // Check for bill increases
  Object.keys(billsByType).forEach(type => {
    const typeBills = billsByType[type].sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    if (typeBills.length >= 2) {
      const latest = typeBills[typeBills.length - 1];
      const previous = typeBills[typeBills.length - 2];

      if (latest.amount > previous.amount * 1.1) { // 10% increase
        insights.push({
          type: 'warning',
          message: `Your ${type} bill increased by ${Math.round(((latest.amount - previous.amount) / previous.amount) * 100)}% this month`
        });
      }
    }
  });

  // Check for unpaid bills
  const unpaidBills = bills.filter(bill => bill.status === 'unpaid');
  if (unpaidBills.length > 0) {
    insights.push({
      type: 'info',
      message: `You have ${unpaidBills.length} ${unpaidBills.length === 1 ? 'unpaid bill' : 'unpaid bills'}`
    });
  }

  // Check for overdue bills
  const now = new Date();
  const overdueBills = bills.filter(bill =>
    bill.status === 'unpaid' && new Date(bill.dueDate) < now
  );
  if (overdueBills.length > 0) {
    insights.push({
      type: 'error',
      message: `You have ${overdueBills.length} overdue bill${overdueBills.length > 1 ? 's' : ''}`
    });
  }

  // Add some generic insights if we have data
  if (insights.length === 0 && bills.length > 0) {
    insights.push({
      type: 'success',
      message: `All your bills are up to date! Great job managing your expenses.`
    });
  }

  return insights;
};

export { generateInsights };