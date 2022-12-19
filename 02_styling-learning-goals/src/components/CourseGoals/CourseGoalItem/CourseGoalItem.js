import './CourseGoalItem.css';

const CourseGoalItem = ({ onDelete, id, children }) => {
  // const [deleteText, setDeleteText] = useState('');

  const deleteHandler = () => {
    // setDeleteText('(Deleted!)');
    onDelete(id);
  };

  return (
    <li className='goal-item' onClick={deleteHandler}>
      {children}
    </li>
  );
};

export default CourseGoalItem;
