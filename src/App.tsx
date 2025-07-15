import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Container, Box } from '@mui/material';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PatientSearch from './components/Patient/PatientSearch';
import PatientDetails from './components/Patient/PatientDetails';
import LoadingSpinner from './components/Common/LoadingSpinner';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Initializing application..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientSearch />} />
          <Route path="/patient/:patientId" element={<PatientDetails />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
