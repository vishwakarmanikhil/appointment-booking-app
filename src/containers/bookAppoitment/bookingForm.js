import React, { useState, useEffect, Fragment } from 'react';
import DatesSlider from './datesSlider';
import TimeSlots from './timeSlots';
import CustomModal from '../../components/modal';
import moment from 'moment';

const BookingForm = (props) => {
    const { doctorDetails, availableDates } = props;

    const [errors, setErrors] = useState({
        name: '',
        date: '',
        time: ''
    });
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const [patientName, setPatientName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
    };

    const checkForEmpty = (value, field) => {
        if (!value) {
            return `${field} field is required`;
        }
        return '';
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const nameError = checkForEmpty(patientName, 'Name');
        const dateError = checkForEmpty(selectedDate, 'Date');
        const timeError = checkForEmpty(selectedTimeSlot, 'Timeslot');

        setErrors({
            name: nameError,
            date: dateError,
            time: timeError
        });

        if (!nameError && !dateError && !timeError) {
            setIsSuccessModalVisible(true);
        }
    };

    const modalCloseHandler = () => {
        setPatientName('');
        setSelectedDate('');
        setSelectedTimeSlot('');
        setErrors({
            name: '',
            date: '',
            time: ''
        });

        setIsSuccessModalVisible(false);
    }


    return (
        <Fragment>
            <CustomModal
                isModalVisible={isSuccessModalVisible}
                modalCloseHandler={modalCloseHandler}
            >
                <div>
                    <div>
                        <p><b>Appointment Booked!!</b></p>
                    </div>
                    <br />
                    <p>Doctor id: {doctorDetails?.id}</p>
                    <p>Doctor Name: {doctorDetails?.doctor_name}</p>
                    <br />
                    <p><b>Booking Details</b></p>
                    <p>Patient Name: {patientName}</p>
                    <p>Date & Time: {moment(selectedDate)?.format('Do MMM, YYYY')} at {moment(selectedTimeSlot, 'HH:mm').format('hh:mm A')}</p>
                </div>
            </CustomModal>
            <div className='form__container'>
                <h2 className='form__title'>Book An Appointment</h2>
                <div className='fc__section'>
                    <p className='form_label__txt'>Patient Name:</p>
                    <input
                        value={patientName}
                        onChange={(e) => setPatientName(e?.target?.value)}
                        placeholder='Enter your name'
                        className='fc_input__style'
                    />
                    {errors.name && <p className='error_txt'>{errors.name}</p>}
                </div>
                <div className='fc__section'>
                    <DatesSlider
                        selectedDate={selectedDate}
                        doctorDetails={doctorDetails}
                        dateArray={availableDates}
                        handleDateChange={handleDateChange}
                    />
                    {errors.date && <p className='error_txt'>{errors.date}</p>}
                </div>

                <div className='fc__section'>
                    <TimeSlots
                        selectedDate={selectedDate}
                        selectedTimeSlot={selectedTimeSlot}
                        doctorDetails={doctorDetails}
                        handleTimeSlotSelect={handleTimeSlotSelect}
                    />
                    {errors.time && <p className='error_txt'>{errors.time}</p>}
                </div>

                <div className='fc__footer'>
                    <button onClick={handleSubmit}>Book Appointment</button>
                </div>
            </div>
        </Fragment>
    );
};

export default BookingForm;