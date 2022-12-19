import { createPortal } from 'react-dom';
import classes from './Modal.module.css';

// use onClose prop that modal closes if user clicks on the backdrop
const Backdrop = ({ onClose }) => {
  return <div className={classes.backdrop} onClick={onClose} />;
};

const ModalOverlay = ({ children }) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

const portalEl = document.getElementById('overlays');

const Modal = ({ onClose, children }) => {
  return (
    <>
      {/* use ReactDOM Portal to move elements to another place in the DOM tree (-> to portalEl) */}
      {createPortal(<Backdrop onClose={onClose} />, portalEl)}
      {/* use children prop to forward the content between the modal tags */}
      {createPortal(<ModalOverlay>{children}</ModalOverlay>, portalEl)}
    </>
  );
};

export default Modal;
