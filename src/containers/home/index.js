import React, { useState, useEffect, Fragment } from 'react'
import classNames from 'classnames';
import { isValidObject } from '../../components/CommonFunctions';
import { useSelector } from 'react-redux';
import styles from './home.module.css';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useUserData from '../../components/customHooks/useUserData';

const Home = () => {
    const userData = useUserData();

    return (
        <div className={classNames('box__wrap')}>
            
            {userData?.role === 'doctor' ?
                <Fragment>
                    <h2 className={'mb-10'}>Add Your Availability</h2>
                    <p className={classNames('p-large mb-30')}>Click on below button to add your availability. So that patient can book slots</p>
                    <Link to={'/add_availability'}><Button type='primary' size='large'>Add Your Availability</Button></Link>
                </Fragment>
            :
                <Fragment>
                    <h2 className={'mb-10'}>Book An Appoitment</h2>
                    <p className={classNames('p-large mb-30')}>Click on below button to book your slot for your doctor</p>
                    <Link to={'/book_appointment'}><Button type='primary' size='large'>Book An Appoitment</Button></Link>
                </Fragment>
            }
        </div>
    );
};

export default Home;