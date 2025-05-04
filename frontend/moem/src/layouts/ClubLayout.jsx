import { Outlet } from "react-router-dom";
import ClubSideMenu from "../components/Club/ClubSideMenu";
import styles from './ClubLayout.module.css'

function ClubLayout(){


    return (
        <div className = {styles.layout}>
            <ClubSideMenu/>
            <div className={styles.content}>
                <Outlet/>
            </div>
        </div>
    );
}

export default ClubLayout;