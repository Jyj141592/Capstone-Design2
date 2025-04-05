import { useRef } from "react";
import ClubCard from "../components/ClubCard";

function ClubExplore() {
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>동아리</h1>
        <button>생성</button>
      </div>

      {/* 모집 중인 동아리 */}
      <section style={{ marginTop: "20px" }}>
        <h2>모집 중인 동아리</h2>
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
            <ClubCard
              photoName="club1.jpg"
              clubName="수영 동아리"
              category="수영"
              member={30}
            />
            <ClubCard
              photoName="club2.jpg"
              clubName="축구 동아리"
              category="축구"
              member={25}
            />
            <ClubCard
              photoName="club3.jpg"
              clubName="요리 동아리"
              category="요리"
              member={15}
            />
            <ClubCard
              photoName="club4.jpg"
              clubName="등산 동아리"
              category="야외"
              member={22}
            />
            <ClubCard
              photoName="club5.jpg"
              clubName="요가 동아리"
              category="헬스"
              member={18}
            />
            <ClubCard
              photoName="club6.jpg"
              clubName="드론 동아리"
              category="기술"
              member={10}
            />
          </div>
          <button onClick={() => scroll(recruitRef, "right")}>▶</button>
        </div>
      </section>

      {/* 추천 동아리 */}
      <section style={{ marginTop: "30px" }}>
        <h2>추천 동아리</h2>
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
            <ClubCard
              photoName="club7.jpg"
              clubName="음악 동아리"
              category="음악"
              member={18}
            />
            <ClubCard
              photoName="club8.jpg"
              clubName="댄스 동아리"
              category="댄스"
              member={12}
            />
            <ClubCard
              photoName="club9.jpg"
              clubName="보드게임 동아리"
              category="취미"
              member={20}
            />
            <ClubCard
              photoName="club10.jpg"
              clubName="사진 동아리"
              category="예술"
              member={17}
            />
            <ClubCard
              photoName="club11.jpg"
              clubName="영화 동아리"
              category="문화"
              member={22}
            />
            <ClubCard
              photoName="club12.jpg"
              clubName="봉사 동아리"
              category="사회"
              member={19}
            />
          </div>
          <button onClick={() => scroll(recommendRef, "right")}>▶</button>
        </div>
      </section>
    </div>
  );
}

export default ClubExplore;
