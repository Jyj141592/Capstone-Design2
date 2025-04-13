import { Link } from "react-router-dom";
function PostCard({ id, title, content, author = "aaa", comments = 3 }) {
  return (
    <Link
      to={`/post/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
          {title}
        </h2>
        <p style={{ color: "#555", margin: 0 }}>{content}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#888",
          }}
        >
          <span>👤 {author}</span>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>💬 {comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
