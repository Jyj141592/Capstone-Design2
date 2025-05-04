import { useState, useRef } from "react";
import ClubCard from "../components/ClubCard";

function ClubExplore() {
  const [activeTab, setActiveTab] = useState("탐색");

  const recruitRef = useRef(null);
  const recommendRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 220;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const dummyData = {
    탐색: {
      모집: [
        {
          id: 1,
          clubName: "수영 동아리",
          category: "수영",
          photoName: "pizzas/spinaci.jpg",
          // current: 1,
          // max: 2,
        },
        {
          id: 2,
          clubName: "댄스 동아리",
          category: "댄스",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 3,
          clubName: "음악 동아리",
          category: "음악",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 4,
          clubName: "연극 동아리",
          category: "예술",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 5,
          clubName: "댄스 동아리",
          category: "댄스",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 6,
          clubName: "음악 동아리",
          category: "음악",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 7,
          clubName: "연극 동아리",
          category: "예술",
          photoName: "pizzas/spinaci.jpg",
        },
      ],
      추천: [
        {
          id: 8,
          clubName: "등산 동아리",
          category: "야외",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 9,
          clubName: "게임 동아리",
          category: "취미",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 10,
          clubName: "독서 동아리",
          category: "문화",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 11,
          clubName: "사진 동아리",
          category: "미디어",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 12,
          clubName: "게임 동아리",
          category: "취미",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 13,
          clubName: "독서 동아리",
          category: "문화",
          photoName: "pizzas/spinaci.jpg",
        },
        {
          id: 14,
          clubName: "사진 동아리",
          category: "미디어",
          photoName: "pizzas/spinaci.jpg",
        },
      ],
    },
    소속: [
      {
        id: 15,
        clubName: "등산 동아리",
        category: "야외",
        photoName: "pizzas/spinaci.jpg",
      },
      {
        id: 16,
        clubName: "등산 동아리",
        category: "야외",
        photoName: "pizzas/spinaci.jpg",
      },
      {
        id: 17,
        clubName: "등산 동아리",
        category: "야외",
        photoName: "pizzas/spinaci.jpg",
      },
      {
        id: 18,
        clubName: "등산 동아리",
        category: "야외",
        photoName: "pizzas/spinaci.jpg",
      },
      {
        id: 19,
        clubName: "등산 동아리",
        category: "야외",
        photoName: "pizzas/spinaci.jpg",
      },
    ],
    교류: [
      {
        id: 20,
        clubName: "AI 동아리",
        category: "기술",
        photoName: "pizzas/spinaci.jpg",
      },
    ],
  };

  const renderClubs = () => {
    if (activeTab === "탐색") {
      const 모집 = dummyData.탐색.모집 || [];
      const 추천 = dummyData.탐색.추천 || [];

      return (
        <>
          <section style={{ marginBottom: "30px" }}>
            <h2>모집 중</h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => scroll(recruitRef, "left")}>◀</button>
              <div
                ref={recruitRef}
                style={{
                  display: "flex",
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  paddingBottom: "10px",
                  margin: "0 10px",
                  width: "100%",
                  flexWrap: "nowrap",
                }}
              >
                {모집.map((club) => (
                  <ClubCard key={club.id} {...club} />
                ))}
              </div>
              <button onClick={() => scroll(recruitRef, "right")}>▶</button>
            </div>
          </section>

          <section>
            <h2>추천</h2>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => scroll(recommendRef, "left")}>◀</button>
              <div
                ref={recommendRef}
                style={{
                  display: "flex",
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  paddingBottom: "10px",
                  margin: "0 10px",
                  width: "100%",
                  flexWrap: "nowrap",
                }}
              >
                {추천.map((club) => (
                  <ClubCard key={club.id} {...club} />
                ))}
              </div>
              <button onClick={() => scroll(recommendRef, "right")}>▶</button>
            </div>
          </section>
        </>
      );
    }

    const tabData = dummyData[activeTab] || [];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {tabData.map((club) => (
          <ClubCard key={club.id} {...club} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        {["탐색", "소속", "교류"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: "20px",
              padding: "10px 5px",
              cursor: "pointer",
              fontWeight: activeTab === tab ? "bold" : "normal",
              borderBottom: activeTab === tab ? "3px solid black" : "none",
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      {renderClubs()}
    </div>
  );
}

export default ClubExplore;
