import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

function ClubDetail() {
  const { id: clubName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const isMock = true;

  useEffect(() => {
    if (isMock) {
      const mockPosts = [
        {
          id: 1,
          title: "공지사항 글",
          content: "공지입니다.",
          club: clubName,
          isNotice: true,
        },
        {
          id: 2,
          title: "일반글",
          content: "내용입니다.",
          club: clubName,
          isNotice: false,
        },
        {
          id: 3,
          title: "일반글",
          content: "내용입니다.",
          club: clubName,
          isNotice: false,
        },
      ];
      setPosts(mockPosts);
    }
  }, [clubName]);

  const notices = posts.filter((p) => p.isNotice);
  const normals = posts.filter((p) => !p.isNotice);

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "32px", fontSize: "28px" }}>
        {clubName} 게시판
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {notices.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
        {normals.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      <div style={{ textAlign: "right", marginTop: "30px" }}>
        <button
          style={{
            backgroundColor: "#444",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/post/write?club=${clubName}`)}
        >
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default ClubDetail;
