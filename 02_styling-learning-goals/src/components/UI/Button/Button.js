// Variant 1) normal way
// import './Button.css';

// const Button = ({ type, onClick, children }) => {
//   return (
//     <button type={type} className='button' onClick={onClick}>
//       {children}
//     </button>
//   );
// };

// Variant 2) Styling with CSS Modules
// creates unique versions of the styles in your css file, so they apply only to the wished component
// AND you avoid to have them in the global scope;
// it's already prefconfigured in React: https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/
// a) rename css file to Filename.module.css
// b) use -> import styles from './Filename.module.css'
// c) replace className string with obj styles and add your needed classes as a property
import styles from './Button.module.css';

const Button = ({ type, onClick, children }) => {
  return (
    <button type={type} className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

// Variant 3) use case for styled components package to apply styles only to one component
// import styled from 'styled-components';

// button is method on styled obj; what's inside backticks is passed inside method in special way;
// styled obj has methods for all HTML tags (div, p ...);
// add css rules between backticks, remove button element, because it's automatically added to button element;
// when using pseudo-classes, use & sign
// const Button = styled.button`
//   width: 100%;
//   font: inherit;
//   padding: 0.5rem 1.5rem;
//   border: 1px solid #8b005d;
//   color: white;
//   background: #8b005d;
//   box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
//   cursor: pointer;

//   @media (min-width: 768px) {
//     width: auto;
//   }

//   &:focus {
//     outline: none;
//   }

//   &:hover,
//   &:active {
//     background: #ac0e77;
//     border-color: #ac0e77;
//     box-shadow: 0 0 8px rgba(0, 0, 0, 0.26);
//   }
// `;

export default Button;
