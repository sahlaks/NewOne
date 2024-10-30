import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCount] = useState(0);
  const socket = useSocket();

  useEffect(()=>{
    if (!socket) return;
    
    socket.on('notification', (notification) => {
      showNotificationPopup(notification)
      setUnreadCount(prevCount => prevCount + 1)
    });

    socket.on("message_notification", (data) => {
      showNotificationPopup(`You have new message from ${data.senderName}`);
    })

    socket.on('unread_count_update', (newUnreadCount) => {
      setUnreadCount(newUnreadCount);
    });

    return () => socket.off("message_notification"), socket.off('notification'),  socket.off('unread_count_update');

  },[socket])


  const showNotificationPopup = (message) => {
    setCurrentNotification(message);

    setTimeout(() => {
      setCurrentNotification(null);
    }, 5000);
  }

  const markAsReads = (notificationId,count) => {
    setUnreadCount(Math.max(count - 1, 0));
    console.log(unreadCounts,'contexttttt');
    
    socket.emit('notification_read', { notificationId,unreadCounts });
  };

  return (
    <NotificationContext.Provider value={{ showNotificationPopup, unreadCounts, markAsReads}}>
      {children}
      {currentNotification && (
        <div style={styles.notificationPopup}>
          {currentNotification}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

const styles = {
  notificationPopup: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: '#323232',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  }
};