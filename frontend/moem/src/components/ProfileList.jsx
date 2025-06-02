import PersonalProfile from './PersonalProfile';
import styles from './ProfileList.module.css'

function ProfileList({profiles, count = -1, remove = false, OnClick = (p)=>{}, emptyMessage=''}){
    const items = count < 0 ? profiles : profiles.slice(0, count);


    return (
        <div className={styles.profileBox}>
            {
                items.length > 0 ? (
                    <div className={styles.grid}>
                        {items.map((p, idx) => (
                            <div key={idx} className={styles.profileWrapper}>
                                {remove && <div className={styles.redX}>x</div>}
                                <PersonalProfile key={p.username} profile={p} remove={remove} OnClick={OnClick}/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyMessage}>
                        {
                            emptyMessage
                        }
                    </div>
                )
            }
        </div>
    )
}

export default ProfileList;