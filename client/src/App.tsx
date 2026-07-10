import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Compliance from './pages/Compliance';
import Packages from './pages/Packages';
import Contact from './pages/Contact';
import ServiceDetail from './pages/ServiceDetail';
import OurServices from './pages/OurServices';
import PackageDetail from './pages/PackageDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardShell from './pages/dashboard/DashboardShell';
import GetQuote from './pages/GetQuote';
import Audit from './pages/Audit';
import StartupEvaluation from './pages/StartupEvaluation';
import AdminEvaluations from './pages/admin/Evaluations';

function AppContent() {
  const location = useLocation();
  const isDashPage =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/get-quote';

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-services" element={<OurServices />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/evaluation" element={<StartupEvaluation />} />
          <Route path="/admin/evaluations" element={<AdminEvaluations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/get-quote" element={<GetQuote />} />
          <Route path="/dashboard" element={<DashboardShell />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isDashPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}
