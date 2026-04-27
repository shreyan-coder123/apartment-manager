import { useState } from 'react';
import { useApartment } from '../context/ApartmentContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const CreateApartment = () => {
  const [name, setName] = useState('');
  const [numUnits, setNumUnits] = useState('');
  const [error, setError] = useState('');
  const [createdApt, setCreatedApt] = useState(null);
  const { createApartment, apartments, users } = useApartment();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !numUnits) {
      setError('Please fill in all fields');
      return;
    }
    if (isNaN(numUnits) || parseInt(numUnits) <= 0) {
      setError('Number of units must be a positive number');
      return;
    }
    const apt = createApartment(name, parseInt(numUnits));
    setCreatedApt(apt);
  };

  const handleGoToDashboard = () => {
    navigate('/admin');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdApt.roomCode);
  };

  const handleExport = () => {
    const data = {
      type: 'apartmentData',
      apartment: createdApt,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apartment-${createdApt.roomCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const qrData = JSON.stringify({
    type: 'apartment',
    roomCode: createdApt?.roomCode,
    name: createdApt?.name
  });

  if (createdApt) {
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
            <p className="text-gray-600 mb-4 text-sm">To join from another device, share the code/QR or export data</p>
            
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm mb-1">Room Code</p>
              <p className="text-3xl font-bold text-white tracking-widest">{createdApt.roomCode}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-4 inline-block">
              <QRCodeSVG value={qrData} size={120} />
              <p className="text-gray-500 text-xs mt-1">QR Scanner</p>
            </div>

            <button
              onClick={handleExport}
              className="w-full mb-3 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3v-1m8-9l-4 4m0 0l4 4m-4-4v12" />
              </svg>
              Export Data (for another device)
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleCopyCode}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>

              <motion.button
                onClick={handleGoToDashboard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl transition-all shadow-lg"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Sunset Apartments"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Number of Units</label>
              <input
                type="number"
                value={numUnits}
                onChange={(e) => setNumUnits(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Apartment
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateApartment;