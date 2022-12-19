import './ExpensesFilter.css';

const ExpensesFilter = ({ selected, onChangeFilter }) => {
  const dropdownHandler = ({ target }) => {
    onChangeFilter(target.value); // pass selected filter to parent component with this fn
  };

  return (
    <div className='expenses-filter'>
      <div className='expenses-filter__control'>
        <label>Filter by year</label>
        {/* set initially default state which is passed to component via props */}
        <select value={selected} onChange={dropdownHandler}>
          <option value='2022'>2022</option>
          <option value='2021'>2021</option>
          <option value='2020'>2020</option>
          <option value='2019'>2019</option>
        </select>
      </div>
    </div>
  );
};

export default ExpensesFilter;
