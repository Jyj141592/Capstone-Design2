import { useParams } from "react-router-dom";

function PostDetail() {
  const { id } = useParams();
  const isMock = true;

  const post = isMock
    ? {
        title: "게시글 제목",
        content: `게시글 본문입니다.
  줄바꿈 줄바꿈 줄바꿈 줄바꿈
  줄바꿈
  수정 중`,
      }
    : null;

  if (!post) return <div style={{ padding: "24px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>{post.title}</h1>

      <section style={{ marginBottom: "32px" }}>
        <p
          style={{
            whiteSpace: "pre-line",
            lineHeight: "1.6",
            background: "#f9f9f9",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          {post.content}
        </p>
      </section>
    </div>
  );
}

export default PostDetail;
