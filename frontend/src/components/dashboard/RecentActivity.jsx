import React from "react";

const RecentActivity = ({ activities }) => {
  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <ul className="activity-list">
        {activities.map((activity, index) => (
          <li key={index} className="activity-item">
            <div className="activity-icon">{activity.icon}</div>
            <div className="activity-content">
              <p className="activity-text">{activity.text}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
