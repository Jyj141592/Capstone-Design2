import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiClient } from "../api/ApiClient";
import ClubCardList from "../components/ClubCardList";
import { mockMyClubs } from "../mock/data";
import styles from "./MainPage.module.css";

export default function MainPage() {
  const authContext = useAuth();
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    setClubs(mockMyClubs);
    // apiClient
    //   .get("/api/clubs")
    //   .then((res) => setClubs(res.data))
    //   .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.mainPage}>
      <img
        src="/images/banner.jpg"
        alt="Main Banner"
        className={styles.mainBanner}
      />

      <section className={styles.clubSection}>
        <div className={styles.sectionHeader}>
          <h2>{authContext.isAuthenticated ? "내 모임" : "추천 모임"}</h2>
          <Link to="/exploreclub" className={styles.linkMore}>
            모두보기 →
          </Link>
        </div>
        <ClubCardList clubs={clubs} />
      </section>
    </div>
  );
}
