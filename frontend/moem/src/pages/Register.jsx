import {Formik,Field,Form,ErrorMessage} from 'formik';
import { apiClient } from '../api/ApiClient';
import { AUTH_API } from '../api/AuthApi';
import styles from './Register.module.css'

function Register(){

    function validate(values){
        const errors = {};
        if(!values.username) errors.username = 'Username is required';
        if(!values.password) errors.password = 'Password is required';
        return errors;
    }
    async function register(values, setSubmitting){
        try{
            const response = await apiClient.post(AUTH_API.REGISTER, 
                {
                    username: values.username, 
                    password: values.password
                });
            // success
            if(response.status === 200){
                console.log("success");
            }
        }
        catch(error){
            // duplicated username
            if(error.response?.status === 409){
                console.log("confilct");
            }
            // internal server error
            else{
                console.log("error");
            }
        }
        setSubmitting(false);
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Register</h1>
            <Formik 
                initialValues={{username: '', password: ''}}
                validate={validate}
                onSubmit={(values, {setSubmitting})=>register(values, setSubmitting)}
                validateOnChange={false}
            >
            {
                ({isSubmitting})=>(
                    <Form className={styles.form}>
                        <div className={styles.inputGroup}>
                            <Field type="text" name="username" placeholder="username" className={styles.input}/>
                            <ErrorMessage name="username" component="div" className={styles.error}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <Field type="password" name="password" placeholder="password" className={styles.input}/>
                            <ErrorMessage name="password" component="div" className={styles.error}/>
                        </div>
                        <button type="submit" disabled={isSubmitting} className={styles.button}>
                            Register
                        </button>
                    </Form>
                )
            }
            </Formik>
        </div>
    )
}

export default Register;