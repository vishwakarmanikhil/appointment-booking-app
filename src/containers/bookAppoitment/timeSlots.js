import React from 'react';
import { generateTimeSlots, isNullOrUndefinedOrEmpty } from '../../components/commonFunctions';
import moment from 'moment';

const TimeSlots = (props) => {
    const { selectedDate, selectedTimeSlot, doctorDetails, handleTimeSlotSelect } = props;
    const timeSlots = generateTimeSlots();

    const isTimeSlotDisabled = (time) => {
        const formattedTime = time.length === 5 ? time + ':00' : time;

        return doctorDetails?.timeslots?.some(booking => {
            return (
                booking.date === selectedDate &&
                booking.time_from === formattedTime &&
                booking.booking_status === 1
            );
        });
    };

    const countAvailableTimeSlots = () => {
        return doctorDetails?.timeslots?.filter(booking => {
            return booking.date === selectedDate && booking.booking_status !== 1;
        }).length || 0;
    };

    return (
        <div>
            <div className='fc_time__header'>
                <p className='form_label__txt'>Time Slots:</p>
                {isNullOrUndefinedOrEmpty(selectedDate) && <div>Available slots {countAvailableTimeSlots()}</div>}
            </div>

            <div className='time_slider__container'>
                <ul className='tsc__list'>
                    {timeSlots.map((slot, index) => (
                        <li key={index} className='tsc__item'>
                            <button
                                onClick={() => handleTimeSlotSelect(slot)}
                                disabled={isTimeSlotDisabled(slot) || !isNullOrUndefinedOrEmpty(selectedDate)}
                                className={`tsc__btn ${selectedTimeSlot === slot ? 'active' : ''}`}
                            >
                                {moment(slot, 'HH:mm').format('hh:mm A')}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TimeSlots;