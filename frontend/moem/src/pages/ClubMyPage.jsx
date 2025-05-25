import React, { useState } from "react";
import styles from "./ClubMyPage.module.css";

// 내 활동
const myActivities = [
  {
    id: 1,
    title: "활동 1",
    date: "2024-05-07",
    attended: true,
    commented: true,
    isMine: true,
    comment: "다음에도 참여하고 싶어요.",
  },
  {
    id: 2,
    title: "활동 2",
    date: "2024-05-12",
    attended: false,
    commented: false,
    isMine: true,
  },
  {
    id: 3,
    title: "활동 3",
    date: "2024-05-17",
    attended: true,
    commented: false,
    isMine: true,
  },
];

// 피보호자 활동
const protegeActivities = [
  {
    id: 4,
    title: "활동 1",
    date: "2024-05-25",
    attended: true,
    commented: true,
    protegeName: "피보호자1",
    comment: "참여했습니다.",
  },
  {
    id: 5,
    title: "활동 2",
    date: "2024-06-01",
    attended: false,
    commented: false,
    protegeName: "피보호자2",
  },
];

export default function ClubMyPage() {
  const [tab, setTab] = useState("my");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [myList, setMyList] = useState(myActivities);
  const [protegeList, setProtegeList] = useState(protegeActivities);
  const [commentInput, setCommentInput] = useState("");

  const list = tab === "my" ? myList : protegeList;

  // 출석 처리
  const handleAttend = () => {
    const updateList = (prevList) =>
      prevList.map((item) =>
        item.id === selectedActivity.id ? { ...item, attended: true } : item
      );

    tab === "my" ? setMyList(updateList) : setProtegeList(updateList);
    setSelectedActivity((prev) => ({ ...prev, attended: true }));
  };

  // 코멘트 제출
  const handleSubmitComment = () => {
    if (!commentInput.trim()) return;

    const updateList = (prevList) =>
      prevList.map((item) =>
        item.id === selectedActivity.id
          ? { ...item, commented: true, comment: commentInput }
          : item
      );

    tab === "my" ? setMyList(updateList) : setProtegeList(updateList);
    setSelectedActivity(null);
    setCommentInput("");
  };

  return (
    <div className={styles.container}>
      {/* 탭 메뉴 */}
      <div className={styles.tabWrapper}>
        <button
          className={`${styles.tabButton} ${tab === "my" ? styles.active : ""}`}
          onClick={() => setTab("my")}
        >
          내 활동
        </button>
        <button
          className={`${styles.tabButton} ${
            tab === "protege" ? styles.active : ""
          }`}
          onClick={() => setTab("protege")}
        >
          피보호자 활동
        </button>
      </div>

      {/* 활동 목록 */}
      <div className={styles.listWrapper}>
        {list.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => setSelectedActivity(item)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <span className={styles.cardDate}>📅 {item.date}</span>
            </div>
            <div className={styles.cardInfo}>
              {item.protegeName && (
                <p className={styles.protegeName}>{item.protegeName}</p>
              )}
              <p>
                {item.attended ? "✔ 출석" : "❌ 미출석"} ·{" "}
                {item.commented ? "📝 작성됨" : "작성 필요"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 활동 상세 모달 */}
      {selectedActivity && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{selectedActivity.title}</h2>
            <p>📅 {selectedActivity.date}</p>
            {selectedActivity.protegeName && (
              <p>👤 {selectedActivity.protegeName}</p>
            )}
            <p>{selectedActivity.attended ? "✔ 출석 완료" : "❌ 출석 안 함"}</p>

            {/* 코멘트 O */}
            {selectedActivity.attended && selectedActivity.commented && (
              <div className={styles.commentBox}>
                <h4>작성한 코멘트</h4>
                <p>{selectedActivity.comment}</p>
              </div>
            )}

            {/* 출석 O 코멘트 X */}
            {selectedActivity.attended &&
              !selectedActivity.commented &&
              selectedActivity.isMine && (
                <div className={styles.commentForm}>
                  <label className={styles.commentLabel}>
                    코멘트 작성:
                    <textarea
                      className={styles.commentTextarea}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                    />
                  </label>
                </div>
              )}

            {/* 버튼 */}
            <div className={styles.modalButtons}>
              {!selectedActivity.attended && selectedActivity.isMine && (
                <button
                  className={`${styles.button} ${styles.attendButton}`}
                  onClick={handleAttend}
                >
                  출석하기
                </button>
              )}

              {selectedActivity.attended &&
                !selectedActivity.commented &&
                selectedActivity.isMine && (
                  <button
                    type="button"
                    className={`${styles.button} ${styles.submitButton}`}
                    onClick={handleSubmitComment}
                  >
                    제출
                  </button>
                )}

              <button
                type="button"
                className={`${styles.button} ${styles.closeButton}`}
                onClick={() => setSelectedActivity(null)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
