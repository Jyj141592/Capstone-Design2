import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ClubCardList from "../components/ClubCardList";
import ClubManageModal from "../components/ClubManageModal";
import ManageModal from "../components/ManageModal";
import styles from "./MyPage.module.css";
import {
  mockProfile,
  mockMyClubs,
  mockGuardians,
  mockProteges,
  mockManageClubs,
  mockManageGuardians,
  mockManageProteges,
} from "../mock/data";

export default function MyPage() {
  const authContext = useAuth();

  const [profile, setProfile] = useState(null);
  const [myClubs, setMyClubs] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [proteges, setProteges] = useState([]);

  const [showClubModal, setShowClubModal] = useState(false);
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [showProtegeModal, setShowProtegeModal] = useState(false);

  const [tempGuardians, setTempGuardians] = useState([]);
  const [tempProteges, setTempProteges] = useState([]);

  useEffect(() => {
    setProfile(mockProfile);
    setMyClubs(mockMyClubs);
    setGuardians(mockGuardians);
    setProteges(mockProteges);
    setTempGuardians(mockManageGuardians);
    setTempProteges(mockManageProteges);
  }, []);

  const openGuardianModal = () => {
    setTempGuardians(
      mockManageGuardians.filter((g) => guardians.some((u) => u.id === g.id))
    );
    setShowGuardianModal(true);
  };

  const openProtegeModal = () => {
    setTempProteges(
      mockManageProteges.filter((p) => proteges.some((u) => u.id === p.id))
    );
    setShowProtegeModal(true);
  };

  const handleRemoveGuardian = (id) => {
    setTempGuardians((prev) => prev.filter((u) => u.id !== id));
  };

  const handleRemoveProtege = (id) => {
    setTempProteges((prev) => prev.filter((u) => u.id !== id));
  };

  const confirmGuardianChanges = () => {
    setGuardians(tempGuardians);
  };

  const confirmProtegeChanges = () => {
    setProteges(tempProteges);
  };

  return (
    <div className={styles.mainPage}>
      <section className={styles.profileSection}>
        <h2>내 정보</h2>
        {profile && (
          <div className={styles.profileCard}>
            <div className={styles.profileAvatarWrapper}>
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className={styles.profileAvatar}
              />
              <button className={styles.btnEdit}>프로필 변경</button>
            </div>
            <div className={styles.profileInfo}>
              <p>
                <strong>이름</strong>{" "}
                <span className={styles.value}>{profile.name}</span>
              </p>
              <p>
                <strong>나이</strong>{" "}
                <span className={styles.value}>{profile.age}</span>
              </p>
              <p>
                <strong>성별</strong>{" "}
                <span className={styles.value}>{profile.gender}</span>
              </p>
              <p>
                <strong>활동 지역</strong>{" "}
                <span className={styles.value}>{profile.region}</span>
              </p>
              <p>
                <strong>관심 주제</strong>{" "}
                <span className={styles.value}>
                  {profile.interests.join(", ")}
                </span>
              </p>
            </div>
            <button className={styles.btnWithdraw}>회원 탈퇴</button>
          </div>
        )}
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
        <ClubManageModal
          visible={showClubModal}
          onClose={() => setShowClubModal(false)}
          data={mockManageClubs}
        />
      </section>

      <section className={styles.personSection}>
        <h2>보호자</h2>
        <div className={styles.personList}>
          {guardians.map((u) => (
            <div key={u.id} className={styles.personCard}>
              <img
                src={u.avatarUrl}
                alt={u.name}
                className={styles.personAvatar}
              />
              <span className={styles.personName}>{u.name}</span>
            </div>
          ))}
          <button
            className={styles.linkMore}
            onClick={() => openGuardianModal(true)}
          >
            모두보기 →
          </button>
        </div>
        <ManageModal
          visible={showGuardianModal}
          title="보호자 관리"
          items={tempGuardians}
          onAdd={() => {}}
          onRemove={handleRemoveGuardian}
          onClose={() => setShowGuardianModal(false)}
          onConfirm={confirmGuardianChanges}
        />
      </section>

      <section className={styles.personSection}>
        <h2>피보호자</h2>
        <div className={styles.personList}>
          {proteges.map((u) => (
            <div key={u.id} className={styles.personCard}>
              <img
                src={u.avatarUrl}
                alt={u.name}
                className={styles.personAvatar}
              />
              <span className={styles.personName}>{u.name}</span>
            </div>
          ))}
          <button
            className={styles.linkMore}
            onClick={() => openProtegeModal(true)}
          >
            모두보기 →
          </button>
        </div>
        <ManageModal
          visible={showProtegeModal}
          title="피보호자 관리"
          items={tempProteges}
          onAdd={() => {}}
          onRemove={handleRemoveProtege}
          onClose={() => setShowProtegeModal(false)}
          onConfirm={confirmProtegeChanges}
        />
      </section>
    </div>
  );
}
