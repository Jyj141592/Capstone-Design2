import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiClient } from '../api/ApiClient';
import { CLUB_API } from '../api/ClubApi';
import styles from './ClubManager.module.css';


function ClubManager(){
    const {clubInfo, privilege} = useOutletContext();
    const [membersModal, setMembersModal] = useState(false);
    const [managerModal, setManagerModal] = useState(false);
    const [applicantsModal, setApplicantsModal] = useState(false);
    const [boards, setBoards] = useState([]);
    const [changedBoards, setChangedBoards] = useState([]);
    const [createdBoards, setCreatedBoards] = useState([]);

    useEffect(()=>{
        apiClient.get(CLUB_API.FETCH_BOARD_LIST(clubInfo.id))
            .then(res=>{
                setBoards(res.data);
            })
            .catch(err=>{
                console.log(err);
            });
    },[]);

    const members = [
        { id: 1, name: '홍길동', profileUrl: 'https://via.placeholder.com/50' },
        { id: 2, name: '김철수', profileUrl: 'https://via.placeholder.com/50' },
        { id: 3, name: '이영희', profileUrl: 'https://via.placeholder.com/50' },
        { id: 4, name: '박영수', profileUrl: 'https://via.placeholder.com/50' },
        { id: 5, name: '최민수', profileUrl: 'https://via.placeholder.com/50' },
        { id: 6, name: '나머지', profileUrl: 'https://via.placeholder.com/50' },
    ];

    const applicants = [
        { id: 1, name: '지원자1', profileUrl: 'https://via.placeholder.com/50' },
        { id: 2, name: '지원자2', profileUrl: 'https://via.placeholder.com/50' },
        { id: 3, name: '지원자3', profileUrl: 'https://via.placeholder.com/50' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h1 className={styles.title}>정보 수정</h1>
                <div className={styles.fieldGroup}>
                    <h2 className={styles.label}>프로필</h2>
                    <img className={styles.profileImg} alt="프로필" />
                </div>
                <div className={styles.fieldGroup}>
                    <h2 className={styles.label}>모임 이름</h2>
                    <input className={styles.input} type='text' />
                </div>
                <div className={styles.fieldGroup}>
                    <h2 className={styles.label}>모임 설명</h2>
                    <input className={styles.input} type='text' />
                </div>
                <div className={styles.fieldGroup}>
                    <h2 className={styles.label}>주요 관심사</h2>
                    <input className={styles.input} type='text' />
                </div>
                <div className={styles.fieldGroup}>
                    <h2 className={styles.label}>주요 지역</h2>
                    <input className={styles.input} type='text' />
                </div>
                <div className={styles.fieldGroup}>
                    <h2 className={styles.label}>모임 신청 주의사항</h2>
                    <input className={styles.input} type='text' />
                </div>
                <button className={styles.button}>적용</button>
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>게시판 관리</h2>
                <ul className={styles.boardList}>
                    {
                        boards.map((board, index) => (
                            <li key={board.id} className={styles.boardItem}>
                                <input className={styles.input} type='text' defaultValue={board.name} placeholder='게시판 이름'/>
                                <input className={styles.input} type='text' defaultValue={board.description} placeholder='게시판 설명'/>
                            </li>
                        ))
                    }
                    <button className={styles.button} onClick={() => {
                        setBoards(prev=>[...prev, {id: Date.now(), name: '', description: ''}]);
                    }}>게시판 추가</button>
                    <button className={styles.button}>적용</button>
                </ul>
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>회원 관리</h2>
                <div>회원 수: {members.length}</div>
                <div className={styles.list}>
                    {members.slice(0, 5).map(member => (
                        <div className={styles.userCard} key={member.id}>
                            <img className={styles.userImg} src={member.profileUrl} alt={member.name} />
                            <span>{member.name}</span>
                        </div>
                    ))}
                    {members.length > 5 && (
                        <button className={styles.button} onClick={() => setMembersModal(true)}>모두 보기</button>
                    )}
                </div>

                {membersModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>전체 회원 목록</h3>
                            <button onClick={() => setMembersModal(false)}>닫기</button>
                            <div className={styles.list}>
                                {members.map(member => (
                                    <div className={styles.userCard} key={member.id}>
                                        <img className={styles.userImg} src={member.profileUrl} alt={member.name} />
                                        <span>{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <h2 className={styles.subtitle}>관리자 목록</h2>
                <div className={styles.list}>
                    {members.slice(0, 5).map(member => (
                        <div className={styles.userCard} key={member.id}>
                            <img className={styles.userImg} src={member.profileUrl} alt={member.name} />
                            <span>{member.name}</span>
                        </div>
                    ))}
                    {members.length > 5 && (
                        <button className={styles.button} onClick={() => setManagerModal(true)}>모두 보기</button>
                    )}
                </div>

                {managerModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>전체 관리자 목록</h3>
                            <button onClick={() => setManagerModal(false)}>닫기</button>
                            <div className={styles.list}>
                                {members.map(member => (
                                    <div className={styles.userCard} key={member.id}>
                                        <img className={styles.userImg} src={member.profileUrl} alt={member.name} />
                                        <span>{member.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>가입 신청 내역</h2>
                <div>대기중 : {applicants.length}</div>
                <div className={styles.list}>
                    {applicants.slice(0, 5).map(applicant => (
                        <div className={styles.userCard} key={applicant.id}>
                            <img className={styles.userImg} src={applicant.profileUrl} alt={applicant.name} />
                            <span>{applicant.name}</span>
                            <span>상태: 대기</span>
                        </div>
                    ))}
                    {applicants.length > 5 && (
                        <button className={styles.button} onClick={() => setApplicantsModal(true)}>모두 보기</button>
                    )}
                </div>

                {applicantsModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>전체 신청자 목록</h3>
                            <button onClick={() => setApplicantsModal(false)}>닫기</button>
                            <div className={styles.list}>
                                {applicants.map(applicant => (
                                    <div className={styles.userCard} key={applicant.id}>
                                        <img className={styles.userImg} src={applicant.profileUrl} alt={applicant.name} />
                                        <span>{applicant.name}</span>
                                        <span>상태: 대기</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ClubManager;
