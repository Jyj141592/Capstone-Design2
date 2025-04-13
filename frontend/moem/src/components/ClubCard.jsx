import { Link } from "react-router-dom";

function ClubCard({ photoName, clubName, category, current = 3, max = 10 }) {
  return (
    <Link
      to={`/club/${clubName}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          width: "200px",
          flexShrink: 0,
          border: "1px solid #ccc",
          padding: "10px",
          marginRight: "10px",
        }}
      >
        <img
          src={`/${photoName}`}
          alt={clubName}
          style={{ width: "100%", height: "120px", objectFit: "cover" }}
        />
        <h3>{clubName}</h3>
        <p>{category}</p>
        <p>
          {current} / {max} 명
        </p>
      </div>
    </Link>
  );
}

export default ClubCard;
