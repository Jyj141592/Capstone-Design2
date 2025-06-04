import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "./ClubCalendar.module.css";

export default function ClubCalendar() {
  const navigate = useNavigate();
  const { clubId } = useParams();

  const isAdmin = true; // 현재 관리자

  const [calendarList, setCalendarList] = useState([
    {
      id: 1,
      date: "2024-05-07",
      title: "일정 1",
      place: "장소 1",
      applicants: ["신청자1", "신청자2"],
    },
    {
      id: 2,
      date: "2024-05-12",
      title: "일정 2",
      place: "장소 2",
      applicants: [],
    },
    {
      id: 3,
      date: "2024-05-25",
      title: "일정 3",
      place: "장소 3",
      applicants: [],
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newSchedule, setNewSchedule] = useState({
    date: "2025-05-25",
    title: "",
    place: "",
    description: "",
  });

  // 활동 세부 페이지로 이동
  const handleScheduleClick = (id) => {
    navigate(`/club/${clubId}/act/${id}`);
  };

  // 일정 생성 폼 제출
  const handleCreateSubmit = (e) => {
    e.preventDefault();

    const nextId = calendarList.length
      ? Math.max(...calendarList.map((item) => item.id)) + 1
      : 1;

    const newItem = {
      id: nextId,
      date: newSchedule.date,
      title: newSchedule.title,
      place: newSchedule.place,
      applicants: [],
    };

    setCalendarList([...calendarList, newItem]);
    setShowCreateModal(false);

    setNewSchedule({
      date: "2025-05-25",
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
                  <h3 className={styles.scheduleTitle}>{item.title}</h3>
                  <p className={styles.scheduleMeta}>장소: {item.place}</p>
                  <p className={styles.scheduleApplicants}>
                    {item.applicants.length > 0
                      ? `참여자: ${item.applicants.join(", ")}`
                      : "참여자: 없음"}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
