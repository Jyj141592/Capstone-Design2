import { useParams, Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/ApiClient';
import { CLUB_API } from '../../api/ClubApi';
import { fetchProfileImageUrl } from '../../services/FileService';
import styles from './ClubSideMenu.module.css'

function ClubSideMenu({clubInfo, privilege}) {
    const [imgUrl, setImgUrl] = useState("/images/image_none.jpg");
    const [boards, setBoards] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if(clubInfo.profileImageName){
            fetchProfileImageUrl(clubInfo.profileImageName)
                .then(url => {
                    if(url) setImgUrl(url);
                })
                .catch(err => {
                    console.log(err);
                });
        }
        apiClient.get(CLUB_API.FETCH_BOARD_LIST(clubInfo.id))
            .then(res=>{
                setBoards(res.data);
            })
            .catch(err=>{
                console.log(err);
            })
        
        //setBoards([{id: 'a', name: '게시판1'}, {id: 'b', name: '게시판2'}, {id: 'c', name: '게시판3'}]);
    }, [clubInfo]);

    return (
        <div className={styles.sidebar}>
            <div className={styles.profileSection}>
                <div className={styles.profileImageWrapper}>
                    <img src={imgUrl} alt="프로필" className={styles.profileImage}/>
                </div>
                <h2 className={styles.name}>{clubInfo.name}</h2>
                <div className={styles.description}>{clubInfo.description}</div>
                <div className={styles.buttonGroupWrapper}>
                    <div className={styles.buttonGroup}>
                        <button className={styles.navButton} onClick={()=>navigate(`/club/${clubInfo.id}/calendar`)}>일정</button>
                        {(privilege === 'OWNER' || privilege === 'ADMIN') &&
                            <button className={styles.navButton} onClick={()=>navigate(`/club/${clubInfo.id}/manage`)}>관리</button>
                        }
                    </div>
                    {/* {(privilege === 'OWNER' || privilege === 'ADMIN') &&
                        <button className={styles.manageButton} onClick={()=>navigate(`/club/${clubInfo.id}/manage`)}>관리</button>
                    }            */}
                </div>
            </div>
            <div className={styles.boardSection}>
                <ul className={styles.boardList}>
                    {
                        boards.map(board => (
                            <li key={board.id} className={styles.boardItem}>
                                <Link to={`/club/${clubInfo.id}/${board.id}`}>{board.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default ClubSideMenu;