import React, { useState, useEffect } from "react";
import VideoCall from "./VideoCall";

const VideoCallModal = ({ isOpen, onClose, user, appointment }) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [inCall, setInCall] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState("");
  
  useEffect(() => {
    const checkMeetingTime = () => {
      const now = new Date();
      const date = "Thu Oct 31 2024"
      const startTime = "17:00"
      if (!appointment.startTime) {
        console.error("Meeting time is not set");
        return;
      }

      const meetingDateObj = new Date(`${date} ${startTime}`);
      console.log('obj',meetingDateObj);

      const oneHourLater = new Date(meetingDateObj.getTime() + 60 * 60 * 1000);
      const isSameDay = now.toDateString() === meetingDateObj.toDateString();
      if (!isSameDay) {
        setMeetingStatus("differentDay");
        setTimeRemaining("This meeting was not scheduled for today..");
        return;
      }
      
      const timeDiff = meetingDateObj.getTime() - now.getTime();
      console.log("Time difference (ms):", timeDiff);

      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      console.log("Minutes difference:", minutesDiff);

      
      if (now <  meetingDateObj) {
        setMeetingStatus("before");
        const hoursRemaining = Math.floor(minutesDiff / 60);
        const minutesRemaining = minutesDiff % 60;
        setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m`);
      } else if (now >= meetingDateObj && now <= oneHourLater) {
        setMeetingStatus("within")
        setTimeRemaining("");
      } else {
        setMeetingStatus("after");
        setTimeRemaining("Meeting Over");
      }
    };

    const timer = setInterval(checkMeetingTime, 60000);
    checkMeetingTime();

    return () => clearInterval(timer);
  }, [appointment.startTime]);

  const handleJoin = () => {
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-800 text-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-8">
          {!inCall ? (
            <>
              <h1 className="text-3xl font-bold text-center mb-4">
                {user.name}
              </h1>
              <div className="text-center mb-4">
                {meetingStatus === "before" && (
                  <>
                    <p className="text-sm text-gray-400 mb-2">
                      The meeting will start in {timeRemaining}
                    </p>
                    <p className="text-sm text-gray-400">
                      Join the call when it starts
                    </p>
                  </>
                )}

                {meetingStatus === "within" && (
                  <button
                    onClick={handleJoin}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Join Video Call
                  </button>
                )}

                {meetingStatus === "after" && (
                  <p className="text-sm text-red-500">{timeRemaining}</p>
                )}

                {meetingStatus === "differentDay" && (
                  <p className="text-sm text-gray-400">{timeRemaining}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-full text-gray-300 border border-gray-400 hover:bg-gray-700 transition-colors duration-300 py-2 rounded"
              >
                Close
              </button>
            </>
          ) : (
          <VideoCall onEndCall={handleEndCall} user={user} appointment={appointment}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
