import { useEffect, useState } from 'react';
import { fetchProfileImageUrl } from '../services/FileService';
import styles from './PersonalProfile.module.css'

function PersonalProfile({profile, OnClick = (p)=>{}}){
    const [profileUrl, setProfileUrl] = useState('/images/avatar_default.jpg');

    useEffect(()=>{
        if(profile.profileImage){
            fetchProfileImageUrl(profile.profileImage)
                .then(url=>setProfileUrl(url))
                .catch(err=>console.error(err));
        }
    },[])

    return (
        <div className={styles.personCard} onClick={()=>OnClick(profile)}>
            <img src={profileUrl} alt="profile image" className={styles.personAvatar}/>
            <div className={styles.personName}>{profile.name}</div>
        </div>
    )
}

export default PersonalProfile;

