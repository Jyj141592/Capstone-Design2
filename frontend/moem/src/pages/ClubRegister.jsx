import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ClubRegister.module.css";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import { useNavigate } from "react-router-dom";
import { mockNotices } from "../mock/data";

function ClubRegister() {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ proteges: [], message: "" });
  const [protegeList, setProtegeList] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setNotice(mockNotices[clubId] || "주의사항 정보가 없습니다.");
    import("../mock/data").then(({ mockProteges }) =>
      setProtegeList(mockProteges)
    );
  }, [clubId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.proteges.length === 0) {
      setError("피보호자를 최소 한 명 이상 선택해야 합니다.");
      return;
    }

    setError("");
    console.log("제출 데이터:", {
      clubId,
      ...form,
    });
    alert("신청이 완료되었습니다. (테스트)");
  };

  return (
    <div className={styles.container}>
      <h1>모임 가입 신청</h1>
      <p className={styles.notice}>
        <strong>주의사항 : </strong> {notice}
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          <span>피보호자 선택</span>
          <div className={styles.protegeList}>
            {protegeList.map((p) => {
              const selected = form.proteges.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`${styles.protegeCard} ${
                    selected ? styles.selected : ""
                  }`}
                  onClick={() => {
                    const next = new Set(form.proteges);
                    selected ? next.delete(p.id) : next.add(p.id);
                    setForm((prev) => ({ ...prev, proteges: [...next] }));
                  }}
                >
                  <img src={p.avatarUrl} alt={p.name} />
                  <span>{p.name}</span>
                </div>
              );
            })}
          </div>
        </label>
        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor="message">
          가입 인사
          <textarea
            id="message"
            name="message"
            value={form.message}
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
