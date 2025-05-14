import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../api/ApiClient";
import { CLUB_API } from "../../api/ClubApi";
import { fetchImageUrl } from "../../services/FileService";
import styles from "./ClubCard.module.css";

function ClubCard({ clubInfo }) {
  const [imgUrl, setImgUrl] = useState("/images/image_none.jpg");
  const profileImage = "aa";

  useEffect(() => {
    fetchImageUrl(clubInfo.id, profileImage)
      .then((url) => {
        if (url) setImgUrl(url);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Link to={`/club/${clubInfo.id}/info`} className={styles.card}>
        <img src={imgUrl} alt="profile" className={styles.profile} />
        <div className={styles.title}>{clubInfo.name}</div>
      </Link>
    </div>
  );
}

export default ClubCard;
