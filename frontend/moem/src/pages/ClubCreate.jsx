import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { apiClient } from "../api/ApiClient";
import { CLUB_API } from "../api/ClubApi";
import styles from "./ClubCreate.module.css";

export default function ClubCreate() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  function validate(values){
    const errors = {};
    if(!values.name) errors.name = "모임 이름을 입력해주세요";
    if(!values.topic) errors.topic = "모임 관심사를 입력해주세요";
    return errors;
  }

  async function handleSubmit(values, setSubmitting) {
    try{
      const formData = new FormData();
      if(values.profileImage){
        formData.append('profile', values.profileImage);
      }
      
      const dto = {
        name: values.name,
        description: values.description,
        topic: values.topic,
        region: values.region,
        applicationPrecautions: values.applicationPrecautions,
      };
      formData.append('data', new Blob([JSON.stringify(dto)], {type: 'application/json'}));
      apiClient.post(CLUB_API.CREATE_CLUB, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res=>{
          navigate(`/club/${res.data.id}`);
        })
        .catch(err=>console.log(err));
    } catch(error){}
    setSubmitting(false);
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>모임 생성</h1>
      <Formik
        initialValues={{
          name: '',
          description: '',
          topic: '',
          region: '',
          applicationPrecautions: '',
          profileImage: null
        }}
        validate={validate}
        onSubmit={(values, {setSubmitting}) => handleSubmit(values, setSubmitting)}
        validateOnChange={false}>
        {({isSubmitting, setFieldValue, values}) => (
          <Form className={styles.formInner}>
            <div className={styles.content}> 
              <div className={styles.profileSection}>
                <img
                  src={preview||'/images/image_none.jpg'}
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
                      setPreview(URL.createObjectURL(event.currentTarget.files[0]));
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
            <div className={styles.buttonGroup}>
              <button type="button" disabled={isSubmitting} className={styles.cancelButton} onClick={()=>navigate(-1)}>
                취소
              </button> 
              <button type="submit" disabled={isSubmitting} className={styles.createButton}>
                모임 생성
              </button> 
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
