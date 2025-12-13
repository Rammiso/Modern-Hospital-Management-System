import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";
import DoctorDashboard from "./DoctorDashboard";
import LabDashboard from "./LabDashboard";
import PharmacyDashboard from "./PharmacyDashboard";
import CashierDashboard from "./CashierDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  // Determine which dashboard to show based on user role
  const getDashboardComponent = () => {
    if (!user || !user.role) {
      return <AdminDashboard />;
    }

    const role = user.role.toLowerCase();

    switch (role) {
      case "admin":
      case "administrator":
        return <AdminDashboard />;
      case "receptionist":
        return <ReceptionistDashboard />;
      case "doctor":
        return <DoctorDashboard />;
      case "lab_technician":
      case "lab":
      case "laboratorist":
        return <LabDashboard />;
      case "pharmacist":
      case "pharmacy":
        return <PharmacyDashboard />;
      case "cashier":
      case "billing":
        return <CashierDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return getDashboardComponent();
};

export default Dashboard;
