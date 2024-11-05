"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSocketChatConnection = void 0;
exports.sendNotificationToUser = sendNotificationToUser;
const socket_io_1 = require("socket.io");
let io;
let users = {};
let test = {};
let unreadCounts = {};
const createSocketChatConnection = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "https://new-one-pi.vercel.app/",
            credentials: true,
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        // Store connected user
        socket.on("user_connected", (userId) => {
            users[userId] = socket.id;
            io.emit("online_users", users);
            console.log(`User ${userId} is connected.`);
        });
        // Joining a room based on sender and receiver IDs
        socket.on("join_room", (data) => {
            const roomId = [data.senderId, data.receiverId].sort().join("_");
            socket.join(roomId);
            console.log(`User ${data.senderId} joined room: ${roomId}`);
        });
        //send message with notification
        socket.on("send_message", (data) => {
            const roomId = [data.senderId, data.receiverId].sort().join("_");
            console.log(`Sending message from ${data.senderId} to ${data.receiverId} in room: ${roomId}`);
            io.to(roomId).emit("receive_message", {
                senderId: data.senderId,
                senderName: data.senderName,
                message: data.message,
                createdAt: new Date(),
            });
            if (users[data.receiverId]) {
                io.to(users[data.receiverId]).emit("message_notification", {
                    senderId: data.senderId,
                    senderName: data.senderName,
                    message: data.message,
                    createdAt: new Date(),
                });
            }
        });
        socket.on("newDoctorChat", ({ doctorId }) => {
            io.emit("updateChatList", {
                doctorId: doctorId,
            });
        });
        //typing event
        socket.on("typing", ({ senderId, receiverId }) => {
            if (users[receiverId]) {
                socket.to(users[receiverId]).emit("typing", { senderId });
            }
        });
        // stop typing event
        socket.on("stop_typing", ({ senderId, receiverId }) => {
            if (users[receiverId]) {
                socket.to(users[receiverId]).emit("stop_typing", { senderId });
            }
        });
        socket.on('notification_read', ({ notificationId, count }) => {
            console.log(count);
            const userId = Object.keys(users).find(user => users[user] === socket.id);
            console.log(userId);
            if (userId) {
                unreadCounts[userId] = count;
                io.to(users[userId]).emit('unread_count_update', unreadCounts[userId]);
            }
        });
        // //video purpose
        socket.on('video_room', ({ roomId }) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
        });
        socket.on('signal', (data) => {
            console.log('inside signal', data);
            socket.to(data.roomId).emit("signal", data);
        });
        // Handle your socket events here
        socket.on("disconnect", () => {
            for (const userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    break;
                }
            }
            io.emit("online_users", users);
            console.log("User disconnected:", socket.id);
        });
    });
};
exports.createSocketChatConnection = createSocketChatConnection;
//notifying appointment time
function sendNotificationToUser(userId, message) {
    if (users[userId]) {
        io.to(users[userId]).emit('notification', {
            message: message,
            timestamp: new Date(),
        });
        console.log(`Notification sent to user ${userId}: ${message}`);
    }
    else {
        console.log(`User ${userId} is not connected, could not send notification`);
    }
}
