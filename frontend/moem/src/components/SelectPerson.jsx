
import { useEffect, useState } from 'react';
import { fetchProfileImageUrl } from '../services/FileService';
import styles from './SelectPerson.module.css'

function SelectPerson({person, OnClick, init}) {
    const [selected, setSelected] = useState(false);
    const [profile, setProfile] = useState('/images/avatar_default.jpg');

    useEffect(()=>{
        if(person.profileImage !== null) {
            fetchProfileImageUrl(person.profileImage)
                .then(url => setProfile(url))
                .catch(err=>console.error(err));
        }
    },[]);

    return (
        <div
            className={`${styles.protegeCard} ${
            (typeof init === 'undefined' && selected) || init ? styles.selected : ""
            }`}
            onClick={() => {
                const newSelected = !selected;
                setSelected(newSelected);
                OnClick(person, newSelected);
            }}
        >
            <img src={profile} alt="프로필 이미지" />
            <span>{person.name}</span>
        </div>
    )
}

export default SelectPerson;