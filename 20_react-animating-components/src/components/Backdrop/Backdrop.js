import './Backdrop.css';

const backdrop = ({ show, closed }) => {
  // another approach to define conditionally css classes
  const cssClasses = ['Backdrop', show ? 'BackdropOpen' : 'BackdropClosed'];

  return <div className={cssClasses.join(' ')} onClick={closed}></div>;
};

export default backdrop;
