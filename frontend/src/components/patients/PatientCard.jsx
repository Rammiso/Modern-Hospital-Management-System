import React from "react";

const PatientCard = ({ patient }) => {
  return (
    <div className="patient-card">
      <div className="patient-card-header">
        <h3>
          {patient.firstName} {patient.lastName}
        </h3>
        <span className="patient-id">ID: {patient.id}</span>
      </div>
      <div className="patient-card-body">
        <div className="patient-info">
          <span className="label">Email:</span>
          <span className="value">{patient.email}</span>
        </div>
        <div className="patient-info">
          <span className="label">Phone:</span>
          <span className="value">{patient.phone}</span>
        </div>
        <div className="patient-info">
          <span className="label">DOB:</span>
          <span className="value">{patient.dateOfBirth}</span>
        </div>
        <div className="patient-info">
          <span className="label">Gender:</span>
          <span className="value">{patient.gender}</span>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
