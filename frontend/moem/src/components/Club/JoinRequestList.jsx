import styles from './JoinRequestList.module.css'
import JoinRequestModal from './JoinRequestModal';
import JoinRequest from './JoinRequest';
import { useState } from 'react';


function JoinRequestList({requests, onChange}){
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);

    function displayModal(request){
        setSelected(request);
        setShowModal(true);
    }
    
    return (
        <div className={styles.listContainer}>
            { requests.length > 0 ? 
                (
                    requests.map(req=><JoinRequest key={req.id} request={req} OnClick={displayModal}/>)
                ) : (
                    <div className={styles.emptyMessage}>신청 내역이 없습니다.</div>
                )
            }

            {
                showModal && 
                <JoinRequestModal request={selected} onClose={()=>setShowModal(false)} onChange={onChange}/>
            }
        </div>
    )
}

export default JoinRequestList;