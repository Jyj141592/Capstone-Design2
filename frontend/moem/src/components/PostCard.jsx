import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/ApiClient';
import { CLUB_API } from '../api/ClubApi';
import { fetchActivityImage } from '../services/FileService';
import styles from './PostCard.module.css'

function PostCard({clubId, post}){
    const [imgUrl, setImgUrl] = useState("/images/image_none.jpg");
    useEffect(() => {
        if(post.thumbnail){
            fetchActivityImage(clubId, post.thumbnail)
                .then(url => {
                    if(url) setImgUrl(url);
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [clubId]);


    return (
        <div>
            <Link to={`/club/${clubId}/activity/${post.postID}`} className={styles.card}>
                <img src={imgUrl} alt="Thumbnail" className={styles.thumbnail}/>
                <div className={styles.title}>
                    {post.title}
                </div>
                <div>
                    {post.createdAt}
                </div>
            </Link>
        </div>
    );
}

export default PostCard;