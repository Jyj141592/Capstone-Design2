import React from "react";
import "./ClubManageModal.css";

export default function ClubManageModal({ visible, onClose, data }) {
  if (!visible) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>모임 관리</h3>
          <button className="modal-close" onClick={onClose}>
            확인
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <div className="modal-title">내 모임</div>
            {data.my.map((name) => (
              <div key={name} className="modal-item">
                {name}
              </div>
            ))}
          </div>
          <div className="modal-section">
            <div className="modal-title pending">대기</div>
            {data.pending.map((name) => (
              <div key={name} className="modal-item">
                {name}
              </div>
            ))}
          </div>
          <div className="modal-section">
            <div className="modal-title rejected">거절</div>
            {data.rejected.map((name) => (
              <div key={name} className="modal-item">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
