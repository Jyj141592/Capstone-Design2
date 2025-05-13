import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ClubInfo.module.css";
import { mockMyClubs, mockActivities } from "../mock/data";

function ClubInfo() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [activities, setActivities] = useState([]);
  const activityBoardId = 2;

  useEffect(() => {
    const foundClub = mockMyClubs.find((c) => c.id === parseInt(clubId));
    setClub(foundClub);
    setActivities(mockActivities[clubId] || []);
  }, [clubId]);

  if (!club) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
      <img src={club.imageUrl} alt={club.name} className={styles.image} />

      <div className={styles.sectionHeader}>
        <h2>최근 활동</h2>
        <Link
          to={`/club/${clubId}/${activityBoardId}`}
          className={styles.moreLink}
        >
          더보기 →
        </Link>
      </div>

      <ul className={styles.activityList}>
        {activities.map((act) => (
          <li key={act.id}>
            <Link
              to={`/club/${clubId}/${activityBoardId}/${act.id}`}
              className={styles.activityLink}
            >
              <div className={styles.activityTitleRow}>
                <strong>{act.title}</strong>
                <span className={styles.date}>{act.date}</span>
              </div>
              <p>{act.content}</p>
            </Link>
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
