import React from "react";
import "./ManageModal.css";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <div className="modal-actions">
            <button className="btn-add" onClick={onAdd}>
              추가
            </button>
            <button className="modal-close" onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="manage-grid">
            {items.map((item) => (
              <div key={item.id} className="manage-item">
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="manage-avatar"
                />
                <button
                  className="btn-remove"
                  onClick={() => onRemove(item.id)}
                >
                  X
                </button>
                <span className="manage-name">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
