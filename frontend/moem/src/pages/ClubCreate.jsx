import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ClubCreate.module.css";

export default function ClubCreate() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    category: "",
    max: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("모임 생성 데이터:", form);
    alert("모임 생성 완료 (테스트)");
  };

  return (
    <div className={styles.container}>
      <h1>모임 생성</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          모임 이름
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          설명
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          최대 인원
          <input
            type="number"
            name="max"
            value={form.max}
            onChange={handleChange}
            placeholder="예: 20"
            min="1"
            max="100"
            required
          />
        </label>

        <label>
          카테고리
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="예: 운동, 문화, 독서 등"
            required
          />
        </label>

        <label>
          배너 사진
          <input type="file" onChange={handleFileChange} accept="image/*" />
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
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
