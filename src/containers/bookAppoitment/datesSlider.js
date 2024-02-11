import React, { useState } from 'react';
import { formatDate } from '../../components/commonFunctions';
import moment from 'moment';
import IconAssets from '../../components/iconAssets/index';

const DatesSlider = (props) => {
    const { dateArray, selectedDate, handleDateChange } = props;

    const [currentIndex, setCurrentIndex] = useState(0);

    const groupDatesByMonth = (dates) => {
        const groupedDates = {};
        dates?.forEach(date => {
            const month = moment(date).format('MMMM YYYY');
            if (!groupedDates[month]) {
                groupedDates[month] = [];
            }
            groupedDates[month].push(date);
        });
        return groupedDates;
    };

    const groupedDates = groupDatesByMonth(dateArray);
    const slides = Object.entries(groupedDates);

    const nextSlide = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(slides.length - 1);
        }
    };

    return (
        <div>
            <p className='form_label__txt'>Select Date:</p>

            <div className="date_slider__container">
                <div className="asc__slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {slides.map(([month, dates], index) => (
                        <div className="asc__slide" key={index}>
                            <p className='asc__month'>{month}</p>
                            <ul className='asc__list'>
                                {dates.map((date, idx) => (
                                    <li key={idx} className='asc__item'>
                                        <button onClick={() => handleDateChange(date)} className={`asc__btn ${selectedDate === date ? 'active' : ''}`}>{formatDate(date)}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <button className="asc__prev" onClick={prevSlide} disabled={currentIndex === 0}><IconAssets.LeftArrowIcon height='25' width='25' filledColor={'#fff'} /></button>
                <button className="asc__next" onClick={nextSlide} disabled={currentIndex === slides.length - 1}><IconAssets.RightArrowIcon height='25' width='25' filledColor={'#fff'} /></button>
            </div>
        </div>
    );
};

export default DatesSlider;