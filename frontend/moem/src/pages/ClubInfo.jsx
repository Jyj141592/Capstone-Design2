import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import styles from "./ClubInfo.module.css";
import { fetchProfileImageUrl } from "../services/FileService";
import PostCard from "../components/PostCard";
import { mockMyClubs, mockActivities } from "../mock/data";

function ClubInfo() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [profile, setProfile] = useState('/images/image_none.jpg');
  const [activities, setActivities] = useState([]);
  const activityBoardId = 2;

  useEffect(() => {
    // const foundClub = mockMyClubs.find((c) => c.id === parseInt(clubId));
    // setClub(foundClub);
    // setActivities(mockActivities[clubId] || []);
    apiClient.get(CLUB_API.FETCH_CLUB_INFO(clubId))
      .then(res=> setClub(res.data))
      .catch(err=>console.error(err));
  }, [clubId]);

  useEffect(()=> {
    if(club !== null){
      apiClient.get(CLUB_API.FETCH_ACTIVITY_BOARD(clubId))
        .then(res=> setActivities(res.data))
        .catch(err=>console.error(err));
      if(club.profileImageName){
        fetchProfileImageUrl(club.profileImageName)
          .then(url=>setProfile(url))
          .catch(err=>console.error(err));
      }
    }
  },[club])

  if (!club) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>모임 정보</h1>
      <div className={styles.clubInfoBox}>
        <div className={styles.infoContent}>
          <img src={profile} alt="프로필 이미지" className={styles.clubImage} />
          <div className={styles.infoFields}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>이름</span>
              <span className={styles.fieldValue}>{club.name}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>설명</span>
              <span className={styles.fieldValue}>{club.description}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>지역</span>
              <span className={styles.fieldValue}>{club.region}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>관심사</span>
              <span className={styles.fieldValue}>{club.topic}</span>
            </div>
          </div>
        </div>
      </div>

      {/* <h1>{club.name}</h1>
      <p>{club.description}</p>
      <img src={club.imageUrl} alt={club.name} className={styles.image} /> */}

      <div className={styles.sectionHeader}>
        <h2>최근 활동</h2>
        {/* <Link
          to={`/club/${clubId}/${activityBoardId}`}
          className={styles.moreLink}
        >
          더보기 →
        </Link> */}
      </div>

      <ul className={styles.cardList}>
        {activities.map((act) => (
          <li key={act.postID} className={styles.cardItem}>
            <PostCard clubId={clubId} post={act}/>
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
