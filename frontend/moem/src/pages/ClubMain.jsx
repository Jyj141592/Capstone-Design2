import { useParams, Link, useOutletContext } from "react-router-dom";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import PostCard from "../components/Club/PostCard";
import styles from './ClubMain.module.css'
import { useEffect, useState } from "react";


function ClubMain(){

    const clubInfo = useOutletContext();
    const [notices, setNotices] = useState([]);
    const [activities, setActivities] = useState([]);

    const noticeBoard = 1;
    const activityBoard = 2;
    useEffect(()=>{
        // apiClient.get(CLUB_API.FETCH_POST_LIST(clubInfo.id, clubInfo.noticeBoardId))
        //     .then(res=>{
        //         setNotices(res.data);
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     });
        //     apiClient.get(CLUB_API.FETCH_POST_LIST(clubInfo.id, clubInfo.activityBoardId))
        //     .then(res=>{
        //         setActivities(res.data);
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     });
        
        setNotices([{id: 1, title: 'notice1'}, {id: 2, title: 'notice2'}]);
        setActivities([{id: 1, title:'act1', createdAt: '2025-05-10', thumbnail: null}, {id: 2, title:'act2', createdAt: '2025-05-10', thumbnail: null}, {id: 3, title:'act3', createdAt: '2025-05-10', thumbnail: null}, {id: 4, title:'act4', createdAt: '2025-05-10', thumbnail: null}]);
    },[]);

    return (
        <div className={styles.mainContainer}>
            <div className={styles.section}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>공지</h2>
                    <Link to={`/club/${clubInfo.id}/${noticeBoard}`} className={styles.more}>더보기 {'>'}</Link>
                </div>
                <ul className={styles.list}>
                    {
                        notices.map(notice => (
                            <li key={notice.id} className={styles.listItem}>
                                <Link to={`/club/${clubInfo.id}/${noticeBoard}/${notice.id}`} className={styles.link}>{notice.title}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className={styles.section}>
                <div className={styles.headerRow}>
                    <h2 className={styles.title}>활동 내역</h2>
                    <Link to={`/club/${clubInfo.id}/${activityBoard}`} className={styles.more}>더보기 {'>'}</Link>
                </div>
                <ul className={styles.cardList}>
                    {
                        activities.map(act => (
                            <li key={act.id} className={styles.cardItem}>
                                <PostCard clubId={clubInfo.id} boardId={activityBoard} post={act}/>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default ClubMain;