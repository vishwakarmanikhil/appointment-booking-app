import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Button, Form, Input, Radio, notification } from 'antd'
import { inputFieldValidator, passwordValidator } from '../../components/FormValidations'
import { useDispatch, useSelector } from 'react-redux'
import { signupUser } from '../../redux/slices/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import styles from './signup.module.css';
import classNames from 'classnames'
import { isNotNullOrEmpty } from '../../components/CommonFunctions'

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const [loader, setLoader] = useState(false);

    const { isAuthenticated } = useContext(AuthContext);
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if(user?.success && loader) {
            let data = user?.result;
            if(isNotNullOrEmpty(data?.isExisted)) {
                notification.info({
                    message: 'Email address already existed!'
                });
            }

            if(data?.affectedRows === 1) {
                notification.success({
                    message: 'Account successfully created. redirecting to login page!'
                });

                setTimeout(() => {
                    navigate('/login');
                }, 500);
            }

            setTimeout(() => {
                setLoader(false);
            }, 500);
        }

        if(!user?.success && loader) {
            notification.error({
                message: 'Something went wrong please try again!'
            });

            setTimeout(() => {
                setLoader(false);
            }, 500);
        }
    }, [user]);

    const onSubmitHandler = () => {
        setLoader(true);
        form.validateFields().then((values) => {
            let post = {
                name: values?.full_name,
                email: values?.email,
                password: values?.password,
                role: values?.user_type
            }

            dispatch(signupUser(post));
        }).catch(errorInfo => {
            form.scrollToField(errorInfo?.errorFields?.[0]?.name, {
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        });
    }

    return(
        <div className={classNames('box__wrap')}>
            <h1 className={classNames('mb-20')}>Create Account</h1>
            <Form
                form={form}
                onFinish={onSubmitHandler}
                layout={'vertical'}
                scrollToFirstError={{
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                }}
            >
                <Form.Item
                    label="Full Name"
                    name={'full_name'}
                    rules={[{ required: true, validator: inputFieldValidator, validateTrigger: 'onSubmit' }]}
                >
                    <Input 
                        name='full_name'
                        placeholder="Eg. John Wick" 
                    />
                </Form.Item>
                <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                        {
                            type: 'email', message: 'Please enter a valid Email Address!', validateTrigger: 'onSubmit'
                        },
                        {
                            required: true, message: 'Please input your Email Address!', validateTrigger: 'onSubmit'
                        }
                    ]}
                >
                    <Input 
                        placeholder="Eg. johndeo@gmail.com" 
                        name="email"
                    />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, validator: passwordValidator, validateTrigger: 'onSubmit'}]}
                >
                    <Input 
                        type="password" 
                        placeholder="********" 
                        name="Password"
                    />
                </Form.Item>
                <Form.Item
                    name={'user_type'}
                    label={'Select user type'}
                    rules={[{ required: true, message: 'Please select user type!' }]}
                >
                    <Radio.Group
                        name='user_type'
                    >
                        <Radio value={'user'}>Patient</Radio>
                        <Radio value={'doctor'}>Doctor</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Button htmlType='submit' type={'primary'} size={'large'} className={classNames('mt-20')} loading={loader} disabled={loader}>create Account</Button>
                </Form.Item>
            </Form>
            <div>Already have account? <Link to={'/login'}>Log In</Link></div>
        </div>
    )
}

export default Signup