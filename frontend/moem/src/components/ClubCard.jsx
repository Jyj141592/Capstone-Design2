import React from "react";
import "./ClubCard.css";

export default function ClubCard({ club }) {
  return (
    <div className="club-card">
      <img
        src={club.imageUrl || "/images/club_default.jpg"}
        alt={club.name}
        className="club-card-img"
      />
      <div className="club-card-content">
        <p className="club-category">#{club.category}</p>
        <h3 className="club-name">{club.name}</h3>
        <p className="club-description">{club.description}</p>
        <p className="club-count">
          {club.current}/{club.max}명
        </p>
      </div>
    </div>
  );
}
