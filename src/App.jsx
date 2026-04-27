import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApartmentProvider } from './context/ApartmentContext';
import Home from './pages/Home';
import CreateApartment from './pages/CreateApartment';
import JoinApartment from './pages/JoinApartment';
import AdminDashboard from './pages/AdminDashboard';
import ResidentDashboard from './pages/ResidentDashboard';
import './App.css';

function App() {
  return (
    <ApartmentProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateApartment />} />
            <Route path="/join" element={<JoinApartment />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/resident" element={<ResidentDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ApartmentProvider>
  );
}

export default App;
