import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ClubInfo.module.css";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import { mockMyClubs } from "../mock/data";
import { mockActivities } from "../mock/data";

function ClubInfo() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const foundClub = mockMyClubs.find((c) => c.id === parseInt(clubId));
    setClub(foundClub);

    const clubActivities = mockActivities[clubId] || [];
    setActivities(clubActivities);
  }, [clubId]);

  if (!club) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
      <img src={club.imageUrl} alt={club.name} className={styles.image} />

      <h2>최근 활동</h2>
      <ul className={styles.activityList}>
        {activities.map((act, idx) => (
          <li key={idx}>
            <strong>{act.title}</strong> - {act.date}
            <p>{act.content}</p>
          </li>
        ))}
      </ul>

      <div className={styles.buttonRow}>
        <button className={styles.closeButton} onClick={() => navigate(-1)}>
          닫기
        </button>
        <button
          className={styles.applyButton}
          onClick={() => navigate(`/club/register?clubId=${clubId}`)}
        >
          신청하기
        </button>
      </div>
    </div>
  );
}

export default ClubInfo;

/* 
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../api/ApiClient'; // 실제 경로에 맞게 수정해줘
import styles from './ClubInfo.module.css'; // 필요하다면 CSS도

function ClubInfo() {
  const { club } = useParams(); // URL에서 club ID 가져오기
  const [clubData, setClubData] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);

  useEffect(() => {
    // 동아리 정보 불러오기
    apiClient.get(`/clubs/${club}`)
      .then(response => {
        setClubData(response.data);
      })
      .catch(error => {
        console.error('동아리 정보를 불러오는 중 오류 발생:', error);
      });

    // 동아리 활동 내역 불러오기
    apiClient.get(`/clubs/${club}/activities`)
      .then(response => {
        setActivityHistory(response.data);
      })
      .catch(error => {
        console.error('활동 내역을 불러오는 중 오류 발생:', error);
      });
  }, [club]);

  if (!clubData) return <div>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <h1>{clubData.name} 동아리 정보</h1>
      <p>{clubData.description}</p>

      <h2>활동 내역</h2>
      <ul>
        {activityHistory.length > 0 ? (
          activityHistory.map((activity, index) => (
            <li key={index}>
              <strong>{activity.title}</strong><br />
              <span>{activity.date}</span><br />
              <p>{activity.content}</p>
            </li>
          ))
        ) : (
          <p>아직 등록된 활동 내역이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default ClubInfo;

  
  
  */
