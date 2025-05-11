import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/ApiClient';
import { CLUB_API } from '../../api/ClubApi';
import { fetchImageUrl } from '../../services/FileService';
import styles from './PostCard.module.css'

function PostCard({clubId, boardId, post}){
    const [imgUrl, setImgUrl] = useState(null);
    const thumbnail = 'aa';
    useEffect(() => {
        fetchImageUrl(clubId, thumbnail)
            .then(url => {
                if(url) setImgUrl(url);
            })
            .catch(err => {
                console.log(err);
            });
    }, [clubId]);


    return (
        <div>
            <Link to={`/club/${clubId}/${boardId}/${post.id}`} className={styles.card}>
                <img src={imgUrl} alt="Thumbnail" className={styles.thumbnail}/>
                <div className={styles.title}>
                    {post.title}
                </div>
            </Link>
        </div>
    );
}

export default PostCard;