import moment from "moment";

export const formatDate = (date) => {
    const currentDate = moment().format('YYYY-MM-DD');
    if (moment(date).isSame(currentDate, 'day')) {
        return 'Today';
    } else {
        return moment(date).format('ddd, DD MMM');
    }
};

export const generateTimeSlots = () => {
    const startTime = '18:00';
    const endTime = '20:00';
    const interval = 20;

    const slots = [];
    let currentTime = moment(startTime, 'HH:mm');

    while (currentTime.isSameOrBefore(moment(endTime, 'HH:mm'))) {
        slots.push(currentTime.format('HH:mm'));
        currentTime.add(interval, 'minutes');
    }

    return slots;
};

export const isNullOrUndefinedOrEmpty = (value) => {
    return value !== null && value !== undefined && value !== '';
};

export const isObjectValid = (obj) => {
    return obj !== null && obj !== undefined && Object.keys(obj).length !== 0;
};
