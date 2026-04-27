import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  initFirebase, 
  isFirebaseReady,
  createApartmentDB, 
  getApartmentDB,
  updateApartmentDB,
  createUserDB,
  getUsersByApartmentDB,
  createBillDB,
  getBillsByApartmentDB,
  updateBillDB,
  createMessageDB,
  getMessagesByApartmentDB,
  subscribeToApartments,
  subscribeToUsers,
  subscribeToBills,
  subscribeToMessages
} from '../firebase';

const ApartmentContext = createContext();

export const ApartmentProvider = ({ children }) => {
  const [apartments, setApartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [bills, setBills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeApartmentId, setActiveApartmentId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const ready = await initFirebase();
      setFirebaseReady(ready);
      
      if (ready) {
        const storedActiveApartmentId = localStorage.getItem('activeApartmentId');
        const storedActiveUserId = localStorage.getItem('activeUserId');
        if (storedActiveApartmentId) setActiveApartmentId(storedActiveApartmentId);
        if (storedActiveUserId) setActiveUserId(storedActiveUserId);
        
        setupSubscriptions();
      } else {
        loadFromLocalStorage();
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (activeApartmentId || activeUserId) {
      localStorage.setItem('activeApartmentId', activeApartmentId || '');
      localStorage.setItem('activeUserId', activeUserId || '');
    }
  }, [activeApartmentId, activeUserId]);

  const loadFromLocalStorage = () => {
    try {
      const storedApartments = localStorage.getItem('apartments');
      const storedUsers = localStorage.getItem('users');
      const storedBills = localStorage.getItem('bills');
      const storedMessages = localStorage.getItem('messages');

      if (storedApartments) setApartments(JSON.parse(storedApartments));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedBills) setBills(JSON.parse(storedBills));
      if (storedMessages) setMessages(JSON.parse(storedMessages));
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('apartments', JSON.stringify(apartments));
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('bills', JSON.stringify(bills));
      localStorage.setItem('messages', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const setupSubscriptions = () => {
    const unsubApartments = subscribeToApartments((data) => {
      setApartments(data);
    });
    
    return () => {
      unsubApartments();
    };
  };

  useEffect(() => {
    if (!firebaseReady) {
      saveToLocalStorage();
    }
  }, [apartments, users, bills, messages, firebaseReady]);

  const activeApartment = apartments.find(apt => apt.id === activeApartmentId) || null;
  const activeUser = users.find(user => user.id === activeUserId) || null;

  const createApartment = async (name, numUnits) => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const apt = {
      id: uuidv4(),
      name,
      numUnits,
      roomCode,
      paymentNumber: '',
      paymentQrCode: '',
      createdAt: new Date().toISOString(),
    };
    
    setApartments(prev => [...prev, apt]);
    setActiveApartmentId(apt.id);

    const adminUser = {
      id: uuidv4(),
      apartmentId: apt.id,
      name: 'Admin',
      role: 'admin',
      joinedAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, adminUser]);
    setActiveUserId(adminUser.id);

    if (firebaseReady) {
      await createApartmentDB(apt);
      await createUserDB(adminUser);
    }

    return apt;
  };

  const joinApartment = async (roomCode, residentName) => {
    let apartment = apartments.find(apt => apt.roomCode.toUpperCase() === roomCode.toUpperCase());
    
    if (!apartment && firebaseReady) {
      apartment = await getApartmentDB(roomCode);
    }
    
    if (!apartment) return false;

    const apartmentExists = apartments.find(apt => apt.id === apartment.id);
    if (!apartmentExists) {
      setApartments(prev => [...prev, apartment]);
    }
    
    setActiveApartmentId(apartment.id);

    const residentUser = {
      id: uuidv4(),
      apartmentId: apartment.id,
      name: residentName,
      role: 'resident',
      joinedAt: new Date().toISOString(),
    };
    
    setUsers(prev => [...prev, residentUser]);
    setActiveUserId(residentUser.id);

    if (firebaseReady) {
      await createUserDB(residentUser);
    }

    return true;
  };

  const updatePaymentDetails = async (apartmentId, paymentNumber, paymentQrCode) => {
    setApartments(prev =>
      prev.map(apt =>
        apt.id === apartmentId
          ? { ...apt, paymentNumber, paymentQrCode }
          : apt
      )
    );

    if (firebaseReady) {
      await updateApartmentDB(apartmentId, { paymentNumber, paymentQrCode });
    }
  };

  const addBill = async (bill) => {
    setBills(prev => [...prev, bill]);

    if (firebaseReady) {
      await createBillDB(bill);
    }
  };

  const updateBillStatus = async (billId, status) => {
    setBills(prev =>
      prev.map(bill =>
        bill.id === billId ? { ...bill, status } : bill
      )
    );

    if (firebaseReady) {
      await updateBillDB(billId, { status });
    }
  };

  const addMessage = async (message) => {
    setMessages(prev => [...prev, message]);

    if (firebaseReady) {
      await createMessageDB(message);
    }
  };

  const setActiveUser = (userId) => {
    setActiveUserId(userId);
  };

  const setActiveApartment = (apartmentId) => {
    setActiveApartmentId(apartmentId);
  };

  const getApartmentUsers = (apartmentId) => {
    return users.filter(user => user.apartmentId === apartmentId);
  };

  const getResidentBills = (residentId) => {
    return bills.filter(bill => bill.assignedTo === residentId);
  };

  const getAnnouncements = (apartmentId) => {
    return messages.filter(msg => msg.type === 'announcement' && msg.apartmentId === apartmentId);
  };

  const getPersonalMessages = (residentId) => {
    return messages.filter(
      msg => msg.type === 'personal' && 
             (msg.recipientId === residentId || msg.senderId === residentId) &&
             msg.apartmentId === (activeUser?.apartmentId || null)
    );
  };

  const value = {
    apartments,
    users,
    bills,
    messages,
    activeApartment,
    activeUser,
    activeApartmentId,
    activeUserId,
    firebaseReady,
    createApartment,
    joinApartment,
    addBill,
    updateBillStatus,
    addMessage,
    setActiveUser,
    setActiveApartment,
    getApartmentUsers,
    getResidentBills,
    getAnnouncements,
    getPersonalMessages,
    updatePaymentDetails,
  };

  return (
    <ApartmentContext.Provider value={value}>
      {children}
    </ApartmentContext.Provider>
  );
};

export const useApartment = () => {
  return useContext(ApartmentContext);
};