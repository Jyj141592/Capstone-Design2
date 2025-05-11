
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
//import Quill from 'quill';
//import ImageUploader from 'quill-image-uploader';
import styles from './WritePost.module.css'
import { useState } from 'react';

//Quill.register('modules/imageUploader', ImageUploader);

function WritePost(){
    const {clubId, boardId} = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const modules = {
        toolbar: {
            container: [['image'], [{ header: [1,2,3,4,5, false]}], ['bold', 'underline']]
        }
    };

    function handleSubmit(){

    }

    return (
        <div className={styles.container}>
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