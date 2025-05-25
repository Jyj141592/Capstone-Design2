import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ClubActivityDetail.module.css";

const initialSchedule = {
  id: 1,
  title: "세부 활동 1",
  description: "세부 활동 설명란",
  applicants: ["참여자1", "참여자2"],
  date: "2024-05-07",
};

export default function ClubActivityDetail() {
  const { clubId, actId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(initialSchedule);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedProteges, setSelectedProteges] = useState([]); // 선택된 피보호자 목록

  const isAdmin = false; // 현재 관리자 아님
  const myProteges = ["피보호자1", "피보호자2"];

  // 신청 가능한 피보호자만 필터링
  const availableProteges = myProteges.filter(
    (protege) => !schedule.applicants.includes(protege)
  );
  const isAvailableToApply = availableProteges.length > 0;

  // (관리자) 활동 내역 작성 페이지로 이동
  const handleWriteClick = () => {
    navigate(`/club/${clubId}/act/${actId}/write`);
  };

  const handleCheckboxChange = (protege) => {
    setSelectedProteges((prev) =>
      prev.includes(protege)
        ? prev.filter((p) => p !== protege)
        : [...prev, protege]
    );
  };

  // 활동 신청
  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (selectedProteges.length === 0) return;

    setSchedule((prev) => ({
      ...prev,
      applicants: [...prev.applicants, ...selectedProteges],
    }));

    setShowApplyModal(false);
    setSelectedProteges([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{schedule.title}</h1>
      <p className={styles.date}>📅 {schedule.date}</p>
      <p className={styles.description}>{schedule.description}</p>

      <div className={styles.applicantSection}>
        <h3>신청자 목록</h3>
        <ul>
          {schedule.applicants.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        {isAdmin ? (
          <button className={styles.writeButton} onClick={handleWriteClick}>
            활동 내역 작성
          </button>
        ) : isAvailableToApply ? (
          <button
            className={styles.applyButton}
            onClick={() => setShowApplyModal(true)}
          >
            신청하기
          </button>
        ) : null}

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>

      {/* 활동 신청 모달 */}
      {showApplyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>대리 신청</h2>
            <form onSubmit={handleApplySubmit}>
              <p style={{ marginBottom: "12px" }}>신청할 피보호자 선택:</p>
              {availableProteges.map((p, i) => (
                <label
                  key={i}
                  style={{ display: "block", marginBottom: "6px" }}
                >
                  <input
                    type="checkbox"
                    value={p}
                    checked={selectedProteges.includes(p)}
                    onChange={() => handleCheckboxChange(p)}
                  />
                  &nbsp;{p}
                </label>
              ))}

              <div className={styles.modalButtons}>
                <button type="submit">제출</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyModal(false);
                    setSelectedProteges([]);
                  }}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
