import {BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignInPage from "./SignInPage";
import RegisterPage from "./RegisterPage";
import DashboardPage from "./DashboardPage";
import OptimizePage from "./OptimizePage";
import ResultsPage from "./ResultsPage";
import AuditTrailPage from "./AuditTrailPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/optimize" element={<PrivateRoute><OptimizePage /></PrivateRoute>} />
        <Route path="/results" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
        <Route path="/audit" element={<PrivateRoute><AuditTrailPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;