import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import ClubCardList from "../components/ClubCardList";
import ClubManageModal from "../components/ClubManageModal";
import ManageModal from "../components/ManageModal";
import styles from "./MyPage.module.css";
import { apiClient } from "../api/ApiClient";
import { ACCOUNT_API } from "../api/AccountApi";
import { useNavigate } from "react-router-dom";
import { fetchProfileImageUrl } from "../services/FileService";
import WardModal from "../components/WardModal";
import ProfileList from "../components/ProfileList";
import JoinRequestList from "../components/JoinRequestList";

export default function MyPage() {
  const fileInputRef = useRef();
  const authContext = useAuth();
  const navigate = useNavigate();

  const [previewAvatar, setPreviewAvatar] = useState('/images/avatar_default.jpg');

  const [profile, setProfile] = useState(null);
  const [myClubs, setMyClubs] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [proteges, setProteges] = useState([]);
  const [joinRequest, setJoinRequest] = useState([]);

  const [showClubModal, setShowClubModal] = useState(false);
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [showProtegeModal, setShowProtegeModal] = useState(false);

  useEffect(() => {
    if(authContext.isLoading) return;
    else if(!authContext.isAuthenticated) navigate('/');
    apiClient
      .get(ACCOUNT_API.ACCOUNT_INFO)
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => console.error("프로필 로딩 실패", err));
  }, [authContext.isLoading, authContext.isAuthenticated]);

  useEffect(()=>{
    if(profile){
      if(profile.profileImage){
        fetchProfileImageUrl(profile.profileImage)
          .then(url=> {
            if(url){
              setPreviewAvatar(url);
            }
          })
          .catch(err=>console.error(err));
      }
      apiClient
        .get(ACCOUNT_API.GET_GUARDIANS(authContext.username))
        .then((res) => setGuardians(res.data))
        .catch((err) => console.error("보호자 정보 로딩 실패", err));

      apiClient
        .get(ACCOUNT_API.GET_WARDS(authContext.username))
        .then((res) => setProteges(res.data))
        .catch((err) => console.error("피보호자 정보 로딩 실패", err));
      apiClient
        .get(ACCOUNT_API.MY_CLUBS)
        .then((res) => setMyClubs(res.data))
        .catch((err) => console.error("내 동아리 로딩 실패", err));
      apiClient
        .get(ACCOUNT_API.JOIN_REQUESTS)
        .then(res=>setJoinRequest(res.data))
        .catch(err=>console.error(err));
    }
  }, [profile])

  if(authContext.isLoading) return null;
  else if(!authContext.isAuthenticated) navigate('/');

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
              src={previewAvatar}
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
              <span className={styles.value}>{profile.gender === 'male' ? '남성' : '여성'}</span>
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
          </div>
        </div>
      </section>

      <section className={styles.clubSection}>
        <div className={styles.sectionHeader}>
          <h2>내 모임</h2>
          <button
            className={styles.linkMore}
            onClick={() => navigate('/myactivity')}
          >
            내 활동 보기 →
          </button>
        </div>
        <ClubCardList clubs={myClubs} myClub={true}/>
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
        <ProfileList profiles={guardians} count = {5}/>
        {/* <div className={styles.personList}>
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
        </div> */}
        {showGuardianModal && (
          // <ManageModal
          //   type="guardian"
          //   items={guardians}
          //   setItems={setGuardians}
          //   onClose={() => setShowGuardianModal(false)}
          // />
          <WardModal 
            type='guardian'
            onClose={() => setShowGuardianModal(false)}
            profiles={guardians}
            onChanged={setGuardians}  
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
        {/* <div className={styles.personList}>
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
        </div> */}
        <ProfileList profiles={proteges} count ={5}/>
        {showProtegeModal && (
          // <ManageModal
          //   type="protege"
          //   items={proteges}
          //   setItems={setProteges}
          //   onClose={() => setShowProtegeModal(false)}
          // />
          <WardModal 
            type='ward'
            onClose={() => setShowProtegeModal(false)}
            profiles={proteges}
            onChanged={setProteges}  
          />
        )}
      </section>
      <section>
        <div className={styles.sectionHeader}>
          <h2>신청 내역</h2>
        </div>
        <JoinRequestList requests={joinRequest}/>
      </section>
    </main>
  );
}
