import React from "react";
import ClubCard from "./ClubCard";
import styles from "./ClubCardList.module.css";

export default function ClubCardList({ clubs, myClub }) {
  return (
    <div className={styles.clubCardList}>
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} myClub={myClub}/>
      ))}
    </div>
  );
}
