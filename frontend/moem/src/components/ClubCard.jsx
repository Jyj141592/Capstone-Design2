function ClubCard({ photoName, clubName, member, category }) {
  return (
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
        src={photoName}
        alt={clubName}
        style={{ width: "100%", height: "120px", objectFit: "cover" }}
      />
      <h3>{clubName}</h3>
      <p>{category}</p>
      <p>{member}명</p>
    </div>
  );
}

export default ClubCard;
