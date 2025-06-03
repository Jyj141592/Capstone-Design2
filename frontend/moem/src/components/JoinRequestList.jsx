import JoinRequest from './JoinRequest';
import JoinRequestModal from './JoinRequestModal';
import styles from './JoinRequestList.module.css'
import { useState } from 'react';

function JoinRequestList({requests}){
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
                <JoinRequestModal request={selected} onClose={()=>setShowModal(false)}/>
            }
        </div>
    )
}

export default JoinRequestList;


