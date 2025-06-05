import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { apiClient } from "../api/ApiClient";
import { ACTIVITY_API } from "../api/ActivityApi";
import "react-calendar/dist/Calendar.css";
import styles from "./ClubCalendar.module.css";

export default function ClubCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2,'0');
  const date = `${year}-${month}-${day}`;

  const navigate = useNavigate();
  const { clubInfo, privilege } = useOutletContext();

  const isAdmin = privilege === 'OWNER' || privilege === 'ADMIN'; // 현재 관리자

  const [calendarList, setCalendarList] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newSchedule, setNewSchedule] = useState({
    date: date,
    title: "",
    place: "",
    description: "",
  });

  useEffect(()=> {
    apiClient.get(ACTIVITY_API.FETCH_ACTIVITY_LIST(clubInfo.id, 2025, 6))
      .then(res => setCalendarList(res.data))
      .catch(err=>console.error(err));


  },[]);

  // 활동 세부 페이지로 이동
  const handleScheduleClick = (id) => {
    navigate(`/club/${clubInfo.id}/act/${id}`);
  };

  // 일정 생성 폼 제출
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    const newItem = {
      date: newSchedule.date,
      name: newSchedule.title,
      location: newSchedule.place,
      description: newSchedule.description,
    };

    apiClient.post(ACTIVITY_API.CREATE_ACTIVITY(clubInfo.id), newItem)
      .then(res=>setCalendarList(prev=>[...prev, res.data]))
      .catch(err=>console.error(err));

    setShowCreateModal(false);

    setNewSchedule({
      date: date,
      title: "",
      place: "",
      description: "",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>📅 일정</h1>
        {isAdmin && (
          <button
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            + 일정 생성
          </button>
        )}
      </div>

      {/* 일정 생성 모달 */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>일정 생성</h2>
            <form onSubmit={handleCreateSubmit} className={styles.modalForm}>
              <label>
                날짜:
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, date: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                제목:
                <input
                  type="text"
                  value={newSchedule.title}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                장소:
                <input
                  type="text"
                  value={newSchedule.place}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, place: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                설명:
                <textarea
                  value={newSchedule.description}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </label>
              <div className={styles.modalButtons}>
                <button type="submit">제출</button>
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 일정 리스트 */}
      <div className={styles.scheduleList}>
        {[...calendarList]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((item) => (
            <div
              key={item.id}
              className={styles.scheduleCard}
              onClick={() => handleScheduleClick(item.id)}
            >
              <div className={styles.scheduleContent}>
                <div>
                  <p className={styles.scheduleDate}>
                    {new Date(item.date).toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </p>
                  <h3 className={styles.scheduleTitle}>{item.name}</h3>
                  <p className={styles.scheduleMeta}>장소: {item.location}</p>
                  <p className={styles.scheduleMeta}>설명: {item.description}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
