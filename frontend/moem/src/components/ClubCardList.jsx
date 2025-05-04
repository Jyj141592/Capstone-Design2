import React from "react";
import ClubCard from "./ClubCard";
import "./ClubCardList.css";

export default function ClubCardList({ clubs }) {
  return (
    <div className="club-card-list">
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}
