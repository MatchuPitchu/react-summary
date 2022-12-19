import Card from '../UI/Card';
import ExpenseDate from './ExpenseDate';
import './ExpenseItem.css';

// this component is called presentational or stateless component because it has no state
const ExpenseItem = ({ title, amount, date }) => {
  return (
    <li>
      <Card className='expense-item'>
        <ExpenseDate date={date} />
        <div className='expense-item__description'>
          <h2>{title}</h2>
          <div className='expense-item__price'>${amount}</div>
        </div>
      </Card>
    </li>
  );
};

export default ExpenseItem;
