// src/VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSocket } from '../../Context/SocketContext';
const roomId = "room1"; // Use a unique room ID for different calls

const VideoCalls = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const socket = useSocket();

    useEffect(() => {
        const initLocalStream = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localVideoRef.current.srcObject = stream;
            socket.emit('join-rooms', roomId);
        };

        initLocalStream();

        socket.on('users-connected', userId => {
            startCall();
        });

        return () => {
            socket.off('users-connected');
        };
    }, []);

    const startCall = () => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        });

        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('ice-candidate', { candidate: event.candidate, room: roomId });
            }
        };

        pc.ontrack = event => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        pc.createOffer()
            .then(offer => {
                pc.setLocalDescription(offer);
                socket.emit('offer', { offer, room: roomId });
            });

        setPeerConnection(pc);
    };

    useEffect(() => {
        socket.on('offer', data => {
            const pc = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            });

            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

            pc.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit('ice-candidate', { candidate: event.candidate, room: roomId });
                }
            };

            pc.ontrack = event => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };

            pc.setRemoteDescription(new RTCSessionDescription(data.offer))
                .then(() => pc.createAnswer())
                .then(answer => {
                    pc.setLocalDescription(answer);
                    socket.emit('answer', { answer, room: roomId });
                });

            setPeerConnection(pc);
        });

        socket.on('answer', data => {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        socket.on('ice-candidate', data => {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        });

        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('ice-candidate');
        };
    }, [localStream, peerConnection]);

    return (
        <div>
            <h1>Video Call</h1>
            <div>
                <video ref={localVideoRef} autoPlay muted style={{ width: '45%', margin: '2%', border: '1px solid black' }} />
                <video ref={remoteVideoRef} autoPlay style={{ width: '45%', margin: '2%', border: '1px solid black' }} />
            </div>
        </div>
    );
};

export default VideoCalls;
