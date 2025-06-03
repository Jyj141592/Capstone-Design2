import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ClubRegister.module.css";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import { ACCOUNT_API } from "../api/AccountApi";
import { useNavigate } from "react-router-dom";
import { mockNotices } from "../mock/data";
import { useAuth } from "../auth/AuthContext";
import SelectPerson from "../components/SelectPerson";

function ClubRegister() {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const [joinInfo, setJoinInfo] = useState({precaution: ''});
  const [protegeList, setProtegeList] = useState([]);
  const [error, setError] = useState("");
  const [selectedList, setSelectedList] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const authContext = useAuth();

  useEffect(() => {
    apiClient.get(CLUB_API.CLUB_JOIN_INFO(clubId))
      .then(res=>setJoinInfo(res.data))
      .catch(err=>console.error(err));
    
    apiClient.get(ACCOUNT_API.GET_WARDS(authContext.username))
      .then(res=>setProtegeList(res.data))
      .catch(err=>console.error(err));
  }, [clubId]);

  function OnSelectionChange(person, selected){
    if (selected){
      const included = selectedList.includes(person.username);
      if (!included) {
        setSelectedList(prev=> [...prev, person.username]);
      }
    }
    else{
      const included = selectedList.includes(person.username);
      if (included) {
        setSelectedList(prev=> prev.filter(item=>item !== person.username));
      }
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const req = {message: message, usernames: selectedList};

    apiClient.post(CLUB_API.CLUB_JOIN(clubId), req)
      .then(res=>{
        alert("신청이 완료되었습니다.");
        navigate(-1);
      })
      .catch(err=>console.error(err));
  };

  return (
    <div className={styles.container}>
      <h1>모임 가입 신청</h1>
      <p className={styles.notice}>
        <strong>주의사항 : </strong> {joinInfo.precaution}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          <span>피보호자 선택</span>
          <div className={styles.protegeList}>
            {protegeList.map((p) => (
              <SelectPerson key={p.username} person={p} OnClick={OnSelectionChange}/>
            ))}
          </div>
        </label>
        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="message">
          가입 인사
          <textarea
            className={styles.textarea}
            id="message"
            name="message"
            value={message}
            onChange={handleChange}
            required
          />
        </label>

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button type="submit" className={styles.submitButton}>
            제출
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClubRegister;
