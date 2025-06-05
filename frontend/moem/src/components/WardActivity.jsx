import { useState, useEffect } from 'react';
import { apiClient } from '../api/ApiClient';
import { ACCOUNT_API } from '../api/AccountApi';
import Modal from './Modal'
import styles from './WardActivity.module.css'
import SelectPerson from './SelectPerson';

function WardActivity(){
    const [activity, setActivity] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    useEffect(()=>{
        apiClient.get(ACCOUNT_API.FETCH_WARD_ACTIVITIES)
            .then(res=>{
                setActivity(res.data);
            })
            .catch(err=>console.error(err));
    },[]);

    return (
        <div className={styles.container}>
            <div className={styles.listWrapper}>
                {activity.map((item) => (
                    <div
                    key={item.activity.id}
                    className={styles.card}
                    onClick={() => {setSelectedActivity(item); setSelectedWard(item.wards[0])}}
                    >
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>{item.activity.name}</h3>
                            <span>모임: {item.club.name}</span>
                            <span className={styles.cardDate}>📅 {item.activity.date}</span>
                        </div>
                        <div className={styles.cardInfo}>
                            
                            <p className={styles.protegeName}>
                                {item.wards.length === 1 ?
                                    item.wards[0].user.name : `${item.wards[0].user.name} 외 ${item.wards.length - 1}명`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
    
            {/* 활동 상세 모달 */}
            {selectedActivity && (
            <Modal onClose={()=>{setSelectedActivity(null); setSelectedWard(null);}}>
                <div className={styles.modalContent}>
                    <h2>{selectedActivity.activity.name}</h2>
                    <p>📅 {selectedActivity.activity.date}</p>
                    <p>장소: {selectedActivity.activity.location}</p>
                    <p>설명: {selectedActivity.activity.description}</p>
                    <div className={styles.gridContainer}>
                        {selectedActivity.wards.map((w,i)=><SelectPerson key={w.user.id} person={w.user} OnClick={(a,b)=>setSelectedWard(selectedActivity.wards[i])} init={selectedWard.user.username === w.user.username}/>)}
                    </div>
                    <p>{selectedWard.attended ? "✔ 출석 완료" : "❌ 출석 안 함"}</p>
        
                    {/* 코멘트 O */}
                    {selectedWard.attended && selectedWard.comment.length > 0 && (
                        <div className={styles.commentBox}>
                        <h4>작성한 코멘트</h4>
                        <p>{selectedWard.comment}</p>
                        </div>
                    )}
        
        
        
                    <button
                    type="button"
                    className={`${styles.button} ${styles.closeButton}`}
                    onClick={() => {setSelectedActivity(null); setSelectedWard(null);}}
                    >
                    닫기
                    </button>
                    
                </div>
            </Modal>
            )}
        </div>
    )
}

export default WardActivity;