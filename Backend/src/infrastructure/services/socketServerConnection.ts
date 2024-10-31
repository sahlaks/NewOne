import { Server } from "socket.io";

 let io: Server;
 let users: { [userId: string]: string } = {}
 let test: { [userId: string]: { socketId: string; role: string } } = {};
 let unreadCounts: { [userId: string]: number } = {};

export const createSocketChatConnection = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "https://calmnestonline.vercel.app/",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });


  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Store connected user
    socket.on("user_connected", (userId: string) => {
      users[userId] = socket.id;
      io.emit("online_users", users);
      console.log(`User ${userId} is connected.`);
    });

    // Joining a room based on sender and receiver IDs
    socket.on("join_room", (data: { senderId: string; receiverId: string }) => {
      const roomId = [data.senderId, data.receiverId].sort().join("_");
      socket.join(roomId); 
      console.log(`User ${data.senderId} joined room: ${roomId}`);
    });

    //send message with notification
    socket.on(
      "send_message",
      (data: {
        senderId: string;
        senderName: string;
        receiverId: string;
        message: string;
      }) => {
        const roomId = [data.senderId, data.receiverId].sort().join("_");
        console.log(
          `Sending message from ${data.senderId} to ${data.receiverId} in room: ${roomId}`
        );

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
      }
    );

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

    socket.on('notification_read', ({ notificationId, count })=>{
      console.log(count);
      
      const userId = Object.keys(users).find(user => users[user] === socket.id);
      console.log(userId);
      
      if (userId) {
        unreadCounts[userId] = count
        io.to(users[userId]).emit('unread_count_update', unreadCounts[userId]);
      }
    })
   
    // //video purpose
    socket.on('video_room',({roomId}) => {
      socket.join(roomId)
      console.log(`User ${socket.id} joined room: ${roomId}`)
    })

    socket.on('signal', (data) => {
      console.log('inside signal', data);
      socket.to(data.roomId).emit("signal", data);
      
    })

   

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

//notifying appointment time
export function sendNotificationToUser(userId: string, message: string) {
  
  if (users[userId]) {
    io.to(users[userId]).emit('notification', {
      message: message,
      timestamp: new Date(),
    });
    console.log(`Notification sent to user ${userId}: ${message}`);
  } else {
    console.log(`User ${userId} is not connected, could not send notification`);
  } 
}
