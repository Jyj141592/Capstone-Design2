import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { apiClient } from "../api/ApiClient";
import ClubCardList from "../components/ClubCardList";
import "./MainPage.css";
import { mockMyClubs } from "../mock/data";

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
    <div className="main-page">
      <img src="/images/banner.jpg" alt="Main Banner" className="main-banner" />

      <section className="club-section">
        <div className="section-header">
          <h2>{authContext.isAuthenticated ? "내 모임" : "추천 모임"}</h2>
          <a href="/explore">모두보기 →</a>
        </div>
        <ClubCardList clubs={clubs} />
      </section>
    </div>
  );
}
