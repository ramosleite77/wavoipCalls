import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Footer from './components/Footer';
import VapiTokenPage from './pages/VapiTokenPage';
import ElevenLabTokenPage from './pages/ElevenLabTokenPage';
import WavoipTokenPage from './pages/WavoipTokenPage';
import CallManagementPage from './pages/CallManagementPage';
import SettingsPage from './pages/SettingsPage';
import CurlExecutorPage from './pages/CurlExecutorPage';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    bgcolor: 'background.default',
  }}>
    <Navbar />
    <Box sx={{ 
      flex: 1,
      overflow: 'auto',
      pb: '300px',
      px: { xs: 1, sm: 2, md: 4 },
      maxWidth: { lg: '1200px', xl: '1400px' },
      mx: 'auto',
      width: '100%'
    }}>
      {children}
    </Box>
    <Box sx={{ 
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <Footer />
    </Box>
  </Box>
);

const AppContent: React.FC = () => {
  const { validateToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const isValid = await validateToken();
        if (isValid) {
          if (location.pathname === '/login') {
            navigate('/');
          }
        } else {
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    checkAuth();
  }, [validateToken, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <VapiTokenPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/elevenlab-tokens"
        element={
          <ProtectedRoute>
            <Layout>
              <ElevenLabTokenPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/wavoip-tokens"
        element={
          <ProtectedRoute>
            <Layout>
              <WavoipTokenPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calls"
        element={
          <ProtectedRoute>
            <Layout>
              <CallManagementPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/curl-executor"
        element={
          <ProtectedRoute>
            <Layout>
              <CurlExecutorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App; 