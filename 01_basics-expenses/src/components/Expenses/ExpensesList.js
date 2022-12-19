import ExpenseItem from './ExpenseItem';
import './ExpensesList.css';

const ExpensesList = ({ items }) => {
  if (items.length === 0) {
    return <h2 className='expenses-list__fallback'>Found no expenses.</h2>;
  }

  return (
    <ul className='expenses-list'>
      {items.map((expense) => (
        <ExpenseItem
          // "key" is needed for React to identify the individual component; any num or string can be unique identifier
          key={expense.id}
          title={expense.title}
          amount={expense.amount}
          date={expense.date}
        />
      ))}
    </ul>
  );
};

export default ExpensesList;
