import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from '../../redux/slices/userSlice'
import { isNotNullOrEmpty, isValidObject } from '../CommonFunctions';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import styles from './topbar.module.css';
import classNames from 'classnames';

const Header = (props) => {
    const dispatch = useDispatch();
    const { isAuthenticated, userDetails, userLogout } = useContext(AuthContext);

    const [userData, setUserData] = useState({});

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if(isAuthenticated && isNotNullOrEmpty(userDetails?.id)) {
            let post = {
                id: userDetails?.id
            }
            dispatch(getUserDetails(post));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if(user?.success && isValidObject(user?.result)) {
            let data = user?.result;
            setUserData(data);
        }
    }, [user]);


    return (
        <header className={classNames('flex-row flex-align-center flex-space-between column-gap-20', styles.header__wrap)}>
            <div>
                <h4>Hi, {userData?.name} ({userData?.role})</h4>
            </div>
            <div>
                <Button onClick={userLogout}><LogoutOutlined /> Logout </Button>
            </div>
        </header>
    );
};

export default Header;