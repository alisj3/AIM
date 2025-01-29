import "./Notification.css";

export function Notification({ icon, children }) {
  return (
    <div className="notification-container">
      <img src={icon} alt="Notification Icon" className="notification-icon" />
      <p className="notification-text">{children}</p>
    </div>
  );
}
