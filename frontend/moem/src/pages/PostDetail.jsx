import { useParams } from "react-router-dom";

function PostDetail() {
  const { id } = useParams();
  const isMock = true;

  const post = isMock
    ? {
        title: "게시글 제목",
        author: "가이름",
        content: `게시글 본문입니다.
        게시글 본문
        게시글 본문
        게시글 본문
        게시글 본문
        게시글 본문`,
      }
    : null;

  if (!post) return <div style={{ padding: "24px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        {post.title}

        <span style={{ fontSize: "13px", marginLeft: "20px", color: "#999" }}>
          by {post.author}
        </span>
      </h1>

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
