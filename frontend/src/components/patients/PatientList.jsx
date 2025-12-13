import React from "react";
import { DataTable, Badge, Button, Card } from "../common";
import { formatDate } from "../../utils/helpers";

const PatientList = ({ patients = [], onEdit, onView, onRefresh }) => {
  const columns = [
    {
      header: "Patient ID",
      field: "patient_id",
      render: (row) => (
        <span className="patient-id">{row.patient_id || "N/A"}</span>
      ),
    },
    {
      header: "Full Name",
      field: "full_name",
      render: (row) => (
        <div className="patient-name">
          <strong>{row.full_name}</strong>
        </div>
      ),
    },
    {
      header: "Phone",
      field: "phone",
    },
    {
      header: "Gender",
      field: "gender",
      render: (row) => (
        <Badge variant={row.gender === "male" ? "info" : "primary"}>
          {row.gender
            ? row.gender.charAt(0).toUpperCase() + row.gender.slice(1)
            : "N/A"}
        </Badge>
      ),
    },
    {
      header: "Age",
      render: (row) => {
        if (!row.date_of_birth) return "N/A";
        const dob = new Date(row.date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }
        return `${age} years`;
      },
    },
    {
      header: "Blood Group",
      field: "blood_group",
      render: (row) => row.blood_group || "Not specified",
    },
    {
      header: "Registered",
      field: "created_at",
      render: (row) => (
        <span className="date-text">
          {row.created_at ? formatDate(row.created_at) : "N/A"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="action-buttons">
          {onView && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => onView(row)}
            >
              View
            </Button>
          )}
          {onEdit && (
            <Button variant="primary" size="small" onClick={() => onEdit(row)}>
              Edit
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (!patients || patients.length === 0) {
    return (
      <Card className="empty-state">
        <div className="empty-content">
          <span className="empty-icon">👥</span>
          <h3>No Patients Found</h3>
          <p>
            {patients?.length === 0
              ? "No patients registered yet. Click 'Add New Patient' to get started."
              : "Try adjusting your search criteria."}
          </p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="secondary">
              Refresh List
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="patient-list">
      <Card>
        <div className="list-header">
          <h3>
            {patients.length} Patient{patients.length !== 1 ? "s" : ""}
          </h3>
          {onRefresh && (
            <Button onClick={onRefresh} variant="secondary" size="small">
              🔄 Refresh
            </Button>
          )}
        </div>
        <DataTable columns={columns} data={patients} />
      </Card>
    </div>
  );
};

export default PatientList;
