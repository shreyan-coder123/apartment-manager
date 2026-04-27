import { useState, useRef } from 'react';
import { useApartment } from '../context/ApartmentContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { apartments, users, setActiveUser, setActiveApartment, firebaseReady } = useApartment();
  const navigate = useNavigate();
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState('');

  const handleCreateClick = () => navigate('/create');
  const handleJoinClick = () => navigate('/join');

  const handleSwitchUser = (userId) => {
    setActiveUser(userId);
    const user = users.find(u => u.id === userId);
    if (user) {
      setActiveApartment(user.apartmentId);
      navigate(user.role === 'admin' ? '/admin' : '/resident');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg w-full"
      >
        <div className="mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0v5a2 2 0 01-2 2H5m-2 0h6m2 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m0 0h14" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Apartment Manager</h1>
          <p className="text-gray-600">Manage your apartment building</p>
        </div>

        <div className={`mb-4 p-3 rounded-xl text-sm ${firebaseReady ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          {firebaseReady ? '🔥 Firebase Connected - Data syncs across devices!' : '⚠️ Using localStorage only (no sync between devices)'}
        </div>
        
        <div className="space-y-3 mb-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button 
              onClick={handleCreateClick}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Create Apartment
            </button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button 
              onClick={handleJoinClick}
              className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-4 rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300"
            >
              Join Apartment
            </button>
          </motion.div>
        </div>

        {users.length > 0 && (
          <motion.div>
            <button
              onClick={() => setShowUserSwitcher(!showUserSwitcher)}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              {showUserSwitcher ? 'Hide' : 'Show'} existing users
            </button>
            
            <AnimatePresence>
              {showUserSwitcher && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  {apartments.length > 0 && (
                    <div className="p-4 border-b border-gray-100">
                      <select
                        value={selectedApartment || apartments[0]?.id}
                        onChange={(e) => setSelectedApartment(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {apartments.map(apt => (
                          <option key={apt.id} value={apt.id}>{apt.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {users.filter(u => u.apartmentId === (selectedApartment || apartments[0]?.id)).map(user => (
                      <motion.button
                        key={user.id}
                        onClick={() => handleSwitchUser(user.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-400 capitalize">{user.role}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        
        <p className="text-sm text-gray-400 mt-6">
          {firebaseReady ? 'Real-time sync enabled' : 'Local only - add Firebase for multi-device sync'}
        </p>
      </motion.div>
    </div>
  );
};

export default Home;