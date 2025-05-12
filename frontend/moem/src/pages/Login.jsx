import {Formik,Field,Form,ErrorMessage} from 'formik';
import { useAuth } from '../auth/AuthContext';
import styles from './Login.module.css'
import { useNavigate } from 'react-router-dom';

function Login(){
    const authContext = useAuth();
    const navigate = useNavigate();

    function validate(values){
        const errors = {};
        if(!values.username) errors.username = 'Username is required';
        if(!values.password) errors.password = 'Password is required';
        return errors;
    }
    async function onSubmit(values, setSubmitting){
        const success = await authContext.login(values.username, values.password);
        if(success){
            navigate("/");
        }
        else{
            console.log("failed");
        }
        setSubmitting(false);
    }
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <Formik 
                initialValues={{username: '', password: ''}}
                validate={validate}
                onSubmit={(values, {setSubmitting})=>onSubmit(values, setSubmitting)}
                validateOnChange={false}
            >
            {
                ({isSubmitting})=>(
                    <Form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <Field type="text" name="username" placeholder="ID" className={styles.input}/>
                            <ErrorMessage name="username" component="div" className={styles.error}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <Field type="password" name="password" placeholder="비밀번호" className={styles.input}/>
                            <ErrorMessage name="password" component="div" className={styles.error}/>
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.button}>
                            로그인
                        </button>
                    </Form>
                )
            }
            </Formik>

        </div>
    );
}

export default Login;