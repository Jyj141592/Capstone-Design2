import styles from './JoinRequestModal.module.css'
import ProfileList from './ProfileList';
import Modal from './Modal'


function JoinRequestModal({request, onClose}){
    const status = request.status === 'APPROVED' ? '승인' : (request.status === 'REJECTED' ? '거부' : '대기중');

    return (
        <Modal onClose={onClose}>
            <div className={styles.modalContent}>
                <h1 className={styles.title}>{request.clubName}</h1>
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
            </div>
        </Modal>
    )
}

export default JoinRequestModal;