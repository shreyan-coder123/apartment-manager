import { useApartment } from '../context/ApartmentContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { generateInsights } from '../utils/aiInsights';

const ResidentDashboard = () => {
  const {
    activeApartment,
    activeUser,
    getResidentBills,
    getAnnouncements,
    getPersonalMessages,
    updateBillStatus
  } = useApartment();

  const [insights, setInsights] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const bills = getResidentBills(activeUser?.id);
  const announcements = getAnnouncements(activeApartment?.id);
  const messages = getPersonalMessages(activeUser?.id);

  useEffect(() => {
    if (bills.length > 0) {
      setInsights(generateInsights(bills, messages));
    }
  }, [bills, messages]);

  const handlePayBill = (billId) => {
    updateBillStatus(billId, 'paid');
    setSelectedBill(null);
  };

  if (!activeApartment || !activeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeApartment.name}
              <span className="text-gray-400 font-normal ml-2">Resident Dashboard</span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Logged in as: <span className="font-medium">{activeUser.name}</span></span>
              <Link 
                to="/" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Switch User
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">My Bills</h2>
            </div>
            <div className="p-4">
              {bills.length > 0 ? (
                bills.map((bill) => (
                  <motion.div 
                    key={bill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-4 p-5 border border-gray-100 rounded-xl"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {bill.type.charAt(0).toUpperCase() + bill.type.slice(1)}
                        </h3>
                        <p className="text-gray-500 mt-1">Amount: <span className="font-medium text-gray-700">${bill.amount.toFixed(2)}</span></p>
                        <p className="text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                        <p className="mt-2">
                          Status: {bill.status === 'paid' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                              Unpaid
                            </span>
                          )}
                        </p>
                      </div>
                      {bill.status === 'unpaid' && (
                        <motion.button
                          onClick={() => setSelectedBill(bill)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-xl transition-colors shadow-md"
                        >
                          Pay Bill
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">No bills found</p>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Communications</h2>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Announcements
                </h3>
                {announcements.length > 0 ? (
                  announcements.slice(0, 5).map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-50 rounded-xl mb-3"
                    >
                      <p className="text-gray-700">{msg.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-400">No announcements</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Messages
                </h3>
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border-l-4 border-purple-500 bg-purple-50 rounded-xl mb-3"
                    >
                      <p className="text-gray-800">{msg.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {msg.senderId === activeUser?.id ? 'You' : 'Admin'} • {new Date(msg.timestamp).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-400">No messages</p>
                )}
              </div>
            </div>
          </motion.section>

          {insights.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden col-span-1 lg:col-span-2"
            >
              <div className="px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Insights</h2>
              </div>
              <div className="px-6 pb-6 space-y-3">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl"
                  >
                    <span className="text-2xl">
                      {insight.type === 'warning' && '⚠️'}
                      {insight.type === 'error' && '🚨'}
                      {insight.type === 'success' && '✅'}
                      {insight.type === 'info' && 'ℹ️'}
                    </span>
                    <p className="text-white font-medium">{insight.message}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      {selectedBill && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBill(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Pay {selectedBill.type.charAt(0).toUpperCase() + selectedBill.type.slice(1)} Bill
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-6">${selectedBill.amount.toFixed(2)}</p>
            
            {activeApartment?.paymentNumber && (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Payment Number</p>
                <p className="font-medium text-gray-800">{activeApartment.paymentNumber}</p>
              </div>
            )}
            
            {activeApartment?.paymentQrCode && (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-500 mb-2">Scan to Pay</p>
                <img 
                  src={activeApartment.paymentQrCode} 
                  alt="Payment QR Code" 
                  className="w-40 h-40 mx-auto object-contain"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBill(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayBill(selectedBill.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Mark as Paid
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ResidentDashboard;