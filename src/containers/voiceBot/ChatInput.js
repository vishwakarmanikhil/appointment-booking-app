import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styles from './voiceBot.module.css';
import classNames from "classnames";
import { Input, Button } from "antd";
import { AudioOutlined, SendOutlined, StopOutlined, SyncOutlined } from "@ant-design/icons";
import { isNotNullOrEmpty } from "../../components/CommonFunctions";

const ChatInput = ({ onSend, resetConversation }) => {
  const [userInput, setUserInput] = useState("");
  const [voiceCommand, setVoiceCommand] = useState(false);
  const { transcript, resetTranscript, listening } = useSpeechRecognition({
    commands: [],
  });

  useEffect(() => {
    if (!listening && transcript.trim() !== "") {
      setVoiceCommand(true);
      handleSpeechResult(transcript);
    }
  }, [listening, transcript]);

  useEffect(() => {
    if(isNotNullOrEmpty(userInput) && voiceCommand) {
      handleSend();
      setVoiceCommand(false);
    }
  }, [userInput]);

  const handleSpeechResult = (result) => {
    setUserInput(result);
  };

  const handleSend = () => {
    if (userInput.trim() !== "") {
      onSend(userInput);
      setUserInput("");
    }
  };

  const resetHandler = () => {
    resetTranscript();
    resetConversation();
  }

  return (
    <div className={classNames('flex-column w-100', styles.input__wrapper)}>
      <div className={`${styles.loading__animation} ${listening ? styles.loading__animation_active : ''}`}></div>
      <Input.TextArea
        rows={3}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Click on Audio button for voice writing OR type and send your response"
        className={classNames(styles.input__style)}
      />
      <div className={classNames('flex-row flex-align-center flex-space-between column-gap-10 p-10')}>
        <div className={classNames('flex-row column-gap-10')}>
          <Button onClick={listening ? SpeechRecognition.stopListening : SpeechRecognition.startListening} title={listening ? "Click to stop listening" : "Click to start listening"}>
            {listening ? <StopOutlined /> : <AudioOutlined />}
          </Button>
          <Button onClick={() => resetHandler()} title="Reset conversation"><SyncOutlined /></Button>
        </div>
        <Button onClick={handleSend} type={'primary'} title="Send message"><SendOutlined /></Button>
      </div>
    </div>
  );
};

export default ChatInput;