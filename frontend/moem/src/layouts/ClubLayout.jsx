import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import ClubSideMenu from "../components/Club/ClubSideMenu";
import styles from './ClubLayout.module.css'

function ClubLayout(){
    const [clubInfo, setClubInfo] = useState(null);
    const {clubId} = useParams();
    const navigate = useNavigate();
    useEffect(()=>{
        setClubInfo({id: 1, name: "모임1", description: "모임1 입니다."});
        // if(clubId){
        //     apiClient.get(CLUB_API.FETCH_CLUB_INFO(clubId))
        //         .then(res => {
        //             setClubInfo(res.data);
        //         })
        //         .catch(err=>{
        //             console.log(err);
        //             navigate("/");
        //         });
        // }
        // else{
        //     navigate("/");
        // }
    }, []);

    return clubInfo && (
        <div className = {styles.layout}>
            <ClubSideMenu clubInfo={clubInfo}/>
            <div className={styles.content}>
                <Outlet context={clubInfo}/>
            </div>
        </div>
    );
}

export default ClubLayout;