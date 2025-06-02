import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiClient } from "../api/ApiClient";
import { ACCOUNT_API } from "../api/AccountApi";
import ClubCardList from "../components/ClubCardList";
import { mockMyClubs } from "../mock/data";
import { CLUB_API } from "../api/ClubApi";
import styles from "./MainPage.module.css";

export default function MainPage() {
  const authContext = useAuth();
  const [clubs, setClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    //setClubs(mockMyClubs);
    apiClient
      .get(CLUB_API.MAIN_CLUB(5))
      .then((res) => setClubs(res.data))
      .catch((err) => console.error(err));
    
    if (authContext.isAuthenticated) {
      apiClient.get(ACCOUNT_API.MY_CLUBS)
        .then(res => setMyClubs(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  return (
    <div className={styles.mainPage}>
      <img
        src="/images/banner.jpg"
        alt="Main Banner"
        className={styles.mainBanner}
      />
      {authContext.isAuthenticated &&
        <section className={styles.clubSection}>
          <div className={styles.sectionHeader}>
            <h2>내 모임</h2>
            <Link to="/mypage" className={styles.linkMore}>
              모두보기 →
            </Link>
          </div>
          <ClubCardList clubs={myClubs} myClub={true} />
        </section>
      }

      <section className={styles.clubSection}>
        <div className={styles.sectionHeader}>
          <h2>추천 모임</h2>
          <Link to="/exploreclub" className={styles.linkMore}>
            모두보기 →
          </Link>
        </div>
        <ClubCardList clubs={clubs} myClub={false}/>
      </section>
    </div>
  );
}
