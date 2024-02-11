import React, { memo } from 'react';

const DoctorDetails = memo((props) => {
    const { doctorDetails } = props;

    return (
        <div className='doctor_info__wrap'>
            <img className='diw__img' src='https://www.aboutmyclinic.com/images/displayimage/2fffb01d25ab78b73b61c704f94d902653d9352e5ec8c57b6a20d.jpeg?type=d' alt={`Doctor ${doctorDetails?.doctor_name}`} />
            <div>
                <h1 className='diw__name'>{doctorDetails?.doctor_name}</h1>
                <p className='diw__degree'>{doctorDetails?.degree_suffix}</p>
                <p className='diw__expertise'>{doctorDetails?.expertise_subSpecialty}</p>
            </div>
        </div>
    );
});

export default DoctorDetails;