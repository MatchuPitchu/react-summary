import styles from './Button.module.css';

const Button = ({ type, onClick, children }) => {
  return (
    // if no type is passed in, then use fallback 'button'
    <button className={styles.button} type={type || 'button'} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
