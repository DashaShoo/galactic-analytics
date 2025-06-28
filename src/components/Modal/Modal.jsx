import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { ClearButton } from '../ClearButton/ClearButton';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} data-testid="modal">
        <div className={styles.closeButton}>
          <ClearButton mode="clear" onClick={onClose}></ClearButton>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
