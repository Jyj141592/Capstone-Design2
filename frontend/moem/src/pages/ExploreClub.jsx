import { useEffect, useState } from "react";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import ClubCard from "../components/Club/ClubCard";
import styles from "./ExploreClub.module.css";
import { useNavigate } from "react-router-dom";

function ExploreClub() {
  const [clubs, setClubs] = useState([]);
  const [filter, setFilter] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setClubs([
      { id: 1, name: "club1" },
      { id: 2, name: "club2" },
      { id: 3, name: "club3" },
      { id: 4, name: "club4" },
    ]);

    apiClient.get(CLUB_API.RECOMMENDED_CLUB)
      .then(res=>{
        setClubs(res.data);
      })
      .catch(err=>console.log(err));
  }, []);

  function onSelection(selection) {
    setFilter(selection);
  }
  function onKeyword(key) {
    setKeyword(keyword);
  }
  function handleSearch() {
    let api = CLUB_API.SEARCH_CLUB;
    if (filter == "name"){
      api = `${api}?name=${keyword}`;
    }
    else if(filter == "interest"){
      api = `${api}?topic=${keyword}`;
    }
    apiClient.get(api)
      .then(res=>{
        setClubs(res.data);
      })
      .catch(err=>console.log(err));
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <select
          className={styles.filterSelect}
          onChange={(e) => onSelection(e)}
        >
          <option value="name">이름</option>
          <option value="interest">관심사</option>
        </select>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="모임 검색"
          onChange={(e) => onKeyword(e)}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          검색
        </button>
        <button
          className={styles.createButton}
          onClick={() => navigate("/club/create")}
        >
          모임 생성
        </button>
      </div>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>추천</h2>
        <ul className={styles.clubList}>
          {clubs.map((club) => (
            <li key={club.id} className={styles.clubItem}>
              <ClubCard clubInfo={club} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExploreClub;
