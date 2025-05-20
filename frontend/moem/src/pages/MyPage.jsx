import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import ClubCardList from "../components/ClubCardList";
import ClubManageModal from "../components/ClubManageModal";
import ManageModal from "../components/ManageModal";
import styles from "./MyPage.module.css";
import { apiClient } from "../api/ApiClient";

export default function MyPage() {
  const fileInputRef = useRef();
  const authContext = useAuth();

  const [previewAvatar, setPreviewAvatar] = useState(null);

  const [profile, setProfile] = useState(null);
  const [myClubs, setMyClubs] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [proteges, setProteges] = useState([]);

  const [showClubModal, setShowClubModal] = useState(false);
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [showProtegeModal, setShowProtegeModal] = useState(false);

  useEffect(() => {
    apiClient
      .get("/api/accounts/info")
      .then((res) => {
        setProfile(res.data);
        const username = res.data.username;

        apiClient
          .get(`/api/accounts/${username}/guardians`)
          .then((res) => setGuardians(res.data))
          .catch((err) => console.error("보호자 정보 로딩 실패", err));

        apiClient
          .get(`/api/accounts/${username}/wards`)
          .then((res) => setProteges(res.data))
          .catch((err) => console.error("피보호자 정보 로딩 실패", err));
      })
      .catch((err) => console.error("프로필 로딩 실패", err));

    apiClient
      .get("/api/accounts/my-clubs")
      .then((res) => setMyClubs(res.data))
      .catch((err) => console.error("내 동아리 로딩 실패", err));
  }, []);

  const handleProfileChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewAvatar(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. 업로드 요청
      const uploadRes = await apiClient.post(
        "/files/upload/profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const uploadedFileName = uploadRes.data;

      // 2. 사용자 정보 업데이트
      await apiClient.put("/api/accounts/info", {
        ...profile,
        profileImage: uploadedFileName,
      });

      // 3. 상태 반영
      setProfile((prev) => ({
        ...prev,
        profileImage: uploadedFileName,
      }));
    } catch (err) {
      console.error("프로필 이미지 업로드 실패", err);
    }
  };

  if (!profile) return <p>로딩 중...</p>;

  return (
    <main className={styles.mainPage}>
      <section className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.profileAvatarWrapper}>
            <img
              src={previewAvatar || `/profile/${profile.profileImage}`}
              alt="프로필"
              className={styles.profileAvatar}
              onClick={handleProfileChangeClick}
            />
            <button
              className={styles.btnEdit}
              onClick={handleProfileChangeClick}
            >
              프로필 변경
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleProfileFileChange}
            />
          </div>
          <div className={styles.profileInfo}>
            <p>
              <strong>이름:</strong>{" "}
              <span className={styles.value}>{profile.name}</span>
            </p>
            <p>
              <strong>나이:</strong>{" "}
              <span className={styles.value}>{profile.age}</span>
            </p>
            <p>
              <strong>성별:</strong>{" "}
              <span className={styles.value}>{profile.gender}</span>
            </p>
            <p>
              <strong>지역:</strong>{" "}
              <span className={styles.value}>{profile.region}</span>
            </p>
            <p>
              <strong>관심사:</strong>{" "}
              <span className={styles.value}>
                {profile.interests.join(", ")}
              </span>
            </p>
            <button className={styles.btnWithdraw}>회원 탈퇴</button>
          </div>
        </div>
      </section>

      <section className={styles.clubSection}>
        <div className={styles.sectionHeader}>
          <h2>내 모임</h2>
          <button
            className={styles.linkMore}
            onClick={() => setShowClubModal(true)}
          >
            모두보기 →
          </button>
        </div>
        <ClubCardList clubs={myClubs} />
        {showClubModal && (
          <ClubManageModal onClose={() => setShowClubModal(false)} />
        )}
      </section>

      <section className={styles.personSection}>
        <div className={styles.sectionHeader}>
          <h2>보호자</h2>
          <button
            className={styles.linkMore}
            onClick={() => setShowGuardianModal(true)}
          >
            모두보기 →
          </button>
        </div>
        <div className={styles.personList}>
          {guardians.map((g) => (
            <div key={g.id} className={styles.personCard}>
              <img
                src={`/profile/${g.profileImage}`}
                alt={g.name}
                className={styles.personAvatar}
              />
              <div className={styles.personName}>{g.name}</div>
            </div>
          ))}
        </div>
        {showGuardianModal && (
          <ManageModal
            type="guardian"
            items={guardians}
            setItems={setGuardians}
            onClose={() => setShowGuardianModal(false)}
          />
        )}
      </section>

      <section className={styles.personSection}>
        <div className={styles.sectionHeader}>
          <h2>피보호자</h2>
          <button
            className={styles.linkMore}
            onClick={() => setShowProtegeModal(true)}
          >
            모두보기 →
          </button>
        </div>
        <div className={styles.personList}>
          {proteges.map((p) => (
            <div key={p.id} className={styles.personCard}>
              <img
                src={`/profile/${p.profileImage}`}
                alt={p.name}
                className={styles.personAvatar}
              />
              <div className={styles.personName}>{p.name}</div>
            </div>
          ))}
        </div>
        {showProtegeModal && (
          <ManageModal
            type="protege"
            items={proteges}
            setItems={setProteges}
            onClose={() => setShowProtegeModal(false)}
          />
        )}
      </section>
    </main>
  );
}
