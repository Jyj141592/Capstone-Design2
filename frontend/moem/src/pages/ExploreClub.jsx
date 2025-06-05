import { useEffect, useState } from "react";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import ClubCard from "../components/ClubCard";
import styles from "./ExploreClub.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ExploreClub() {
  const [clubs, setClubs] = useState([]);
  const [filter, setFilter] = useState("name");
  const [keyword, setKeyword] = useState(null);
  const authContext = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // setClubs([
    //   { id: 1, name: "club1" },
    //   { id: 2, name: "club2" },
    //   { id: 3, name: "club3" },
    //   { id: 4, name: "club4" },
    // ]);
    if(!authContext.isLoading){
      if(authContext.isAuthenticated){
        apiClient.get(CLUB_API.RECOMMENDED_CLUB)
          .then(res=>{
            setClubs(res.data);
          })
          .catch(err=>console.log(err));
      }
      else{
        apiClient.get(CLUB_API.MAIN_CLUB(20))
          .then(res=>setClubs(res.data))
          .catch(err=>console.log(err));
      }
    }
  }, [authContext.isAuthenticated, authContext.isLoading]);

  function onSelection(selection) {
    setFilter(selection);
  }
  function onKeyword(key) {
    setKeyword(key);
  }
  function handleSearch() {
    console.log(filter, keyword);
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
  if (authContext.isLoading) return null;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <select
          className={styles.filterSelect}
          onChange={(e) => onSelection(e.target.value)}
        >
          <option value="name">이름</option>
          <option value="interest">관심사</option>
        </select>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="모임 검색"
          onChange={(e) => onKeyword(e.target.value)}
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
            <li key={club.id}>
              <ClubCard club={club} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExploreClub;
