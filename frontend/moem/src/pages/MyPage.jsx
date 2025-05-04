import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ClubCardList from "../components/ClubCardList";
import ClubManageModal from "../components/ClubManageModal";
import ManageModal from "../components/ManageModal";
import "./MyPage.css";
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
    <div className="main-page">
      {/* 프로필 섹션 */}
      <section className="profile-section">
        <h2>내 정보</h2>
        {profile && (
          <div className="profile-card">
            <div className="profile-avatar-wrapper">
              <img
                src={profile.avatarUrl}
                alt="avatar"
                className="profile-avatar"
              />
              <button className="btn-edit">프로필 변경</button>
            </div>
            <div className="profile-info">
              <p>
                <strong>이름</strong>{" "}
                <span className="value">{profile.name}</span>
              </p>
              <p>
                <strong>나이</strong>{" "}
                <span className="value">{profile.age}</span>
              </p>
              <p>
                <strong>성별</strong>{" "}
                <span className="value">{profile.gender}</span>
              </p>
              <p>
                <strong>활동 지역</strong>{" "}
                <span className="value">{profile.region}</span>
              </p>
              <p>
                <strong>관심 주제</strong>{" "}
                <span className="value">{profile.interests.join(", ")}</span>
              </p>
            </div>
            <button className="btn-withdraw">회원 탈퇴</button>
          </div>
        )}
      </section>

      {/* 내 모임 섹션 */}
      <section className="club-section">
        <div className="section-header">
          <h2>내 모임</h2>
          <button className="link-more" onClick={() => setShowClubModal(true)}>
            모두보기 →
          </button>
        </div>
        <ClubCardList clubs={myClubs} />
        {/* Club 전용 모달 */}
        <ClubManageModal
          visible={showClubModal}
          onClose={() => setShowClubModal(false)}
          data={mockManageClubs}
        />
      </section>

      {/* 보호자 섹션 */}
      <section className="person-section">
        <h2>보호자</h2>
        <div className="person-list">
          {guardians.map((u) => (
            <div key={u.id} className="person-card">
              <img src={u.avatarUrl} alt={u.name} className="person-avatar" />
              <span className="person-name">{u.name}</span>
            </div>
          ))}
          <button className="link-more" onClick={() => openGuardianModal(true)}>
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

      {/* 피보호자 섹션 */}
      <section className="person-section">
        <h2>피보호자</h2>
        <div className="person-list">
          {proteges.map((u) => (
            <div key={u.id} className="person-card">
              <img src={u.avatarUrl} alt={u.name} className="person-avatar" />
              <span className="person-name">{u.name}</span>
            </div>
          ))}
          <button className="link-more" onClick={() => openProtegeModal(true)}>
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
