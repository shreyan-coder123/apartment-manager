import { useApartment } from '../context/ApartmentContext';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const {
    activeApartment,
    activeUser,
    getApartmentUsers,
    getAnnouncements,
    addMessage,
    addBill,
    bills,
    updatePaymentDetails
  } = useApartment();

  const [announcement, setAnnouncement] = useState('');
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [paymentNumber, setPaymentNumber] = useState(activeApartment?.paymentNumber || '');
  const [qrCodePreview, setQrCodePreview] = useState(activeApartment?.paymentQrCode || '');
  const fileInputRef = useRef(null);

  const [billForm, setBillForm] = useState({
    type: 'water',
    amount: '',
    dueDate: '',
    assignedTo: ''
  });

  const users = getApartmentUsers(activeApartment?.id);
  const announcements = getAnnouncements(activeApartment?.id);

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    const message = {
      id: crypto.randomUUID(),
      type: 'announcement',
      content: announcement,
      apartmentId: activeApartment?.id,
      senderId: activeUser?.id,
      timestamp: new Date().toISOString()
    };

    addMessage(message);
    setAnnouncement('');
  };

  const handleBillChange = (e) => {
    const { name, value } = e.target;
    setBillForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!billForm.amount || !billForm.dueDate || !billForm.assignedTo) return;

    const bill = {
      id: crypto.randomUUID(),
      type: billForm.type,
      amount: parseFloat(billForm.amount),
      dueDate: billForm.dueDate,
      status: 'unpaid',
      assignedTo: billForm.assignedTo,
      apartmentId: activeApartment?.id,
      createdAt: new Date().toISOString()
    };

    addBill(bill);
    setBillForm({
      type: 'water',
      amount: '',
      dueDate: '',
      assignedTo: ''
    });
  };

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePaymentDetails = () => {
    updatePaymentDetails(activeApartment.id, paymentNumber, qrCodePreview);
    setShowPaymentSettings(false);
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
              <span className="text-gray-400 font-normal ml-2">Admin Dashboard</span>
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPaymentSettings(!showPaymentSettings)}
                className="bg-green-100 hover:bg-green-200 text-green-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Settings
              </button>
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

      {showPaymentSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border-b border-gray-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Payment Number (Phone/Bank)</label>
                <input
                  type="text"
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., +1234567890 or Bank Account Number"
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Payment QR Code</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleQrCodeUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition-colors"
                >
                  {qrCodePreview ? (
                    <img src={qrCodePreview} alt="QR Code" className="w-32 h-32 mx-auto object-contain" />
                  ) : (
                    <div>
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">Click to upload QR code</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleSavePaymentDetails}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg"
            >
              Save Payment Details
            </motion.button>
          </div>
        </motion.div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Announcements</h2>
            </div>
            <div className="p-4 space-y-4">
              {announcements.length > 0 ? (
                announcements.slice(0, 5).map((msg) => (
                  <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-blue-50 rounded-xl"
                  >
                    <p className="text-gray-700">{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.timestamp).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-400">
                  No announcements yet
                </p>
              )}
              <form onSubmit={handleCreateAnnouncement} className="mt-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-gray-700 font-medium mb-2">New Announcement</label>
                <textarea
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Write announcement..."
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-3 rounded-xl transition-colors"
                >
                  Post Announcement
                </motion.button>
              </form>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Create Bills</h2>
            </div>
            <form onSubmit={handleCreateBill} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Bill Type</label>
                  <select
                    name="type"
                    value={billForm.type}
                    onChange={handleBillChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="water">Water</option>
                    <option value="electricity">Electricity</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Amount ($)</label>
                  <input
                    type="number"
                    name="amount"
                    value={billForm.amount}
                    onChange={handleBillChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={billForm.dueDate}
                    onChange={handleBillChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-600 text-sm font-medium mb-2">Assign to Resident</label>
                  <select
                    name="assignedTo"
                    value={billForm.assignedTo}
                    onChange={handleBillChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a resident</option>
                    {users
                      .filter(user => user.role === 'resident')
                      .map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Create Bill
              </motion.button>
            </form>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Statistics</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Total Residents</span>
                <span className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'resident').length}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600">Total Bills</span>
                <span className="text-2xl font-bold text-gray-900">{bills.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                <span className="text-gray-600">Pending Payments</span>
                <span className="text-2xl font-bold text-red-600">
                  {bills.filter(b => b.status === 'unpaid').length}
                </span>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;