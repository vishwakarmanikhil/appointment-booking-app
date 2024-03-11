import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import { Button, TimePicker, Form, InputNumber, notification } from 'antd';
import styles from './addAvailability.module.css';
import dayjs from 'dayjs';
import useUserData from '../../components/customHooks/useUserData';
import { getAvailability, addAvailability } from '../../redux/slices/availabilitySlice';
import { useDispatch, useSelector } from 'react-redux';
import { isValidObject } from '../../components/CommonFunctions';

const { RangePicker } = TimePicker;

const AddAvailability = () => {
    const userData = useUserData();
    const dispatch = useDispatch();

    const [loader, setLoader] = useState(true);
    const [availabilityData, setAvailabilityData] = useState([]);

    const availability = useSelector((state) => state?.availability?.data);

    useEffect(() => {
        if (availability?.success && loader) {
            let data = availability?.result;

            if (data?.length > 0) {
                setAvailabilityData(data);
            } else {
                notification.info({
                    message: 'No availabilty found! Create your own availability.'
                });
            }

            setTimeout(() => {
                setLoader(false);
            }, 500);
        }
    }, [availability]);


    useEffect(() => {
        if (isValidObject(userData) && loader === true) {
            getAvailabilityData();
        }
    }, [userData]);

    const getAvailabilityData = () => {
        setLoader(true);
        let post = {
            doctor_id: userData?.id
        }
        dispatch(getAvailability(post));
    }

    return (
        <div className={classNames('box__wrap')}>
            <h3 className={classNames('mb-20')}>Your Availability Time Range</h3>

            <div className={classNames(styles.availability__wrap)}>
                {loader ?
                    <div className={classNames(styles.availability_loding__wrap)}>
                        <div className={classNames('loading__anim')}></div>
                    </div>
                    :
                    availabilityData?.length > 0 ?
                        <div className={classNames(styles.availability__card)}>
                            <p className='h5-heading mb-5'>Start Time: <span className='txt-semiBold'>{availabilityData?.[0]?.start_time}</span></p>
                            <p className='h5-heading mb-5'>End Time: <span className='txt-semiBold'>{availabilityData?.[0]?.end_time}</span></p>
                            <p className='h5-heading mb-5'>Time Interval: <span className='txt-semiBold'>{availabilityData?.[0]?.interval_minute} Minutes</span></p>
                        </div>
                    :                
                        <AvailabilityForm 
                            userData={userData}
                            getAvailabilityData={getAvailabilityData}
                        />
                }
            </div>
        </div>
    )
};

const AvailabilityForm = (props) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    
    const { userData, getAvailabilityData } = props;

    const [actionLoader, setActionLoader] = useState(false);
    
    const availability = useSelector((state) => state?.availability?.data);

    useEffect(() => {
        if(availability?.success && actionLoader === true) {
            let data = availability?.result;
            if(isValidObject(data) && data?.affectedRows === 1) {
                notification.success({
                    message: 'Availability added successfully.'
                });

                setTimeout(() => {
                    setActionLoader(false);
                    getAvailabilityData();
                }, 500);
            }
        }
    }, [availability, actionLoader]);

    const formSubmitHandler = () => {
        form.validateFields().then(async values => {
            setActionLoader(true);
            let startTime = dayjs(values?.time?.[0])?.format('HH:mm A');
            let endTime = dayjs(values?.time?.[1])?.format('HH:mm A');

            let post = {
                start_time: startTime,
                end_time: endTime,
                interval_minute: values?.interval,
                date: 'all',
                doctor_id: userData?.id
            }

            dispatch(addAvailability(post));

        }).catch(errorInfo => {
            form.scrollToField(errorInfo?.errorFields?.[0]?.name, {
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        });
    }

    return (
        <Form
            form={form}
            onFinish={formSubmitHandler}
            layout={'vertical'}
            scrollToFirstError={{
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            }}
        >
            <Form.Item
                name={'time'}
                label={'Select your weekday timeslot:'}
                rules={[
                    {
                        required: true,
                        message: 'Please select a time',
                    },
                ]}
            >
                <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="HH:mm A"
                />
            </Form.Item>
            <Form.Item
                name={'interval'}
                label={'Please enter time in minutes per patient:'}
                rules={[
                    {
                        required: true,
                        message: 'Please enter interval',
                    },
                ]}
            >
                <InputNumber
                    type="number"
                    onWheel={() => document.activeElement.blur()}
                    placeholder='Ex. 30'
                />
            </Form.Item>
            <Form.Item>
                <Button htmlType='submit' type={'primary'} size='large' className={classNames('mt-20')} disabled={actionLoader} loading={actionLoader}>Submit</Button>
            </Form.Item>
        </Form>
    )
}


export default AddAvailability;