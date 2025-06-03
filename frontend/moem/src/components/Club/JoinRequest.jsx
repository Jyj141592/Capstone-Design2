import styles from './JoinRequest.module.css'

function JoinRequest({request, OnClick}){
    const status = request.status === 'APPROVED' ? '승인' : (request.status === 'REJECTED' ? '거부' : '대기중');

    return (
        <div key={request.id} className={styles.requestItem} onClick={()=>OnClick(request)}>
            <div className={styles.row}>
                <span className={styles.label}>신청자</span>
                <span className={styles.value}>{request.submitter.name}</span>
            </div>
            <div className={styles.row}>
                <span className={styles.label}>상태</span>
                <span className={styles.value}>{status}</span>
            </div>
        </div> 
    )
}

export default JoinRequest;