import React, { useEffect } from "react";
import { Button } from "antd";
import { getDoctorName } from "./functions";
import styles from './voiceBot.module.css';
import classNames from "classnames";
import { isNotNullOrEmpty } from "../../components/CommonFunctions";


const ChatHistory = (props) => {
  const { conversation, doctorDetails, loader, doctorAction, bookAppointmentHandler, appointmentAction, timeSlots, generateDatesForOneWeek, appointmentList, rescheduleAppointmentHandler, recentActivity, appointmentCancelHandler } = props;
  const actionClickHandler = (key, value) => {
    if(recentActivity === 'RESCHEDULE_INITIATED') {
      rescheduleAppointmentHandler(key, value);
    } else if(recentActivity === 'CANCEL_INITIATED' ) {
      appointmentCancelHandler(key, value);
    } else {
      bookAppointmentHandler(key, value);
    }
  }

  useEffect(() => {
    const chatContainer = document.getElementById("chat_thread");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className={classNames(styles.chat_thread__wrap)} id="chat_thread">
      {conversation.map((message, index) => (
        <div className={classNames(styles.conversation_container)} key={`chat-key-${index}`}>
          {isNotNullOrEmpty(message.user) && <div className={classNames(styles.message, styles.user_message)}>{message.user}</div>}
          {isNotNullOrEmpty(message.bot) && <div className={classNames(styles.message, styles.bot_message)}>{message.bot}</div>}
          {message?.action === 'SHOW_APPOINTMENT' &&
            appointmentList?.length > 0 && 
              <div className={classNames(styles.appointment_list)}>
                {appointmentList?.filter(d => d?.status === 'confirm')?.map((data, key) => {
                  return (
                    <div key={`appointment-${key}-${data?.appointment_id}`} className={classNames(styles.appointment_item)}>
                      <p>Doctor Name: <span>{getDoctorName(doctorDetails, Number(data?.doctor_id))}</span></p>
                      <p>Date: <span>{data?.date}</span></p>
                      <p>Time: <span>{data?.start_time}-{data?.end_time}</span></p>
                    </div>
                  )
                })}
              </div>
          }
          {(message?.action === 'BOOK_ACTION_CONFIRMATION' || message?.action === 'RESCHEDULE_ACTION_CONFIRMATION' || message?.action === 'CANCEL_ACTION_CONFIRMATION') &&
            <div className={classNames(styles.appointment__details)}>
              <p className="mb-5">Doctor Name: <span>{getDoctorName(doctorDetails, Number(message?.data?.doctor_id))}</span></p>
              <p className="mb-5">Date: <span>{message?.data?.date}</span></p>
              <p>Time: <span>{message?.data?.start_time} - {message?.data?.end_time}</span></p>
            </div>
          }
        </div>
      ))}
      {loader ? <div className={classNames(styles.loader_container)}><div className={classNames(styles.loader)}></div></div> : ''}
      {doctorAction === 'doctor_name' ?
        <div className="flex-column row-gap-10 m-10">
          {doctorDetails?.map((data, key) => {
            return (
              <Button key={`doctor_id-${key}`} size={'small'} onClick={() => actionClickHandler('doctor_id', data?.id)}>{data?.name}</Button>
            )
          })}
        </div>
      : ""}
      {doctorAction === 'doctor_dates' && generateDatesForOneWeek()?.length > 0 ?
        <div className="flex-column row-gap-10 m-10">
          {generateDatesForOneWeek()?.map((data, key) => {
          return (
            <Button key={`date-${key}`} onClick={() => actionClickHandler('date', data)}>{data}</Button>
          )
        })}
        </div>
      :
        ""}
      {doctorAction === 'time_slots' && timeSlots?.length > 0 ?
        <div className="flex-column row-gap-10 m-10">
          {timeSlots?.map((data, key) => {
          return (
            <Button key={`time-${key}`} onClick={() => actionClickHandler('start_time', data)}>{data}</Button>
          )
        })}
        </div>
      :
        ""}
      {doctorAction === 'confirm_appointment' ?
        <div className="flex-row flex-wrap column-gap-10 row-gap-10 m-10 mt-20">
          <Button onClick={() => actionClickHandler('confirm_appointment', 'yes')}>YES</Button>
          <Button onClick={() => actionClickHandler('confirm_appointment', 'no')}>No</Button>
        </div>
      : ""}
      {appointmentList?.length > 0 && (doctorAction === 'reschedule_action' || doctorAction === 'cancel_action') ?
        <div className="flex-column row-gap-10 m-10">
          {appointmentList?.filter(d => d?.status === 'confirm')?.map((data, key) => {
            return (
              <Button key={`appointments-${key}-${data?.appointment_id}`} onClick={() => actionClickHandler('appointment_id', data?.appointment_id)}>{getDoctorName(doctorDetails, Number(data?.doctor_id))}-{data?.date}-{data?.start_time}-{data?.end_time}</Button>
            )
          })}
        </div>
      : ""}
    </div>
  );
};

export default ChatHistory;
