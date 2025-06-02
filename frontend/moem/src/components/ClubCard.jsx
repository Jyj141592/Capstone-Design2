import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfileImageUrl } from "../services/FileService";
import styles from "./ClubCard.module.css";

export default function ClubCard({ club, myClub=false }) {
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState("/images/image_none.jpg");

  useEffect(()=>{
    if(club.profileImageName){
      fetchProfileImageUrl(club.profileImageName)
        .then(url => {
          if(url) setProfileUrl(url);
        })
        .catch(err=> console.log(err));
    }
  },[]);

  const handleClick = () => {
    if (myClub) {
      navigate(`/club/${club.id}`);
    }
    else{
      navigate(`/club/${club.id}/info`);
    }
  };

  return (
    <div className={styles.clubCard} onClick={handleClick}>
      <img
        src={profileUrl}
        alt={club.name}
        className={styles.clubCardImg}
      />
      <div className={styles.clubCardContent}>
        <p className={styles.clubCategory}>#{club.topic}</p>
        <h3 className={styles.clubName}>{club.name}</h3>
        <p className={styles.clubDescription}>{club.description}</p>
      </div>
    </div>
  );
}
