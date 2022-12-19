import Chart from '../Chart/Chart';

const ExpensesChart = ({ expenses }) => {
  const chartDataPoints = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 0 },
    { label: 'Mar', value: 0 },
    { label: 'Apr', value: 0 },
    { label: 'May', value: 0 },
    { label: 'Jun', value: 0 },
    { label: 'Jul', value: 0 },
    { label: 'Aug', value: 0 },
    { label: 'Sep', value: 0 },
    { label: 'Oct', value: 0 },
    { label: 'Nov', value: 0 },
    { label: 'Dec', value: 0 },
  ];

  // for of loop (NOT for in because expenses is array, NOT object)
  // through filtered expenses data and update chartDataPoints
  for (const expense of expenses) {
    const expenseMonth = expense.date.getMonth(); // return month number starting at 0 for January
    chartDataPoints[expenseMonth].value += expense.amount; // use month num as array index
  }

  return <Chart dataPoints={chartDataPoints} />;
};

export default ExpensesChart;
