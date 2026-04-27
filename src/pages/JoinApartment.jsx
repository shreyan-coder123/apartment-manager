import { useState, useRef } from 'react';
import { useApartment } from '../context/ApartmentContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const JoinApartment = () => {
  const [roomCode, setRoomCode] = useState('');
  const [residentName, setResidentName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinApartment, apartments } = useApartment();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomCode || !residentName) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    
    const code = roomCode.trim().toUpperCase();
    const success = joinApartment(code, residentName.trim());
    setLoading(false);
    
    if (success) {
      navigate('/resident');
    } else {
      setError('Invalid room code. Ask admin for the code.');
    }
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.type === 'apartment' && data.roomCode) {
            setRoomCode(data.roomCode);
            setError('');
          }
        } catch {
          setError('Invalid QR code file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Join an Apartment</h2>
          
          <p className="text-sm text-gray-500 text-center mb-4 bg-yellow-50 p-3 rounded-lg">
            Ask the admin for the room code or QR code from their create page
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest font-mono"
                placeholder="XXXXXX"
                maxLength="6"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={residentName}
                onChange={(e) => {
                  setResidentName(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center text-sm bg-red-50 p-3 rounded-xl"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              disabled={loading || !roomCode || !residentName}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              {loading ? 'Joining...' : 'Join Apartment'}
            </motion.button>
          </form>
          
          {apartments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center mb-2">Codes on this device:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {apartments.map(apt => (
                  <span key={apt.id} className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-mono">
                    {apt.roomCode}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JoinApartment;