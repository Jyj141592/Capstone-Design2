import React from "react";
import styles from "./ManageModal.module.css";

export default function ManageModal({
  visible,
  title,
  items,
  onAdd,
  onRemove,
  onClose,
  onConfirm,
}) {
  if (!visible) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <div className={styles.modalActions}>
            <button className={styles.btnAdd} onClick={onAdd}>
              추가
            </button>
            <button className={styles.modalClose} onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.manageGrid}>
            {items.map((item) => (
              <div key={item.id} className={styles.manageItem}>
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className={styles.manageAvatar}
                />
                <button
                  className={styles.btnRemove}
                  onClick={() => onRemove(item.id)}
                >
                  X
                </button>
                <span className={styles.manageName}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
