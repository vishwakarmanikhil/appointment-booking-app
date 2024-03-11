import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/userSlice';
import { Form, Input, Button, notification } from 'antd';
import { isNotNullOrEmpty, isValidObject } from '../../components/CommonFunctions';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import classNames from 'classnames';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, userLogin } = useContext(AuthContext);

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && user?.success && loading) {
      let data = user?.result;
      if(isNotNullOrEmpty(data?.isInvalid)) {
        notification.info({
          message: 'Invalid credential please check!'
        });
      }

      if (data && isValidObject(data) && isNotNullOrEmpty(data?.user?.id)) {
        const userData = {
          id: data?.user?.id
        }
        userLogin(data?.token, userData);
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const handleLogin = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      let post = {
        email: values.email,
        password: values.password
      }

      dispatch(loginUser(post));
    }).catch(errorInfo => {
      form.scrollToField(errorInfo?.errorFields?.[0]?.name, {
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    });
  };

  return (
    <div className={classNames('box__wrap')}>
      <h1 className={classNames('mb-20')}>Login</h1>
      <Form
        form={form}
        onFinish={handleLogin}
        layout={'vertical'}
        scrollToFirstError={{
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        }}
      >
        <Form.Item
          label='email'
          name='email'
          rules={[
            {
              type: 'email', message: 'Please enter a valid Email Address!', validateTrigger: 'onSubmit'
            },
            {
              required: true, message: 'Please input your Email Address!', validateTrigger: 'onSubmit'
            }
          ]}
        >
          <Input name='email' type={'email'} />
        </Form.Item>

        <Form.Item
          label='password'
          name={'password'}
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Button htmlType='submit' type='primary' size={'large'} loading={loading} disabled={loading} className={classNames('mt-20')}>Login</Button>
      </Form>
      <div className='p-large mt-20'>Don't have account? <Link to={'/signup'}>Sign Up</Link></div>
    </div>
  );
};

export default Login;