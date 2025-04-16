import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { FaUsers } from "react-icons/fa";

function ClubDetail() {
  const { id: clubName } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

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

  const mockMembers = [
    { id: 1, name: "가이름", role: "LEADER" },
    { id: 2, name: "나이름", role: "MEMBER" }, // MANAGER
    { id: 3, name: "다이름", role: "MEMBER" },
    { id: 4, name: "라이름", role: "MEMBER" },
  ];

  const renderBadge = (role) => {
    switch (role) {
      case "LEADER":
        return <span style={{ marginLeft: 8, color: "red" }}>👑 모임장</span>;
      case "MANAGER":
        return (
          <span style={{ marginLeft: 8, color: "orange" }}>⭐ 운영진</span>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "28px" }}>{clubName}</h1>
        <button
          onClick={() => setShowMembers(!showMembers)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
          }}
          title="멤버 목록"
        >
          <FaUsers />
        </button>
      </div>

      {showMembers && (
        <div
          style={{
            margin: "20px 0",
            padding: "15px 40px",
            background: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>멤버 목록</h3>
          {mockMembers.map((member) => (
            <div key={member.id} style={{ marginBottom: "8px" }}>
              {member.name} {renderBadge(member.role)}
            </div>
          ))}
        </div>
      )}

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
