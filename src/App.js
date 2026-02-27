import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import Inventory from './pages/Inventory';
import CostSheets from './pages/CostSheets';
import BookingForms from './pages/BookingForms';
import ReraDetails from './pages/ReraDetails';
import TermsConditions from './pages/TermsConditions';
import Analytics from './pages/Analytics';
import DemandLetter from './pages/DemandLetter';
import ChannelPartners from './pages/ChannelPartners';
import Calculator from './pages/Calculator';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ManageCategories from './pages/categories/ManageCategories';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ManageProperties from './pages/ManageProperties';
import ManageFAQ from './pages/ManageFAQ';
import ProjectManagement from './pages/ProjectManagement';
import AdminSettings from './pages/AdminSettings';

// ── Protected Route wrapper ───────────────────────────────────
// Agar user logged in hai → Layout ke saath page dikhao
// Agar nahi hai → Login pe bhejo, sidebar nahi dikhega
const Protected = ({ children }) => {
  const { user } = useAuth();
  return user
    ? <Layout>{children}</Layout>
    : <Navigate to="/login" replace />;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <Routes>
      {/* ── PUBLIC — Login page, NO Layout/sidebar ── */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* ── PROTECTED — Sidebar + Layout sab ko milega ── */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            {user?.role === 'admin' ? <AdminDashboard /> : <SalesDashboard />}
          </Protected>
        }
      />

      <Route path="/projects"           element={<Protected><ProjectManagement /></Protected>} />
      <Route path="/manage-properties"  element={<Protected><ManageProperties /></Protected>} />
      <Route path="/manage-categories"  element={<Protected><ManageCategories /></Protected>} />
      <Route path="/inventory"          element={<Protected><Inventory /></Protected>} />
      <Route path="/cost-sheets"        element={<Protected><CostSheets /></Protected>} />
      <Route path="/booking-forms"      element={<Protected><BookingForms /></Protected>} />
      <Route path="/rera-details"       element={<Protected><ReraDetails /></Protected>} />
      <Route path="/terms-conditions"   element={<Protected><TermsConditions /></Protected>} />
      <Route path="/privacy-policy"     element={<Protected><PrivacyPolicy /></Protected>} />
      <Route path="/data-analysis"      element={<Protected><Analytics /></Protected>} />
      <Route path="/calculator"         element={<Protected><Calculator /></Protected>} />
      <Route path="/demand-letters"     element={<Protected><DemandLetter /></Protected>} />
      <Route path="/channel-partners"   element={<Protected><ChannelPartners /></Protected>} />
      <Route path="/faq"                element={<Protected><ManageFAQ /></Protected>} />
      <Route path="/Costsheet"          element={<Protected><AdminSettings/></Protected>} />
      <Route path="/receipts"           element={<Protected><div>Receipts Page</div></Protected>} />
      <Route path="/recovery"           element={<Protected><div>Recovery Page</div></Protected>} />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;