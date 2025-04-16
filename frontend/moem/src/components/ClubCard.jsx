import { Link } from "react-router-dom";

function ClubCard({ clubName, category, current = 3, max = 10 }) {
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
          borderRadius: "10px",
          padding: "10px",
          // marginRight: "20px",
          margin: "0 20px 20px 0",
        }}
      >
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
