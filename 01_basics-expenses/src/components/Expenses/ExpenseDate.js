import './ExpenseDate.css';

const ExpenseDate = ({ date }) => {
  // use date obj formatting methods: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  const month = date.toLocaleString('de-DE', { month: 'long' });
  const day = date.toLocaleString('de-DE', { day: '2-digit' });
  const year = date.getFullYear();

  return (
    <div className='expense-date'>
      <div className='expense-date__month'>{month}</div>
      <div className='expense-date__year'>{year}</div>
      <div className='expense-date__day'>{day}</div>
    </div>
  );
};

export default ExpenseDate;
