import React, { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { findBestMatch, extractKeywords, generateTimeSlots, generateDatesForOneWeek, getNextTimeSlot, getDoctorName, appointmentPostHandler } from "./functions";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorDetails } from "../../redux/slices/doctorDetailsAvailabilitySlice";
import { addAppointment, getAppointment, updateAppointment, cancelAppointment } from "../../redux/slices/appointmentSlice";
import useUserData from '../../components/customHooks/useUserData';
import classNames from "classnames";
import styles from './voiceBot.module.css';

var intialCall = false;

const VoiceBot = () => {
  const dispatch = useDispatch();
  const userData = useUserData();

  const [loader, setLoader] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [appointmentList, setAppointmentList] = useState('');

  const [recentActivity, setRecentActivity] = useState('');
  const [doctorAction, setDoctorAction] = useState('');
  const [timeSlots, setTimeSlots] = useState('');
  const [appointmentAction, setAppointmentAction] = useState({
    appointment_id: '',
    doctor_id: '',
    date: '',
    start_time: '',
    end_time: '',
    status: ''
  });

  const sendGreeting = () => {
    const greetingMessage = "Hi! I'm docHelper. How may I help you today? \n You can start with saying 'Book An Appointment'";
    updateConversation("", greetingMessage, 'GREETING', {});
  };

  const noAppointments = () => {
    const greetingMessage = "No appointments found! You can schedule new appointment by saying 'Book Appointment'";
    updateConversation("", greetingMessage, 'NO_APPOINTMENT', {});
  };

  const showAppointmentList = () => {
    updateConversation("", 'Your booked appointments are:', 'SHOW_APPOINTMENT', {});
  }

  const handleGetAppointmentRequest = () => {
    if (appointmentList?.length > 0) {
      showAppointmentList();
    } else {
      setLoader(true);
      setRecentActivity('GETTING_APPOINTMENTS');
      dispatch(getAppointment({ user_id: userData?.id }));
      return { response: "Getting your appointments list", action: "GETTING_APPOINTMENTS" };
    }
  }

  const handleAppointmentRequest = () => {
    setDoctorAction('doctor_name');
    return { response: 'Showing below doctors list please click and select doctor', action: "SCHEDULE_APPOINTMENT" };
  };

  const doctorDatesList = () => {
    setDoctorAction('doctor_dates');

    updateConversation("", 'Select date of an appointment', 'NO_APPOINTMENT', {});
  }

  const doctorTimeSlot = async (doctor_id) => {
    setDoctorAction('time_slots');
    const timeSlots = await generateTimeSlots(doctorDetails, Number(doctor_id));
    setTimeSlots(timeSlots);

    if (timeSlots?.length > 0) {
      updateConversation("", 'Showing doctor time slot', 'APPOINTMENT_SLOTS', {});
    } else {
      updateConversation("", 'Doctor does not have slots, please select another doctor', 'APPOINTMENT_SLOTS', {});
    }
  };

  const handleRescheduleRequest = () => {
    setRecentActivity('RESCHEDULE_INITIATED');
    setLoader(true);
    dispatch(getAppointment({ user_id: userData?.id }));

    return { response: 'Getting your Appointments for reschedule, hang on!', action: 'RESCHEDULE_INITIATED' };
  }

  const showRescheduleAppointment = () => {
    updateConversation("", 'Select appointment which you what to reschedule', 'RESCHEDULE_ACTION', {});

    setDoctorAction('reschedule_action')
  }

  const handleCancelRequest = () => {
    setRecentActivity('CANCEL_INITIATED');
    setLoader(true);
    dispatch(getAppointment({ user_id: userData?.id }));

    return { response: 'Getting your Appointments for reschedule, hang on!', action: 'CANCEL_INITIATED' };
  }

  const showCancelAppointment = () => {
    updateConversation("", 'Select appointment which you what to cancel', 'CANCEL_ACTION', {});

    setDoctorAction('cancel_action')
  }

  const commands = [
    {
      command: [
        "schedule appointment",
        "schedule an appointment",
        "schedule meeting",
        "schedule meet",
        "create appointment",
        "book appointment",
        "reserve appointment",
        "book meeting",
        "reserve meeting",
        "book meet",
        "reserve meet",
        "arrange appointment",
        "arrange meeting",
        "arrange meet",
        "plan appointment",
        "plan meeting",
        "plan meet"
      ],
      callback: handleAppointmentRequest,
    },
    {
      command: [
        "shows appointment",
        "shows appointments",
        "show appointment",
        "show appointments",
        "get appointment",
        "get appointments",
        "my appointments",
        "my appointment",
        "show my appointment",
        "show my appointments",
        "display appointment",
        "display appointments",
        "view appointment",
        "view appointments",
        "see appointment",
        "see appointments",
        "check appointment",
        "check appointments",
        "list appointment",
        "list appointments"
      ],
      callback: handleGetAppointmentRequest,
    },
    {
      command: [
        "reschedule appointment",
        "reschedule appointments",
        "reschedule my appointment",
        "change appointment time",
        "change meeting time",
        "move appointment",
        "move meeting",
        "modify appointment time",
        "modify meeting time",
        "adjust appointment schedule",
        "adjust meeting schedule",
        "postpone appointment",
        "postpone meeting",
        "delay appointment",
        "delay meeting",
        "shift appointment",
        "shift meeting",
        "rearrange appointment",
        "rearrange meeting"
      ],
      callback: handleRescheduleRequest,
    },
    {
      command: [
        "cancel appointment",
        "cancel appointments",
        "cancel my appointment",
        "cancel this appointment",
        "cancel meeting",
        "cancel my meeting",
        "cancel this meeting",
        "delete appointment",
        "delete my appointment",
        "delete this appointment",
        "remove appointment",
        "remove my appointment",
        "remove this appointment"
      ],
      callback: handleCancelRequest,
    }
  ];

  const doctor = useSelector((state) => state.doctor?.data);
  const appointmentDataList = useSelector((state) => state?.appointment?.appointmentList);
  const bookAppointmentResponse = useSelector((state) => state?.appointment?.addAppointment);
  const updateAppointmentResponse = useSelector((state) => state?.appointment?.updateAppointment);
  const cancelAppointmentResponse = useSelector((state) => state?.appointment?.cancelAppointment);

  useEffect(() => {
    if (appointmentDataList?.success && (recentActivity === 'GETTING_APPOINTMENTS' || recentActivity === 'RESCHEDULE_INITIATED' || recentActivity === 'CANCEL_INITIATED')) {
      if (appointmentDataList?.result?.length === 0) {
        noAppointments();
      } else {
        setAppointmentList(appointmentDataList?.result);
        if (recentActivity === 'RESCHEDULE_INITIATED') {
          showRescheduleAppointment();
        }

        if (recentActivity === 'CANCEL_INITIATED') {
          showCancelAppointment();
        }

        if (recentActivity === 'GETTING_APPOINTMENTS') {
          setTimeout(() => {
            showAppointmentList();
          }, 500);
        }
      }
      setLoader(false);
      if (recentActivity !== 'RESCHEDULE_INITIATED' && recentActivity !== 'CANCEL_INITIATED') {
        setRecentActivity('');
      }
    }
  }, [appointmentDataList]);

  useEffect(() => {
    if (doctor && doctor?.success) {
      let data = doctor?.result;
      if (data && data?.length > 0) {
        setDoctorDetails(data);
      }
    }
  }, [doctor]);

  useEffect(() => {
    if (bookAppointmentResponse?.success && recentActivity === 'SUBMIT_APPOINTMENT') {
      if (bookAppointmentResponse?.result && bookAppointmentResponse?.result?.affectedRows === 1) {
        setLoader(false);
        appointmentPostHandler('success', 'add', updateConversation, appointmentActionResetHandler);
        dispatch(getAppointment({ user_id: userData?.id }));
      } else {
        appointmentPostHandler('failed', 'add', updateConversation, appointmentActionResetHandler);
      }
    }
  }, [bookAppointmentResponse]);

  useEffect(() => {
    if (updateAppointmentResponse?.success && recentActivity === 'SUBMIT_APPOINTMENT') {
      if (updateAppointmentResponse?.result && updateAppointmentResponse?.result?.affectedRows === 1) {
        setLoader(false);
        appointmentPostHandler('success', 'update', updateConversation, appointmentActionResetHandler);
        dispatch(getAppointment({ user_id: userData?.id }));
      } else {
        appointmentPostHandler('failed', 'update', updateConversation, appointmentActionResetHandler);
      }
    }
  }, [updateAppointmentResponse]);

  useEffect(() => {
    if (cancelAppointmentResponse?.success && recentActivity === 'SUBMIT_APPOINTMENT') {
      if (cancelAppointmentResponse?.result && cancelAppointmentResponse?.result?.affectedRows === 1) {
        setLoader(false);
        appointmentPostHandler('success', 'cancel', updateConversation, appointmentActionResetHandler);
        dispatch(getAppointment({ user_id: userData?.id }));
      } else {
        appointmentPostHandler('failed', 'cancel', updateConversation, appointmentActionResetHandler);
      }
    }
  }, [cancelAppointmentResponse]);

  useEffect(() => {
    if (!intialCall) {
      sendGreeting();
      intialCall = true;
      getDoctorDetails();
    }
  }, []);

  const getDoctorDetails = () => {
    dispatch(fetchDoctorDetails());
  }

  const handleUserMessage = (transcript) => {
    try {
      const keywords = extractKeywords(transcript);
      const bestMatch = findBestMatch(keywords, commands);
      if (bestMatch) {
        const { response, action } = bestMatch?.callback();
        updateConversation(transcript, response, action, {});
      } else {
        updateConversation(
          transcript,
          "Sorry, I did not understand. Can you please provide more details?",
          "UNKNOWN_ACTION",
          {}
        );
      }
    } catch (error) {
      console.log('Human error');
    }
  }

  const handleResetConversation = () => {
    setLoader(false);
    setConversation([]);
    setRecentActivity('GETTING_APPOINTMENTS');
    setDoctorAction('');
    setTimeSlots([]);
    setAppointmentAction({
      appointment_id: '',
      doctor_id: '',
      date: '',
      start_time: '',
      end_time: '',
      status: ''
    });

    setTimeout(() => {
      sendGreeting();
    }, 500);
  }

  const updateConversation = (input, response, action, data) => {
    const newMessage = { user: input, bot: response, action, data };
    setConversation((prevConversation) => [...prevConversation, newMessage]);
  };

  const appointmentActionResetHandler = () => {
    setAppointmentAction({
      doctor_id: '',
      date: '',
      start_time: '',
      end_time: '',
      status: ''
    });
    setRecentActivity('');
    setDoctorAction('');
    setTimeSlots('');
  }

  const appointmentSubmitHandler = () => {
    let post = {
      user_id: userData?.id,
      doctor_id: appointmentAction?.doctor_id,
      date: appointmentAction?.date,
      start_time: appointmentAction?.start_time,
      end_time: appointmentAction?.end_time,
      status: 'confirm'
    };

    dispatch(addAppointment(post));
  }

  const bookAppointmentHandler = async (key, value) => {
    if (key !== 'confirm_appointment') {
      setAppointmentAction(prevState => ({
        ...prevState,
        [key]: value
      }));
    } else {
      if (key === 'confirm_appointment' && value === 'yes') {
        setLoader(true);
        setRecentActivity('SUBMIT_APPOINTMENT');
        updateConversation('Yes', '', 'CONFIRM_ACTION_YES', {});
        setDoctorAction('');
        appointmentSubmitHandler();
      } else {
        updateConversation('No', '', 'CONFIRM_ACTION_NO');
        appointmentPostHandler('cancel', 'add', updateConversation, appointmentActionResetHandler);
      }
    }


    if (key === 'doctor_id') {
      const doctor_name = getDoctorName(doctorDetails, value);
      updateConversation(`${doctor_name}`, "", 'USER_DOCTOR_SELECTED', {});
      updateConversation("", `${doctor_name} is selected`, 'DOCTOR_SELECTED', {});

      doctorDatesList();
    }

    if (key === 'date') {
      updateConversation(`${value}`, "", 'USER_DATE_SELECTED', {});
      updateConversation("", `${value} is selected`, 'DATE_SELECTED', {});

      doctorTimeSlot(appointmentAction?.doctor_id);
    }

    if (key === 'start_time') {
      let end_time = await getNextTimeSlot(timeSlots, value);
      setAppointmentAction(prevState => ({
        ...prevState,
        end_time: end_time
      }));

      const tempData = {...appointmentAction, 'start_time' : value, 'end_time': end_time}

      updateConversation(`${value}`, "", 'USER_TIMESLOT_SELECTED', {});
      updateConversation("", `${value} time is selected`, 'TIMESLOT_SELECTED', {});
      updateConversation("", `Are you sure you want to book appointment for below details?`, 'BOOK_ACTION_CONFIRMATION', {...tempData});

      setDoctorAction('confirm_appointment');
    }
  };

  const appointmentRescheduleSubmitHandler = () => {
    let post = {
      appointment_id: appointmentAction?.appointment_id,
      user_id: userData?.id,
      doctor_id: appointmentAction?.doctor_id,
      date: appointmentAction?.date,
      start_time: appointmentAction?.start_time,
      end_time: appointmentAction?.end_time,
      status: 'confirm'
    };

    dispatch(updateAppointment(post));
  }

  const rescheduleAppointmentHandler = async (key, value) => {
    if (key !== 'confirm_appointment') {
      setAppointmentAction(prevState => ({
        ...prevState,
        [key]: value
      }));
    } else {
      if (key === 'confirm_appointment' && value === 'yes') {
        setLoader(true);
        setRecentActivity('SUBMIT_APPOINTMENT');
        updateConversation('Yes', '', 'CONFIRM_ACTION_YES', {});
        setDoctorAction('');
        appointmentRescheduleSubmitHandler();
      }else {
        updateConversation('No', '', 'CONFIRM_ACTION_NO');
        appointmentPostHandler('cancel', 'update', updateConversation, appointmentActionResetHandler);
      }
    }

    if (key === 'appointment_id') {
      let appointmentData = appointmentList?.filter(d => d.appointment_id === value)?.[0];
      setAppointmentAction(prevState => ({
        ...prevState,
        doctor_id: appointmentData?.doctor_id,
      }));
      updateConversation(`${getDoctorName(doctorDetails, Number(appointmentData?.doctor_id))}-${appointmentData?.date}-${appointmentData?.start_time}-${appointmentData?.end_time}`, "", 'RESCHEDULE_APPOINTMENT_SELECTED', {});
      updateConversation("", `you want to reschedule for ${getDoctorName(doctorDetails, Number(appointmentData?.doctor_id))}-${appointmentData?.date}-${appointmentData?.start_time}-${appointmentData?.end_time}`, 'USER_RESCHEDULE_APPOINTMENT_SELECTED', {});
      doctorDatesList();
    }

    if (key === 'date') { 
      updateConversation(`${value}`, "", 'RESCHEDULE_APPOINTMENT_SELECTED', {});
      updateConversation("", `date ${value} is selected.`, 'USER_RESCHEDULE_APPOINTMENT_SELECTED', {});
      doctorTimeSlot(appointmentAction?.doctor_id);
    }

    if (key === 'start_time') {
      let end_time = await getNextTimeSlot(timeSlots, value);
      setAppointmentAction(prevState => ({
        ...prevState,
        end_time: end_time
      }));

      const tempData = {...appointmentAction, 'start_time' : value, 'end_time': end_time}

      updateConversation(`${value}`, "", 'USER_TIMESLOT_SELECTED', {});
      updateConversation("", `${value} time is selected`, 'TIMESLOT_SELECTED', {});
      updateConversation("", `Are you sure you want to reschedule your appointment for below details?`, 'RESCHEDULE_ACTION_CONFIRMATION', {...tempData});
      // if (isNotNullOrEmpty(appointmentAction?.appointment_id)) {
        
      // } else {
      //   updateConversation("", `Are you sure you want to book appointment for below details?`, 'APPOINTMENT_CONFIRM');
      // }

      setDoctorAction('confirm_appointment');
    }
  }

  const appointmentCancelSubmitHandler = () => {
    let post = {
      appointment_id: appointmentAction?.appointment_id,
    };
    dispatch(cancelAppointment(post));
  }

  const appointmentCancelHandler = (key, value) => {
    if (key !== 'confirm_appointment') {
      setAppointmentAction(prevState => ({
        ...prevState,
        [key]: value
      }));
    } else {
      if (key === 'confirm_appointment' && value === 'yes') {
        setLoader(true);
        setRecentActivity('SUBMIT_APPOINTMENT');
        updateConversation('Yes', '', 'CONFIRM_ACTION_YES', {});
        setDoctorAction('');
        appointmentCancelSubmitHandler();
      }else {
        updateConversation('No', '', 'CONFIRM_ACTION_NO', {});
        appointmentPostHandler('cancel', 'cancel', updateConversation, appointmentActionResetHandler);
      }
    }

    if (key === 'appointment_id') {
      let appointmentData = appointmentList?.filter(d => d.appointment_id === value)?.[0];
      setAppointmentAction(appointmentData);
      const tempData = {...appointmentAction};

      updateConversation(`${getDoctorName(doctorDetails, Number(appointmentData?.doctor_id))}-${appointmentData?.date}-${appointmentData?.start_time}-${appointmentData?.end_time}`, "", 'CANCEL_APPOINTMENT_SELECTED', {});
      updateConversation("", `Do you want to cancel appointment for below details?`, 'CANCEL_ACTION_CONFIRMATION', {...tempData});
      setDoctorAction('confirm_appointment');
    }
  }

  return (
    <div className={classNames(styles.chat__container)}>
      <div className={classNames(styles.chat__wrap)}>
        <ChatHistory
          loader={loader}
          conversation={conversation}
          doctorDetails={doctorDetails}
          doctorAction={doctorAction}
          appointmentAction={appointmentAction}
          timeSlots={timeSlots}
          appointmentList={appointmentList}
          recentActivity={recentActivity}
          generateDatesForOneWeek={generateDatesForOneWeek}
          bookAppointmentHandler={bookAppointmentHandler}
          rescheduleAppointmentHandler={rescheduleAppointmentHandler}
          appointmentCancelHandler={appointmentCancelHandler}
        />
        <ChatInput 
          onSend={handleUserMessage} 
          resetConversation={handleResetConversation}
        />
      </div>
    </div>
  );
};

export default VoiceBot;