import { useParams, Link } from "react-router-dom";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import PostCard from "../components/Club/PostCard";
import styles from './ClubMain.module.css'
import { useEffect, useState } from "react";


function ClubMain(){
    const {clubId} = useParams();
    const [notices, setNotices] = useState([]);
    const [activities, setActivities] = useState([]);

    const noticeBoard = 1;
    const activityBoard = 2;
    useEffect(()=>{
        setNotices([{id: 1, title: 'notice1'}, {id: 2, title: 'notice2'}]);
        setActivities([{id: 1, title:'act1'}, {id: 2, title:'act2'}, {id: 3, title:'act3'}, {id: 4, title:'act4'}]);
    },[]);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.section}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>공지</h2>
                    <Link to={`/club/${clubId}/${noticeBoard}`} className={styles.more}>더보기 {'>'}</Link>
                </div>
                <ul className={styles.list}>
                    {
                        notices.map(notice => (
                            <li key={notice.id} className={styles.listItem}>
                                <Link to={`/club/${clubId}/${noticeBoard}/${notice.id}`} className={styles.link}>{notice.title}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className={styles.section}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>활동 내역</h2>
                    <Link to={`/club/${clubId}/${activityBoard}`} className={styles.more}>더보기 {'>'}</Link>
                </div>
                <ul className={styles.cardList}>
                    {
                        activities.map(act => (
                            <li key={act.id} className={styles.cardItem}>
                                <PostCard clubId={clubId} boardId={activityBoard} post={act}/>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default ClubMain;