import React, { useEffect, useState } from "react";
import { apiClient } from "../api/ApiClient";
import { ACCOUNT_API } from "../api/AccountApi";
import styles from "./ClubMyPage.module.css";
import MyActivity from "../components/MyActivity";
import WardActivity from "../components/WardActivity";

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

  useEffect(()=>{
    // apiClient.get(ACCOUNT_API.FETCH_MY_ACTIVITIES)
    //   .then(res=>setMyList(res.data))
    //   .catch(err=>console.error(err));
    // apiClient.get(ACCOUNT_API.FETCH_WARD_ACTIVITIES)
    //   .then(res=>setProtegeList(res.data))
    //   .catch(err=>console.error(err));
  },[]);

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
      {tab === 'my' ?
        <MyActivity/> :
        <WardActivity/>
      }
    </div>
  );
}
