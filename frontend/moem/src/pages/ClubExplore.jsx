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
          clubName: "치매 모임",
          category: "치매",
          // current: 1,
          // max: 2,
        },
        {
          id: 2,
          clubName: "당뇨병 모임",
          category: "당뇨",
        },
        {
          id: 3,
          clubName: "치매 모임",
          category: "치매",
        },
        {
          id: 4,
          clubName: "치매 모임",
          category: "치매",
        },
        {
          id: 5,
          clubName: "치매 모임",
          category: "치매",
        },
        {
          id: 6,
          clubName: "치매 모임",
          category: "치매",
        },
        {
          id: 7,
          clubName: "치매 모임",
          category: "치매",
        },
      ],
      추천: [
        {
          id: 8,
          clubName: "치매 모임",
          category: "치매",
        },
        {
          id: 9,
          clubName: "당뇨병 모임",
          category: "당뇨",
        },
        {
          id: 10,
          clubName: "당뇨병 모임",
          category: "당뇨",
        },
        {
          id: 11,
          clubName: "당뇨병 모임",
          category: "당뇨",
        },
        {
          id: 12,
          clubName: "당뇨병 모임",
          category: "당뇨",
        },
        {
          id: 13,
          clubName: "당뇨병 모임",
          category: "당뇨",
        },
        {
          id: 14,
          clubName: "당뇨병 모임",
          category: "당뇨",
        },
      ],
    },
    소속: [
      {
        id: 15,
        clubName: "당뇨병 모임",
        category: "당뇨",
      },
      {
        id: 16,
        clubName: "치매 모임",
        category: "치매",
      },
      {
        id: 17,
        clubName: "당뇨병 모임",
        category: "당뇨",
      },
      {
        id: 18,
        clubName: "치매 모임",
        category: "치매",
      },
      {
        id: 19,
        clubName: "당뇨병 모임",
        category: "당뇨",
      },
    ],
    교류: [
      {
        id: 20,
        clubName: "치매 모임",
        category: "치매",
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
            <h3>모집 중</h3>
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
            <h3>추천</h3>
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
              marginRight: "3px",
              padding: "10px 20px",
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
