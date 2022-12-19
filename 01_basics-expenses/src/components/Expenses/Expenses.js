import { useState } from 'react';
import Card from '../UI/Card';
import ExpensesFilter from './ExpensesFilter';
import ExpensesList from './ExpensesList';
import ExpensesChart from './ExpensesChart';
import './Expenses.css';

const Expenses = ({ items }) => {
  const [filteredYear, setFilteredYear] = useState('2021');

  const filterChangeHandler = (selectedYear) => {
    setFilteredYear(selectedYear);
  };

  // filter don't need an own state variable, because with every state update (-> setFilteredYear)
  // this component is rerendered and creates new const filteredExpenses
  const filteredExpenses = items.filter(
    // getFullYear() returns num, so have to convert into string to be able to compare it
    (expense) => expense.date.getFullYear().toString() === filteredYear
  );

  return (
    <Card className='expenses'>
      <ExpensesFilter
        selected={filteredYear}
        onChangeFilter={filterChangeHandler}
      />
      {filteredExpenses.length > 0 && (
        <ExpensesChart expenses={filteredExpenses} />
      )}
      <ExpensesList items={filteredExpenses} />
    </Card>
  );
};

export default Expenses;
