import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
// import PublicProjects from './pages/PublicProjects';
import Inventory from './pages/Inventory';
import CostSheets from './pages/CostSheets';
import BookingForms from './pages/BookingForms';
import ReraDetails from './pages/ReraDetails';
import TermsConditions from './pages/TermsConditions';
import Analytics from './pages/Analytics';
// import Team from './pages/Team';
import DemandLetter from './pages/DemandLetter';
import ChannelPartners from './pages/ChannelPartners';
import Calculator from './pages/Calculator';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ManageCategories from './pages/categories/ManageCategories';

function App() {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Layout><Login /></Layout>} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Layout><Login /></Layout>} />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Layout>
              {user?.role === 'admin' ? <AdminDashboard /> : <SalesDashboard />}
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }  
      />
      <Route path="/inventory" element={user ? <Layout><Inventory /></Layout> : <Navigate to="/login" />} />
      <Route path="/manage-categories" element={user ? <Layout><ManageCategories /></Layout> : <Navigate to="/login" />} />
      <Route path="/cost-sheets" element={user ? <Layout><CostSheets /></Layout> : <Navigate to="/login" />} />
      <Route path="/booking-forms" element={user ? <Layout><BookingForms /></Layout> : <Navigate to="/login" />} />
      <Route path="/rera-details" element={user ? <Layout><ReraDetails /></Layout> : <Navigate to="/login" />} />
      <Route path="/terms-conditions" element={user ? <Layout><TermsConditions /></Layout> : <Navigate to="/login" />} />
      <Route path="/data-analysis" element={user ? <Layout><Analytics /></Layout> : <Navigate to="/login" />} />
      <Route path="/calculator" element={user ? <Layout><Calculator /></Layout> : <Navigate to="/login" />} />
      <Route path="/demand-letters" element={user ? <Layout><DemandLetter /></Layout> : <Navigate to="/login" />} />
      <Route path="/channel-partners" element={user ? <Layout><ChannelPartners /></Layout> : <Navigate to="/login" />} />
      <Route path="/marketing" element={user ? <Layout><div>Marketing Page</div></Layout> : <Navigate to="/login" />} />
      <Route path="/receipts" element={user ? <Layout><div>Receipts Page</div></Layout> : <Navigate to="/login" />} />
      <Route path="/recovery" element={user ? <Layout><div>Recovery Page</div></Layout> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;