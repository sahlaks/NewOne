// import React, { useEffect, useRef, useState } from 'react';
// import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
// import { useSocket } from '../../Context/SocketContext';
// import CustomPopup from '../CustomPopUp/CustomPopup';
// import ParentFeedbackModal from '../Review/ReviewAndRating';
// import { updateToComplete } from '../../Services/API/DoctorAPI';
// import { submitReview } from '../../utils/parentFunctions';
// import { toast } from 'react-toastify';

// const VideoCall = ({ onEndCall, user, appointment}) => {
//     const [micMuted, setMicMuted] = useState(false);
//     const [videoMuted, setVideoMuted] = useState(false);
//     const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
//     const [isParentModalOpen, setIsParentModalOpen] = useState(false); 
//     const socket = useSocket();
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);
//     const peerRef = useRef(null);
//     const localStreamRef = useRef(null);
//     const iceCandidatesQueue = useRef([]);
//     let remoteAnswerProcessed = false;
//     useEffect(() => {
//         const iceServers = {
//             iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//         };
//         const initializeMedia = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//                 localStreamRef.current = stream;
//                 localVideoRef.current.srcObject = stream;

//                 // Create new peer connection
//                 peerRef.current = new RTCPeerConnection(iceServers);

//                 // Add local stream tracks to peer connection
//                 stream.getTracks().forEach((track) => peerRef.current.addTrack(track, stream));

//                 // Remote stream setup
//                 peerRef.current.ontrack = (event) => {
//                     if (event.streams && event.streams[0]) 
//                         remoteVideoRef.current.srcObject = event.streams[0];
//                 };

//                 // ICE candidate handling
//                 peerRef.current.onicecandidate = (event) => {
//                     if (event.candidate) {
//                         socket.emit('signal', { signal: { candidate: event.candidate }, roomId: user.id });
//                     }
//                 };

//                 // Signal that user is joining the room
//                 socket.emit('video_room', { roomId: user.id });

//                 // Handle renegotiation for offer/answer exchange
//                 peerRef.current.onnegotiationneeded = async () => {
//                     if (user.isInitiator) {
//                         const offer = await peerRef.current.createOffer();
//                         await peerRef.current.setLocalDescription(offer);
//                         socket.emit('signal', { signal: { offer }, roomId: user.id });
//                     }
//                 };

                
//                 // Listen for incoming signaling messages
//                 socket.on('signal', async (data) => {
//                     if (data.signal) {
//                         if (data.signal.offer && !user.isInitiator ) {
//                             await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.signal.offer));
//                             const answer = await peerRef.current.createAnswer();
//                             await peerRef.current.setLocalDescription(answer);
//                             socket.emit('signal', { signal: { answer }, roomId: user.id });

//                             // Process queued ICE candidates
//                             processIceCandidatesQueue();
//                         } else if (data.signal.answer && user.isInitiator && !remoteAnswerProcessed) {
//                             remoteAnswerProcessed = true
//                             await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.signal.answer));

//                             // Process queued ICE candidates
//                             processIceCandidatesQueue();
//                         } else if (data.signal.candidate) {
//                             if (peerRef.current.remoteDescription) {
//                                 await peerRef.current.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
//                             } else {
//                                 iceCandidatesQueue.current.push(data.signal.candidate);
//                             }
//                         }
//                     }
//                 });

//                 // Initialize stream settings based on muted states
//                 toggleAudioStream(!micMuted);
//                 toggleVideoStream(!videoMuted);
//             } catch (error) {
//                 console.error('Error accessing media devices:', error);
//             }
//         };

//         initializeMedia();

//         return () => {
//             socket.off('signal');
//             if (peerRef.current) peerRef.current.close();
//         };
//     }, [user.id, micMuted, videoMuted, socket]);

//     const processIceCandidatesQueue = async () => {
//         for (const candidate of iceCandidatesQueue.current) {
//             await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//         }
//         iceCandidatesQueue.current = [];
//     };

//     const toggleAudioStream = (enabled) => {
//         if (localStreamRef.current) {
//             const audioTrack = localStreamRef.current.getAudioTracks()[0];
//             if (audioTrack) audioTrack.enabled = enabled;
//         }
//     };

//     const toggleVideoStream = (enabled) => {
//         if (localStreamRef.current) {
//             const videoTrack = localStreamRef.current.getVideoTracks()[0];
//             if (videoTrack) videoTrack.enabled = enabled;
//         }
//     };


//     const handleMicToggle = () => {
//         setMicMuted((prev) => {
//             const newMicMutedState = !prev;
//             toggleAudioStream(!newMicMutedState);
//             return newMicMutedState;
//         });
//     };

//     const handleVideoToggle = () => {
//         // setVideoMuted((prev) => {
//         //     const newVideoMutedState = !prev;
//         //     toggleVideoStream(!newVideoMutedState);
//         //     return newVideoMutedState;
//         // });
//     };

//     const handleEndCall = () => {
//         console.log('inside function..');
        
//         if(user.isInitiator){
//             setIsDoctorModalOpen(true)
//             console.log('Doctor modal should open');
//         } else{
//             setIsParentModalOpen(true)
//             console.log('set ');
            
//         }
//     }

//     const handleParentSubmitFeedback = async (feedback) => {
//         const res = await submitReview(feedback,appointment.doctorId,appointment.parentName)
//         if(res.success)
//             toast.success(res.message)
//         console.log('Feedback submitted:', feedback);
//         cleanupAndEndCall()
//     }

//     const confirmCompleted = async () => {
//             await updateToComplete(user.id)
//             console.log('Doctor confirmed the session ended.');
//             cleanupAndEndCall()
//     }

    
//     const cleanupAndEndCall = () => {
//         if (localStreamRef.current) {
//             localStreamRef.current.getTracks().forEach((track) => track.stop());
//         }
//         if (peerRef.current) {
//             peerRef.current.onicecandidate = null;
//             peerRef.current.ontrack = null;
//             peerRef.current.close(); 
//             peerRef.current = null;
//         }
    
//         socket.off('signal');
//          window.location.reload();
//         onEndCall();
//     }

    
//     return (
//         <>
//             <div className="fixed inset-0 bg-black opacity-50 " />

//             <div
//                 className="fixed inset-0 z-60 bg-gray-900 text-white flex flex-col justify-between"
//                 style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
//             >
//                 <div className="flex flex-col items-center justify-center w-full h-full">
//                     <h1 className="text-2xl mb-2">Video Call with {user.name}</h1>

//                     <div className="flex w-full h-[80%] justify-around">
//                         <div className="w-1/2 p-4">
//                             <video ref={localVideoRef} autoPlay muted={micMuted} className="w-full h-full bg-gray-800 rounded-lg" />
//                             <p className="text-center mt-2">You</p>
//                         </div>

//                         <div className="w-1/2 p-4">
//                             <video ref={remoteVideoRef} autoPlay className="w-full h-full bg-gray-800 rounded-lg" />
//                             <p className="text-center mt-2">{user.name}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex space-x-6 mb-4 justify-center">
//                     <button
//                         onClick={handleMicToggle}
//                         className={`p-4 rounded-full ${micMuted ? 'bg-red-500' : 'bg-gray-700'} hover:bg-red-600 text-white`}
//                     >
//                         {micMuted ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
//                     </button>

//                     <button
//                         onClick={handleVideoToggle}
//                         className={`p-4 rounded-full ${videoMuted ? 'bg-red-500' : 'bg-gray-700'} hover:bg-red-600 text-white`}
//                     >
//                         {videoMuted ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
//                     </button>

//                     <button onClick={handleEndCall} className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white">
//                         <FaPhoneSlash size={24} />
//                     </button>
//                 </div>
//             </div>

//             {isDoctorModalOpen && (
//             <CustomPopup
//             title="Video session ended?"
//             message="Did the session complete successfully?"
//             onConfirm={confirmCompleted}
//             onCancel={() => setIsDoctorModalOpen(false)}
//             />
//             )}

//             <ParentFeedbackModal
//                 isOpen={isParentModalOpen}
//                 onClose={() => setIsParentModalOpen(false)}
//                 onSubmit={handleParentSubmitFeedback}
//             />
//         </>
//     );
// };

// export default VideoCall;


import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';
import { useSocket } from '../../Context/SocketContext';
import CustomPopup from '../CustomPopUp/CustomPopup';
import ParentFeedbackModal from '../Review/ReviewAndRating';
import { updateToComplete } from '../../Services/API/DoctorAPI';
import { submitReview } from '../../utils/parentFunctions';
import { toast } from 'react-toastify';

const VideoCall = ({ onEndCall, user, appointment }) => {
    const [micMuted, setMicMuted] = useState(false);
    const [videoMuted, setVideoMuted] = useState(false);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [isParentModalOpen, setIsParentModalOpen] = useState(false);
    const socket = useSocket();
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const iceCandidatesQueue = useRef([]);
    let remoteAnswerProcessed = false;

    useEffect(() => {
        const iceServers = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        };

        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localStreamRef.current = stream;
                localVideoRef.current.srcObject = stream;

                // Create new peer connection
                peerRef.current = new RTCPeerConnection(iceServers);

                // Add local stream tracks to peer connection
                stream.getTracks().forEach((track) => peerRef.current.addTrack(track, stream));

                // Remote stream setup
                peerRef.current.ontrack = (event) => {
                    if (event.streams && event.streams[0])
                        remoteVideoRef.current.srcObject = event.streams[0];
                };

                // ICE candidate handling
                peerRef.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit('signal', { signal: { candidate: event.candidate }, roomId: user.id });
                    }
                };

                // Signal that user is joining the room
                socket.emit('video_room', { roomId: user.id });

                // Handle renegotiation for offer/answer exchange
                peerRef.current.onnegotiationneeded = async () => {
                    if (user.isInitiator) {
                        const offer = await peerRef.current.createOffer();
                        await peerRef.current.setLocalDescription(offer);
                        socket.emit('signal', { signal: { offer }, roomId: user.id });
                    }
                };

                // Listen for incoming signaling messages
                socket.on('signal', async (data) => {
                    if (data.signal) {
                        if (data.signal.offer && !user.isInitiator) {
                            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.signal.offer));
                            const answer = await peerRef.current.createAnswer();
                            await peerRef.current.setLocalDescription(answer);
                            socket.emit('signal', { signal: { answer }, roomId: user.id });

                            // Process queued ICE candidates
                            processIceCandidatesQueue();
                        } else if (data.signal.answer && user.isInitiator && !remoteAnswerProcessed) {
                            remoteAnswerProcessed = true;
                            await peerRef.current.setRemoteDescription(new RTCSessionDescription(data.signal.answer));

                            // Process queued ICE candidates
                            processIceCandidatesQueue();
                        } else if (data.signal.candidate) {
                            if (peerRef.current.remoteDescription) {
                                await peerRef.current.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
                            } else {
                                iceCandidatesQueue.current.push(data.signal.candidate);
                            }
                        }
                    }
                });

                // Initialize stream settings based on muted states
                toggleAudioStream(!micMuted);
                toggleVideoStream(!videoMuted);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        initializeMedia();

        return () => {
            socket.off('signal');
            if (peerRef.current) peerRef.current.close();
        };
    }, [user.id, micMuted, videoMuted, socket]);

    const processIceCandidatesQueue = async () => {
        for (const candidate of iceCandidatesQueue.current) {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
        iceCandidatesQueue.current = [];
    };

    const toggleAudioStream = (enabled) => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) audioTrack.enabled = enabled;
        }
    };

    const toggleVideoStream = (enabled) => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) videoTrack.enabled = enabled;
        }
    };

    const handleMicToggle = () => {
        setMicMuted((prev) => {
            const newMicMutedState = !prev;
            toggleAudioStream(!newMicMutedState);
            return newMicMutedState;
        });
    };

    const handleVideoToggle = () => {
        setVideoMuted((prev) => {
            const newVideoMutedState = !prev;
            toggleVideoStream(!newVideoMutedState);
            return newVideoMutedState;
        });
    };

    const handleEndCall = () => {
        if (user.isInitiator) {
            setIsDoctorModalOpen(true);
        } else {
            setIsParentModalOpen(true);
        }
    };

    const handleParentSubmitFeedback = async (feedback) => {
        const res = await submitReview(feedback, appointment.doctorId, appointment.parentName);
        if (res.success) toast.success(res.message);
        cleanupAndEndCall();
    };

    const confirmCompleted = async () => {
        await updateToComplete(user.id);
        cleanupAndEndCall();
    };

    const cleanupAndEndCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (peerRef.current) {
            peerRef.current.onicecandidate = null;
            peerRef.current.ontrack = null;
            peerRef.current.close();
            peerRef.current = null;
        }

        socket.off('signal');
        onEndCall();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black opacity-50" />

            <div className="fixed inset-0 z-60 bg-gray-900 text-white flex flex-col justify-between">
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <h1 className="text-2xl mb-2">Video Call with {user.name}</h1>

                    <div className="flex w-full h-[80%] justify-around">
                        <div className="w-1/2 p-4">
                            <video ref={localVideoRef} autoPlay muted className="w-full h-full bg-gray-800 rounded-lg" />
                            <p className="text-center mt-2">You</p>
                        </div>

                        <div className="w-1/2 p-4">
                            <video ref={remoteVideoRef} autoPlay className="w-full h-full bg-gray-800 rounded-lg" />
                            <p className="text-center mt-2">{user.name}</p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-6 mb-4 justify-center">
                    <button
                        onClick={handleMicToggle}
                        className={`p-4 rounded-full ${micMuted ? 'bg-red-500' : 'bg-gray-700'} hover:bg-red-600 text-white`}
                    >
                        {micMuted ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
                    </button>

                    <button
                        onClick={handleVideoToggle}
                        className={`p-4 rounded-full ${videoMuted ? 'bg-red-500' : 'bg-gray-700'} hover:bg-red-600 text-white`}
                    >
                        {videoMuted ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
                    </button>

                    <button onClick={handleEndCall} className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white">
                        <FaPhoneSlash size={24} />
                    </button>
                </div>
            </div>

            {isDoctorModalOpen && (
                <CustomPopup
                    title="Video session ended?"
                    message="Did the session complete successfully?"
                    onConfirm={confirmCompleted}
                    onCancel={() => setIsDoctorModalOpen(false)}
                />
            )}

            <ParentFeedbackModal
                isOpen={isParentModalOpen}
                onClose={() => setIsParentModalOpen(false)}
                onSubmit={handleParentSubmitFeedback}
            />
        </>
    );
};

export default VideoCall;

