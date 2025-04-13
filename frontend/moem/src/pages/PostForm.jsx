import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function PostForm() {
  const [params] = useSearchParams();
  const club = params.get("club");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isMock = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isMock) {
      alert("글 작성 완료");
      navigate(`/club/${club}`);
      return;
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        {club ? `${club}에 글쓰기` : "글쓰기"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="본문 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          등록
        </button>
      </form>
    </div>
  );
}

export default PostForm;
