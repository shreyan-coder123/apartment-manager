import { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode || !residentName) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    
    try {
      const code = roomCode.trim().toUpperCase();
      const success = await joinApartment(code, residentName.trim());
      
      if (success) {
        navigate('/resident');
      } else {
        setError('Invalid room code. Check and try again.');
      }
    } catch (err) {
      setError('Error joining. Try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Join Apartment</h2>
          
          <p className="text-xs text-gray-500 text-center mb-4 bg-yellow-50 p-2 rounded-lg">
            Ask admin for the room code
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest font-mono"
                placeholder="XXXXXX"
                maxLength="6"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Your Name</label>
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
                className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              disabled={loading || !roomCode || !residentName}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              {loading ? 'Joining...' : 'Join Apartment'}
            </motion.button>
          </form>
          
          {apartments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center mb-2">Available codes:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {apartments.map(apt => (
                  <span key={apt.id} className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-mono">
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