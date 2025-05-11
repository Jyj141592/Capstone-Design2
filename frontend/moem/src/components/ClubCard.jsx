import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ClubCard.module.css";

export default function ClubCard({ club }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/club/${club.id}/info`);
  };

  return (
    <div className={styles.clubCard} onClick={handleClick}>
      <img
        src={club.imageUrl || "/images/club_default.jpg"}
        alt={club.name}
        className={styles.clubCardImg}
      />
      <div className={styles.clubCardContent}>
        <p className={styles.clubCategory}>#{club.category}</p>
        <h3 className={styles.clubName}>{club.name}</h3>
        <p className={styles.clubDescription}>{club.description}</p>
        <p className={styles.clubCount}>
          {club.current}/{club.max}명
        </p>
      </div>
    </div>
  );
}
