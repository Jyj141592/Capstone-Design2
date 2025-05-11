import React from "react";
import styles from "./ClubManageModal.module.css";

export default function ClubManageModal({ visible, onClose, data }) {
  if (!visible) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>모임 관리</h3>
          <button className={styles.modalClose} onClick={onClose}>
            확인
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalSection}>
            <div className={styles.modalTitle}>내 모임</div>
            {data.my.map((name) => (
              <div key={name} className={styles.modalItem}>
                {name}
              </div>
            ))}
          </div>
          <div className={styles.modalSection}>
            <div className={`${styles.modalTitle} ${styles.pending}`}>대기</div>
            {data.pending.map((name) => (
              <div key={name} className={styles.modalItem}>
                {name}
              </div>
            ))}
          </div>
          <div className={styles.modalSection}>
            <div className={`${styles.modalTitle} ${styles.rejected}`}>
              거절
            </div>
            {data.rejected.map((name) => (
              <div key={name} className={styles.modalItem}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
