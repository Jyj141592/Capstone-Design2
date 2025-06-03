import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { apiClient } from '../api/ApiClient';
import { CLUB_API } from '../api/ClubApi';
import { fetchProfileImageUrl, uploadProfileImage } from '../services/FileService';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import JoinRequestList from '../components/Club/JoinRequestList';
import styles from './ClubManager.module.css';


function ClubManager(){
    const {clubInfo, privilege} = useOutletContext();
    const navigate = useNavigate();
    // const [membersModal, setMembersModal] = useState(false);
    // const [managerModal, setManagerModal] = useState(false);
    const [profile, setProfile] = useState('/images/image_none.jpg');
    const [boards, setBoards] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(()=>{
        if(privilege !== 'OWNER' && privilege !== 'ADMIN'){
            navigate('/');
        }
        if(clubInfo.profileImageName){
            fetchProfileImageUrl(clubInfo.profileImageName)
                .then(url=>setProfile(url))
                .catch(err=>console.error(err));
        }
        apiClient.get(CLUB_API.FETCH_BOARD_LIST(clubInfo.id))
            .then(res=>{
                setBoards(res.data);
            })
            .catch(err=>{
                console.log(err);
            });
        apiClient.get(CLUB_API.JOIN_LIST(clubInfo.id))
            .then(res=>setRequests(res.data))
            .catch(err=>console.error(err));
    },[]);

    function validate(values){
        const errors = {};
        if(!values.name) errors.name = "모임 이름을 입력해주세요";
        if(!values.topic) errors.topic = "모임 관심사를 입력해주세요";
        return errors;
    }

    async function handleSubmit(values, setSubmitting) {
        try{
          
            
            const dto = {
                name: values.name,
                description: values.description,
                topic: values.topic,
                region: values.region,
                applicationPrecautions: values.applicationPrecautions,
            };
            if(values.profileImage){
                const formData = new FormData();
                formData.append('file', values.profileImage);
                const imageName = await uploadProfileImage(formData);
                dto.profileImageName = imageName;
            }
            else{
                dto.profileImageName = clubInfo.profileImageName;
            }
            apiClient.put(CLUB_API.UPDATE_CLUB(clubInfo.id), dto)
                .catch(err=>console.log(err));
        } catch(error){}
        setSubmitting(false);
        alert("수정 성공");
    };
    function CreateBoard(){
        const newBoard = {name: '새 게시판', description: '새 게시판입니다.', status: 'created'};
        setBoards(prev=>[...prev, newBoard]);
    }
    function OnBoardChange(index, field, value){
        setBoards(prev=>{
                    const updated = [...prev];
                    const newVal = updated[index];
                    newVal[field] = value;
                    if(!newVal.status){
                        newVal.status = 'changed';
                    }
                    updated[index] = newVal;
                    return updated;
                });
        
    }

    function OnBoardSubmit(){
        boards.forEach((e, i, a) => {
            if(e.status){
                if (!e.name || e.name.length <= 0 || !e.description || e.description.length <= 0){
                    return;
                }
                const b = {name: e.name, description: e.description};
                if(e.status==='created'){
                    apiClient.post(CLUB_API.CREATE_BOARD(clubInfo.id), b)
                        .catch(err=>console.error(err));
                }
                else{
                    apiClient.put(CLUB_API.UPDATE_BOARD(clubInfo.id, e.id), b)
                        .catch(err=>console.error(err));
                }
            }
        });
        setBoards(prev=>prev.map(p=> delete p.status));
        alert("수정 성공");
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>정보 수정</h1>
            <Formik
                initialValues={{
                    name: clubInfo.name ? clubInfo.name : '',
                    description: clubInfo.description ? clubInfo.description : '',
                    topic: clubInfo.topic ? clubInfo.topic : '',
                    region: clubInfo.region ? clubInfo.region : '',
                    applicationPrecautions: clubInfo.applicationPrecautions ? clubInfo.applicationPrecautions : '',
                    profileImage: null
                }}
                validate={validate}
                onSubmit={(values, {setSubmitting, setFieldValue}) => {
                    handleSubmit(values, setSubmitting);
                    setFieldValue('profileImage', null);
                }}
                validateOnChange={false}>
                {({isSubmitting, setFieldValue, values}) => (
                    <Form className={styles.formInner}>
                    <div className={styles.content}> 
                        <div className={styles.profileSection}>
                        <img
                            src={profile||'/images/image_none.jpg'}
                            alt="Preview"
                            className={styles.preview}/>
                        <label className={styles.uploadButton}>
                            프로필 등록
                            <input
                            type="file"
                            name="profileImage"
                            style={{display:'none'}}
                            onChange={(event)=>{
                                setFieldValue('profileImage', event.currentTarget.files[0]);
                                setProfile(URL.createObjectURL(event.currentTarget.files[0]));
                            }}/>
                        </label>
                        </div>
                        <div className={styles.formWrapper}>
                            <div className={styles.inputGroup}>
                            <label>모임 이름</label>
                            <Field type='text' name='name' className={styles.input} spellCheck={false}/>
                            <ErrorMessage name='name' component='div' className={styles.error}/>
                            </div>
                            <div className={styles.inputGroup}>
                            <label>모임 소개</label>
                            <Field as='textarea' name='description' className={styles.textarea} spellCheck={false}/>
                            <ErrorMessage name='description' component='div' className={styles.error}/>
                            </div>
                            <div className={styles.inputGroup}>
                            <label>모임 관심사</label>
                            <Field type='text' name='topic' className={styles.input} spellCheck={false}/>
                            <ErrorMessage name='topic' component='div' className={styles.error}/>
                            </div>
                            <div className={styles.inputGroup}>
                            <label>활동 지역</label>
                            <Field type='text' name='region' className={styles.input} spellCheck={false}/>
                            <ErrorMessage name='region' component='div' className={styles.error}/>
                            </div>
                            <div className={styles.inputGroup}>
                            <label>신청 시 주의사항</label>
                            <Field as='textarea' name='applicationPrecautions' className={styles.textarea} spellCheck={false}/>
                            <ErrorMessage name='applicationPrecautions' component='div' className={styles.error}/>
                            </div>
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className={styles.applyButton}>
                    적용
                    </button> 
                    </Form>
                )}
                </Formik>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>게시판 관리</h2>
                <div className={styles.boardWrapper}>
                    <div className={styles.buttonRow}>
                        <button className={styles.button} onClick={CreateBoard}>게시판 추가</button>
                    </div>
                    <ul className={styles.boardList}>
                        {
                            boards.map((board, index) => (
                                <li key={index} className={styles.boardItem}>
                                    <div className={styles.fieldRow}>
                                        <label className={styles.label}>게시판 이름</label>
                                        <input className={styles.boardInput} type='text' defaultValue={board.name} placeholder='게시판 이름' onChange={(e)=>OnBoardChange(index, 'name', e.target.value)}/>
                                    </div>
                                    <div className={styles.fieldRow}>
                                        <label className={styles.label}>게시판 설명</label>
                                        <input className={styles.boardInput} type='text' defaultValue={board.description} placeholder='게시판 설명' onChange={(e)=>OnBoardChange(index, 'description', e.target.value)}/>
                                    </div>
                                </li>
                            ))
                        }
                        
                    </ul>
                    <div className={styles.applyButtonWrapper}>
                        <button className={styles.applyButton} onClick={OnBoardSubmit}>적용</button>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>가입 신청 내역</h2>
                <JoinRequestList requests={requests} onChange={setRequests}/>
            </div>

            {/* <div className={styles.section}>
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
            </div> */}

            {/* <div className={styles.section}>
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
            </div> */}
        </div>
    );
}

export default ClubManager;
