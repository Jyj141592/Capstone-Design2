import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLUB_API } from "../api/ClubApi";
import { apiClient } from "../api/ApiClient";

function CreateClub() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !maxMembers) {
      alert("모임 이름과 제한 인원은 필수입니다.");
      return;
    }

    try {
      // 하드코딩
      const requestData = {
        name,
        description,
        public: true,
        owner: {
          id: 1,
          username: "han",
          password: "1234",
        },
      };

      await apiClient.post(CLUB_API.CREATE_CLUB, requestData);
      alert("모임이 생성되었습니다!");
      navigate("/explore");
    } catch (error) {
      if (error.response?.status === 403) {
        alert("권한이 없습니다. 로그인이 필요합니다.");
      } else {
        alert("모임 생성 실패");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>모임 생성</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="모임 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            placeholder="제한 인원 (최대)"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <textarea
            placeholder="모임 설명"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
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
          생성
        </button>
      </form>
    </div>
  );
}

export default CreateClub;
