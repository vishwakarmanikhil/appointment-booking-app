import nlp from "compromise";
import dayjs from "dayjs";

export const extractKeywords = (text) => {
  const unigrams = nlp(text)
    .terms()
    .out("array")
    .map((word) => word.toLowerCase());
  const stopWords = [
    "the",
    "and",
    "or",
    "an",
    "is",
    "was",
    "are",
    "were",
    "you",
    "I",
    "he",
    "she",
    "it",
    "we",
    "they",
  ];
  return unigrams.filter((word) => !stopWords.includes(word));
};

// export const findBestMatch = (keywords, commands) => {
//   let bestMatch = null;
//   let maxMatches = 0;
//   const keywordTxt = keywords?.join(" ");

//   commands?.forEach((cmd) => {
//     const matches = cmd?.command
//       ?.map(phrase => phrase.toLowerCase())
//       ?.filter(phrase => keywordTxt.includes(phrase))
//       ?.length;

//     if (matches > maxMatches) {
//       maxMatches = matches;
//       bestMatch = cmd;
//     }
//   });

//   return bestMatch;
// };

export const findBestMatch = (keywords, commands) => {
  let bestMatch = null;
  let maxMatches = 0;
  const keywordTxt = keywords?.join(" ");

  commands?.forEach((cmd) => {
    const commandWithoutAppointment = cmd.command
      .filter(phrase => phrase.toLowerCase() !== "appointment")
      .join(" ");

    const matches = commandWithoutAppointment
      .toLowerCase()
      .includes(keywordTxt.toLowerCase());

    if (matches && cmd.command.length > maxMatches) {
      maxMatches = cmd.command.length;
      bestMatch = cmd;
    }
  });

  return bestMatch;
};


export function getNextTimeSlot(timeSlots, selectedTimeSlot) {
  const index = timeSlots.indexOf(selectedTimeSlot)

  if (index !== -1 && index < timeSlots.length - 1) {
    return timeSlots[index + 1];
  }

  return null; // If the selected time slot is not found or it's the last element
}

export function generateTimeSlots(doctorData, selectedDoctorId) {
  const selectedDoctor = doctorData.find(doctor => doctor.id === selectedDoctorId);

  if (!selectedDoctor) {
    return [];
  }

  const { start_time, end_time, interval_minute } = selectedDoctor;

  const startTime = dayjs(start_time, 'h:mm A');
  const endTime = dayjs(end_time, 'h:mm A');

  const timeSlots = [];
  let currentTime = startTime;

  while (currentTime.isBefore(endTime)) {
    timeSlots.push(currentTime.format('h:mm A'));
    currentTime = currentTime.add(interval_minute, 'minute');
  }

  return timeSlots;
}

export function generateDatesForOneWeek() {
  const today = dayjs();
  const dates = [];

  for (let i = 1; i <= 7; i++) {
      const currentDate = today.add(i, 'day');
      const formattedDate = currentDate.format('DD-MM-YYYY');
      dates.push(formattedDate);
  }

  return dates;
}

export function getDoctorName(doctorList, id) {
  const name = doctorList?.filter(data => data.id === id)?.[0]?.name;

  return name;
}

export const appointmentPostHandler = (value, type, updateHandler, nextHandler) => {
  let keyword = '';
  if(type === 'add') {
    keyword='booking';
  } else if(type === 'update') {
    keyword ='reschedule';
  } else if(type === 'cancel') {
    keyword = 'cancel';
  } else {
    keyword = 'action';
  }

  if (value === 'failed') {
    updateHandler(``, `Appointment ${keyword} is Failed, please try again you can start over by saying 'Schedule Appointment'`, 'APPOINTEMT_BOOKING_FAILED', {});
  } else if (value === 'cancel') {
    updateHandler(``, `Appointment ${keyword} is Canceled, you can start over by saying 'Schedule Appointment'`, 'APPOINTEMT_BOOKING_CANCEL', {});
  } else if (value === 'success') {
    updateHandler(``, `Appointment ${keyword} is successfully, check your booked appointment by saying 'show appointments'`, 'APPOINTEMT_BOOKING_SUCCESS', {});
  } else {
    updateHandler(``, `Appointment ${keyword} is Failed, something went wrong. You can start over by saying 'Schedule Appointment'`, 'APPOINTEMT_BOOKING_FAILED', {});
  }

  nextHandler();
}