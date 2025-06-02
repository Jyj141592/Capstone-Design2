import { apiClient } from '../api/ApiClient';
import { fetchActivityPostHtml } from '../services/PostService';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './ActivityPost.module.css'

//post {id, title, content}

function ActivityPost(){
    const {clubId, postId} = useParams();
    const [content, setContent] = useState(null);
    useEffect(() => {
        (async () => {
            const post = await fetchActivityPostHtml(clubId, postId);
            setContent(post);
            //console.log(post);
        })();
        //setContent({id: 1, title: 'title', content:'<p>안녕하세요</p><img src="https://example.com/image.jpg" />'});
    }, []);

    return (
        
        <div className={styles.container}>
            {content&&
                (<>
                    <h1 className ={styles.title}>
                        {content.title}
                    </h1>
                    <div className={styles.content} dangerouslySetInnerHTML={{__html: content.content}}/>
                </>)
            }
        </div>
    );
}

export default ActivityPost;