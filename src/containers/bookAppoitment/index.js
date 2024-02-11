import React, { useState, useEffect } from 'react';
import { fetchDoctorDetailsFromAPI } from '../../components/API';
import { moment } from "moment";

import './style.css';
import BookingForm from './bookingForm';
import DoctorDetails from './doctorDetails';

const BookAppoitment = () => {

    const [loader, setLoader] = useState(true);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [availableDates, setAvailableDates] = useState(null);

    useEffect(() => {
        // Fetch doctor details from API
        const fetchDoctorDetails = async () => {
            try {
                const result = await fetchDoctorDetailsFromAPI(2);

                if (result !== null && result !== "" && result !== undefined) {
                    setDoctorDetails(result);

                    const uniqueDates = [];
                    result?.timeslots.forEach(slot => {
                        if (!uniqueDates.includes(slot.date)) {
                            uniqueDates.push(slot.date);
                        }
                    });

                    setAvailableDates(uniqueDates);

                    setTimeout(() => {
                        setLoader(false);
                    }, 200);
                }
            } catch (error) {
                console.error('Error fetching doctor details:', error);
                // Handle error if necessary
            }
        };

        fetchDoctorDetails();
    }, []);

    return (
        <div className='page__container'>
            {loader ?
                <div className='loading__wrap'>
                    <div className='loading__anim'></div>
                </div>
                :
                (
                    <div className='container'>
                        <DoctorDetails
                            doctorDetails={doctorDetails}
                        />

                        <BookingForm
                            doctorDetails={doctorDetails}
                            availableDates={availableDates}
                        />
                    </div>
                )}
        </div>
    );
};

export default BookAppoitment;
