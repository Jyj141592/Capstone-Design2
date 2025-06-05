import styles from './MyActivity.module.css'
import { apiClient } from '../api/ApiClient';
import { ACCOUNT_API } from '../api/AccountApi';
import { ACTIVITY_API } from '../api/ActivityApi';
import { useEffect, useState } from 'react';

function MyActivity(){
    const [activity, setActivity] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [commentInput, setCommentInput] = useState('');

    useEffect(()=>{
        apiClient.get(ACCOUNT_API.FETCH_MY_ACTIVITIES)
            .then(res=>setActivity(res.data))
            .catch(err=>console.error(err));
    },[]);

    function handleAttend(){
        apiClient.post(ACTIVITY_API.ATTEND_ACTIVITY(selectedActivity.club.id, selectedActivity.activity.id))
            .then(res=>{
                setSelectedActivity(prev=>{return {...prev, attended: true};});
                setActivity(prev=>prev.map(a=>a.activity.id === selectedActivity.activity.id ? selectedActivity : a));
            })
            .catch(err=>console.error(err));
    }
    function handleSubmitComment(){
        if (commentInput.length <= 0) return;
        const comment = {comment:commentInput};
        apiClient.post(ACTIVITY_API.SET_COMMENT(selectedActivity.club.id, selectedActivity.activity.id), comment)
            .then(res=>{
                setSelectedActivity(prev=>{return {...prev, comment: commentInput};});
                setActivity(prev=>prev.map(a=>a.activity.id === selectedActivity.activity.id ? selectedActivity : a));
            })
            .catch(err=>console.error(err));
    }

    return (
        <div className={styles.container}>
            <div className={styles.listWrapper}>
                {activity.map((item) => (
                    <div
                    key={item.activity.id}
                    className={styles.card}
                    onClick={() => setSelectedActivity(item)}
                    >
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{item.activity.name}</h3>
                            <span>모임: {item.club.name}</span>
                            <span className={styles.cardDate}>📅 {item.activity.date}</span>
                        </div>
                        <div className={styles.cardInfo}>
                            <p>
                            {item.attended ? "✔ 출석" : "❌ 미출석"} ·{" "}
                            {item.comment.length > 0 ? "📝 작성됨" : "작성 필요"}
                            </p>
                        </div>
                    </div>
                ))}
                </div>
        
                {/* 활동 상세 모달 */}
                {selectedActivity && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>{selectedActivity.activity.name}</h2>
                        <p>📅 {selectedActivity.activity.date}</p>
                        <p>장소: {selectedActivity.activity.location}</p>
                        <p>설명: {selectedActivity.activity.description}</p>
                        <p>{selectedActivity.attended ? "✔ 출석 완료" : "❌ 출석 안 함"}</p>
            
                        {/* 코멘트 O */}
                        {selectedActivity.attended && selectedActivity.comment.length > 0 && (
                            <div className={styles.commentBox}>
                            <h4>작성한 코멘트</h4>
                            <p>{selectedActivity.comment}</p>
                            </div>
                        )}
            
                        {/* 출석 O 코멘트 X */}
                        {selectedActivity.attended &&
                            !selectedActivity.comment.length > 0 && (
                            <div className={styles.commentForm}>
                                <label className={styles.commentLabel}>
                                코멘트 작성:
                                <textarea
                                    className={styles.commentTextarea}
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    required
                                />
                                </label>
                            </div>
                        )}
            
                        {/* 버튼 */}
                        <div className={styles.modalButtons}>
                            {!selectedActivity.attended && (
                                <button
                                    className={`${styles.button} ${styles.attendButton}`}
                                    onClick={handleAttend}
                                >
                                    출석하기
                                </button>
                            )}
            
                            {selectedActivity.attended &&
                            selectedActivity.comment.length <= 0 && (
                                <button
                                type="button"
                                className={`${styles.button} ${styles.submitButton}`}
                                onClick={handleSubmitComment}
                                >
                                제출
                                </button>
                            )}
            
                            <button
                            type="button"
                            className={`${styles.button} ${styles.closeButton}`}
                            onClick={() => setSelectedActivity(null)}
                            >
                            닫기
                            </button>
                        </div>
                    </div>
                </div>
                )}
        </div>
    )
}

export default MyActivity;