import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ClubActivityWrite.module.css";

export default function ClubActivityWrite() {
  const { clubId, actId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    summary: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("제출 내용:", form);
    navigate(`/club/${clubId}/calendar`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 활동 내역 작성</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          활동 요약:
          <input
            type="text"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          상세 내용:
          <textarea
            name="note"
            rows="6"
            value={form.note}
            onChange={handleChange}
            required
          />
        </label>

        <div className={styles.buttons}>
          <button type="submit">완료</button>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
