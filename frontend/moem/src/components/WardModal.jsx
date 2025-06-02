import { useState } from "react";
import Modal from "./Modal";
import ProfileList from "./ProfileList";
import { apiClient } from "../api/ApiClient";
import { ACCOUNT_API } from "../api/AccountApi";
import styles from "./WardModal.module.css"
import { useAuth } from "../auth/AuthContext";

function WardModal({type, onClose, profiles, onChanged}){
    const [remove, setRemove] = useState(false);
    const [search, setSearch] = useState('');
    const authContext = useAuth();

    function RemoveWard(value){
        if (remove){
            if(type==='guardian'){
                apiClient.delete(ACCOUNT_API.REMOVE_GUARDIAN(authContext.username, value.username))
                    .then(res => {
                        onChanged(prev=> prev.filter(item=>item.username !== value.username));
                    })
                    .catch(err=>console.error(err));
            }
            else if (type==='ward'){
                apiClient.delete(ACCOUNT_API.REMOVE_GUARDIAN(value.username, authContext.username))
                    .then(res => {
                        onChanged(prev=> prev.filter(item=>item.username !== value.username));
                    })
                    .catch(err=>console.error(err));
            }
        }
    }

    function AddWard(){
        console.log(search.length);
        if(search.length > 0){
            if(type==='guardian'){
                apiClient.post(ACCOUNT_API.ADD_GUARDIAN(authContext.username, search))
                    .then(res => {
                        onChanged(prev => [...prev, res.data]);
                    })
                    .catch(err => console.error(err));
            }
            else if(type==='ward'){
                    apiClient.post(ACCOUNT_API.ADD_WARD(authContext.username, search))
                    .then(res => {
                        onChanged(prev => [...prev, res.data]);
                    })
                    .catch(err => console.error(err));
            }
        }
    }
    const title = type==='ward'?'피보호자 목록':'보호자 목록';
    const emptyMessage = type==='ward' ? '피보호자가 없습니다' : '보호자가 없습니다';
    return (
        <Modal onClose={onClose}>
            <div className={styles.modalContent}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.inputRow}>
                    <input className={styles.input} type="text" placeholder="사용자 아이디" onChange={(e)=>setSearch(e.target.value)}/>
                    <button className={styles.addButton} onClick={AddWard}>추가</button>
                </div>
                <div className={styles.listSection}>
                    <button className={styles.removeButton} onClick={()=>setRemove(!remove)}>
                        {remove ? '제거 완료' : '제거'}
                    </button>
                    <ProfileList profiles={profiles} remove={remove} OnClick={RemoveWard} emptyMessage={emptyMessage}/>
                </div>
            </div>
        </Modal>
    )
}

export default WardModal;