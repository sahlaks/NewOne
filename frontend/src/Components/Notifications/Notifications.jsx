import { useNotification } from "../../Context/NotificationContext";

const NotificationList = () => {
    const { notifications, markAsRead } = useNotification();
  
    return (
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
      
            <div
            key={notification._id}
            className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            onClick={() => markAsRead(notification._id)} 
            >
              <p>
                {notification.type === "message"
                  ? `${notification.content}`
                  : `Appointment Update: ${notification.content.status}`}
              </p>
              <span>{new Date(notification.timestamp).toLocaleTimeString()}</span>
            </div>
          ))
        ) : (
          <div>No notifications</div>
        )}
      </div>
    );
  };
  export default NotificationList;