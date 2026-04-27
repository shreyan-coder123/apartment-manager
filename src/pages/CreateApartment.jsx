import { useState } from 'react';
import { useApartment } from '../context/ApartmentContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const CreateApartment = () => {
  const [name, setName] = useState('');
  const [numUnits, setNumUnits] = useState('');
  const [error, setError] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { createApartment } = useApartment();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !numUnits) {
      setError('Please fill in all fields');
      return;
    }
    if (isNaN(numUnits) || parseInt(numUnits) <= 0) {
      setError('Number of units must be a positive number');
      return;
    }
    
    setLoading(true);
    try {
      const apt = await createApartment(name, parseInt(numUnits));
      setRoomCode(apt.roomCode);
    } catch (err) {
      setError('Failed to create apartment');
    }
    setLoading(false);
  };

  const handleGoToDashboard = () => {
    navigate('/admin');
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
    }
  };

  const qrData = roomCode ? JSON.stringify({
    type: 'apartment',
    roomCode: roomCode,
    name: name
  }) : '';

  if (roomCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apartment Created!</h2>
            <p className="text-gray-600 mb-4 text-sm">Share this code with residents</p>
            
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm mb-1">Room Code</p>
              <p className="text-3xl font-bold text-white tracking-widest">{roomCode}</p>
            </div>

            {qrData && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-4 inline-block">
                <QRCodeSVG value={qrData} size={120} />
                <p className="text-gray-500 text-xs mt-1">Scan to join</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCopyCode}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors"
              >
                Copy Code
              </button>

              <motion.button
                onClick={handleGoToDashboard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl"
              >
                Dashboard
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Your Apartment</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Apartment Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Sunset Apartments"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Number of Units</label>
              <input
                type="number"
                value={numUnits}
                onChange={(e) => setNumUnits(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                placeholder="e.g., 12"
              />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center text-sm"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              {loading ? 'Creating...' : 'Create Apartment'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateApartment;