import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { apiClient } from "../api/ApiClient";
import { ACTIVITY_API } from "../api/ActivityApi";
import { ACCOUNT_API } from "../api/AccountApi";
import styles from "./ClubActivityDetail.module.css";

const initialSchedule = {
  id: 1,
  name: "",
  description: "",
  location: "",
  applicants: [],
  date: "1901-01-01",
  thumbnail: "",
};

export default function ClubActivityDetail() {
  const { clubId, actId } = useParams();
  const {clubInfo, privilege} = useOutletContext();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(initialSchedule);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [proteges, setProteges] = useState([]);
  const [includeSelf, setIncludeSelf] = useState(true);
  const [selectedProteges, setSelectedProteges] = useState([]); // 선택된 피보호자 목록

  const isAdmin = privilege === 'OWNER' || privilege === 'ADMIN';


  useEffect(()=>{
    apiClient.get(ACTIVITY_API.FETCH_ACTIVITY_DETAIL(clubId, actId))
      .then(res=>setSchedule(res.data))
      .catch(err=>console.error(err));

    apiClient.get(ACCOUNT_API.GET_WARDS_WITH_CLUB(clubId))
      .then(res=>setProteges(res.data))
      .catch(err=>console.error(err));
  },[]);

  // (관리자) 활동 내역 작성 페이지로 이동
  const handleWriteClick = () => {
    navigate(`/club/${clubId}/${clubInfo.activityBoardId}/write`);
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
    if (selectedProteges.length === 0 && !includeSelf) return;

    const req = {
      includes: includeSelf,
      wards: selectedProteges
    };

    apiClient.post(ACTIVITY_API.APPLY_ACTIVITY(clubId, actId), req)
      .catch(err=>console.error(err));
    

    setShowApplyModal(false);
    setSelectedProteges([]);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{schedule.name}</h1>
      <p className={styles.date}>📅 {schedule.date}</p>
      <p className={styles.description}>장소: {schedule.location}</p>
      <p className={styles.description}>설명: {schedule.description}</p>

      <div className={styles.applicantSection}>
        <h3>신청자 목록</h3>
        <ul>
          {schedule.applicants.map((user) => (
            <li key={user.id}>{user.user.name}</li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        {isAdmin ? (
          <button className={styles.writeButton} onClick={handleWriteClick}>
            활동 내역 작성
          </button>
        ) : (
          <button
            className={styles.applyButton}
            onClick={() => setShowApplyModal(true)}
          >
            신청하기
          </button>
        )}

        <button className={styles.backButton} onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>

      {/* 활동 신청 모달 */}
      {showApplyModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>참여 신청</h2>
            <form onSubmit={handleApplySubmit}>
              
              {
                proteges.length > 0 &&
                <>
                  <p style={{ marginBottom: "12px" }}>신청자 선택:</p>
                  {proteges.map((p, i) => (
                    <label
                      key={i}
                      style={{ display: "block", marginBottom: "6px" }}
                    >
                      <input
                        type="checkbox"
                        value={p.name}
                        checked={selectedProteges.includes(p.username)}
                        onChange={() => handleCheckboxChange(p.username)}
                      />
                      &nbsp;{p.name}
                    </label>
                  ))}
                  <label
                    key={-1}
                    style={{ display: "block", marginBottom: "6px" }}
                  >
                    <input
                      type="checkbox"
                      value='자신 포함'
                      checked={includeSelf}
                      onChange={() => setIncludeSelf(prev=>!prev)}
                    />
                    &nbsp;{'자신 포함'}
                  </label>
                </>        
              }
              <div className={styles.modalButtons}>
                <button type="submit" disabled={selectedProteges.length === 0 && !includeSelf}>제출</button>
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
