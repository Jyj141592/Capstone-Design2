
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
//import Quill from 'quill';
//import ImageUploader from 'quill-image-uploader';
import { useRef, useState } from 'react';
import { uploadImage } from '../services/FileService';
import { apiClient } from '../api/ApiClient';
import { CLUB_API } from '../api/ClubApi';
import styles from './WritePost.module.css'

//Quill.register('modules/imageUploader', ImageUploader);

function WritePost(){
    const {clubId, boardId} = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const quillRef = useRef();
    const navigate = useNavigate();

    const modules = {
        toolbar: {
            container: [['image'], [{ header: [1,2,3,4,5, false]}], ['bold', 'underline']]
        }
    };

    async function handleSubmit(value){
        let html = content;
        const imgTags = [...html.matchAll(/<img[^>]+src="(data:image\/[^";]+;base64,[^"]+)"[^>]*>/g)];
        let thumbnail = null;
        for (const match of imgTags) {
            const base64 = match[1];
            const res = await fetch(base64);
            const blob = await res.blob();
            const formData = new FormData();
            formData.append('file', blob, 'image.png');
            const url = await uploadImage(clubId, formData);
            html = html.replace(base64, url);
            if(thumbnail == null){
                thumbnail = url;
            }
        }
        const post = {title: title, content: html, thumbnail: thumbnail};
        apiClient.post(CLUB_API.UPLOAD_POST(clubId, boardId), post)
            .then(res => {
                alert('작성 완료!');
                navigate(`/club/${clubId}/${boardId}`);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className={styles.container}>
            <h1>글쓰기</h1>
            <div className={styles.inputSection}>
                <input type='text' className={styles.titleInput} value={title} onChange={(e) => setTitle(e.target.value)} placeholder='제목을 입력하세요'/>
            </div>
            <div className={styles.editorWrapper}>
                <ReactQuill className={styles.editor} modules={modules} value={content} onChange={setContent}/>
            </div>
            {/* <ReactQuill value={content} onChange={setContent} 
                modules={{toolbar:[['bold','italic','underline'],[{'header':[1,2,3,false]}],['link', 'image']],
                    imageUploader: {upload: async (file) =>{ return 'aa.png' }}  }}
                formats={['header', 'bold', 'italic', 'underline', 'link', 'image']}/> */}
            <button className={styles.submitButton} onClick={handleSubmit}>글 등록</button>
        </div>
    );
}

export default WritePost;