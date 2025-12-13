import React from "react";

const StatsCard = ({ title, value, icon, trend, color = "primary" }) => {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {trend && (
          <span className={`stats-trend ${trend.direction}`}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
