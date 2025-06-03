import styles from './JoinRequestModal.module.css'
import Modal from '../Modal'
import ProfileList from '../ProfileList';
import PersonalProfile from '../PersonalProfile';
import { useState } from 'react';
import { apiClient } from '../../api/ApiClient';
import { CLUB_API } from '../../api/ClubApi';

function JoinRequestModal({request, onClose, onChange}){
    const status = request.status === 'APPROVED' ? '승인' : (request.status === 'REJECTED' ? '거부' : '대기중');
    const [response, setResponse] = useState('');
    
    function onSubmit(value){
        const data = {approve: value, responseMessage: response};
        apiClient.put(CLUB_API.SET_JOIN_STATE(request.id), data)
            .then(res=>{
                onChange(prev=>prev.map(item=> item.id === res.data.id ? res.data : item));
                onClose();
            })
            .catch(err=>{
                console.error(err);
                onClose();
            })
        
    }

    return (
        <Modal onClose={onClose}>
            <div className={styles.modalContent}>
                <h1 className={styles.title}>신청 정보</h1>
                <div className={styles.section}>
                    <span className={styles.label}>신청자</span>
                    <span className={styles.profile}>
                        <PersonalProfile profile={request.submitter}/>
                    </span>
                </div>
                <div className={styles.section}>
                    <span className={styles.label}>상태</span>
                    <span className={styles.value}>{status}</span>
                </div>
                {
                    request.status !== 'PENDING' && (
                        <div className={styles.section}>
                            <span className={styles.label}>응답 메시지</span>
                            <span className={styles.value}>{request.responseMessage}</span>
                        </div>
                    )
                    
                }
                {   
                    request.wards.length > 0 && (
                        <div className={styles.profileSection}>
                            <span className={styles.label}>피보호자</span>
                            <ProfileList profiles={request.wards}/>
                        </div>
                        )
                }
                <div className={styles.section}>
                    <span className={styles.label}>가입 인사</span>
                    <span className={styles.value}>{request.message}</span>
                </div>
                {
                    request.status === 'PENDING' && (
                        <div>
                            <div className={styles.section}>
                                <span className={styles.label}>응답 메시지</span>
                                <textarea className={styles.textarea} onChange={(e)=>setResponse(e.target.value)}/>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button className={styles.approveButton} onClick={()=>onSubmit(true)}>승인</button>
                                <button className={styles.rejectButton} onClick={()=>onSubmit(false)}>거부</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </Modal>
    )
}

export default JoinRequestModal;