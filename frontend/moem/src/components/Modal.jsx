import styles from './Modal.module.css'

function Modal({children, onClose}) {

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} onClick={(e)=>e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>x</button>
                <div className={styles.modalBody}>    
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal;