import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { apiClient } from '../api/ApiClient';
import { AUTH_API } from '../api/AuthApi';
import { uploadProfileImage } from '../services/FileService';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Register() {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);

    function validate(values) {
        const errors = {};
        if (!values.username) errors.username = 'ID를 입력해주세요';
        if (!values.password) errors.password = '비밀번호를 입력해주세요';
        if (!values.name) errors.name = '이름을 입력해주세요';
        if (!values.gender || values.gender === "") errors.gender ='성별을 선택해주세요'
        return errors;
    }

    async function register(values, setSubmitting) {
        try {
            const formData = new FormData();
            if(values.profileImage){
                formData.append("profile", values.profileImage);
                // profile = await uploadProfileImage(formData);
            }

            const dto = {
                username: values.username,
                password: values.password,
                name: values.name,
                profileImage: null,
                age: values.age,
                gender: values.gender,
                region: values.region,
                interests: values.interests
            }
            formData.append("data", new Blob([JSON.stringify(dto)], {type: 'application/json'}));
            const response = await apiClient.post(AUTH_API.REGISTER, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                navigate('/');
            }
        } catch (error) {
            if (error.response?.status === 409) {
                console.log('conflict');
            } else {
                console.log('error');
            }
        }
        setSubmitting(false);
    }

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>가입 정보</h1>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    name: '',
                    age: '',
                    gender: '',
                    region: '',
                    interests: [''],
                    profileImage: null
                }}
                validate={validate}
                onSubmit={(values, { setSubmitting }) => register(values, setSubmitting)}
                validateOnChange={false}
            >
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form className={styles.formInner}>
                        <div className={styles.content}>
                            <div className={styles.profileSection}>
                                <img
                                    src={preview || '/images/avatar_default.jpg'}
                                    alt="Preview"
                                    className={styles.preview}
                                />
                                <label className={styles.uploadButton}>
                                    프로필 등록
                                    <input
                                        type="file"
                                        name="profileImage"
                                        style={{ display: 'none' }}
                                        onChange={(event) => {
                                            setFieldValue('profileImage', event.currentTarget.files[0]);
                                            setPreview(URL.createObjectURL(event.currentTarget.files[0]));
                                        }}
                                    />
                                </label>
                            </div>
                            <div className={styles.formWrapper}>
                                <div className={styles.inputGroup}>
                                    <label>ID</label>
                                    <Field type="text" name="username" className={styles.input} />
                                    <ErrorMessage name="username" component="div" className={styles.error} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>비밀번호</label>
                                    <Field type="password" name="password" className={styles.input} />
                                    <ErrorMessage name="password" component="div" className={styles.error} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>이름</label>
                                    <Field type="text" name="name" className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>나이</label>
                                    <Field type="number" name="age" className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>성별</label>
                                    <Field as="select" name="gender" className={styles.input}>
                                        <option value="">선택</option>
                                        <option value="male">남성</option>
                                        <option value="female">여성</option>
                                    </Field>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>지역</label>
                                    <Field type="text" name="region" className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>관심사</label>
                                    <FieldArray name="interests">
                                        {({ push, remove }) => (
                                            <div>
                                                {values.interests.map((_, index) => (
                                                    <div key={index} className={styles.interestRow}>
                                                        <Field name={`interests.${index}`} className={styles.input} />
                                                        <button type="button" onClick={() => remove(index)}>–</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => push('')}>+ 관심사 추가</button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.button}>
                            가입
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Register;
