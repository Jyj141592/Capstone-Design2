import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "../api/ApiClient";
import { AUTH_API } from "../api/AuthApi";
import { CLUB_API } from "../api/ClubApi";
import ClubSideMenu from "../components/Club/ClubSideMenu";
import styles from './ClubLayout.module.css'

function ClubLayout(){
    const [clubInfo, setClubInfo] = useState(null);
    const [privilege, setPrivilege] = useState(null);
    const {clubId} = useParams();
    const navigate = useNavigate();
    useEffect(()=>{
        apiClient.get(AUTH_API.CLUB_PRIVILEGE(clubId))
            .then(res=>{
                if(res.data === "NONE"){
                    navigate('/');
                }
                else{
                    setPrivilege(res.data);
                }
            })
            .catch(err=>console.log(err));
        if(clubId){
            apiClient.get(CLUB_API.FETCH_CLUB_INFO(clubId))
                .then(res => {
                    setClubInfo(res.data);
                })
                .catch(err=>{
                    console.log(err);
                    navigate("/");
                });
        }
        else{
            navigate("/");
        }

    }, []);

    return clubInfo && privilege && (
        <div className = {styles.layout}>
            <ClubSideMenu clubInfo={clubInfo}/>
            <div className={styles.content}>
                <Outlet context={{clubInfo,privilege}}/>
            </div>
        </div>
    );
}

export default ClubLayout;