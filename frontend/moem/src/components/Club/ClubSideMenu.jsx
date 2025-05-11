import { useParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/ApiClient';
import { CLUB_API } from '../../api/ClubApi';
import { fetchImageUrl } from '../../services/FileService';
import styles from './ClubSideMenu.module.css'

function ClubSideMenu() {
    const {clubId} = useParams();
    const [imgUrl, setImgUrl] = useState(null);
    
    const profileImage = "5c205f7c-deff-4516-bb36-3a324908893a.png"
    useEffect(() => {
        fetchImageUrl(clubId, profileImage)
            .then(url => {
                if(url) setImgUrl(url);
            })
            .catch(err => {
                console.log(err);
            });
    }, [clubId]);

    const description = "description";

    const boardList = [{id: 'a', title: '1'}, {id: 'b', title: '2'}, {id: 'c', title: '3'}];

    return (
        <div className={styles.sidebar}>
            <div className={styles.profileSection}>
                <div className={styles.profileImageWrapper}>
                    <img src={imgUrl} alt="프로필" className={styles.profileImage}/>
                </div>
                <div className={styles.description}>{description}</div>
            </div>
            <div className={styles.boardSection}>
                <ul className={styles.boardList}>
                    {
                        boardList.map(board => (
                            <li key={board.id} className={styles.boardItem}>
                                <Link to={`/club/${clubId}/${board.id}`}>{board.title}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default ClubSideMenu;