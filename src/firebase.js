import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDocs, updateDoc, onSnapshot, query, where } from 'firebase/firestore'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAZfKpcjcWnN-n2jhXPRRv_bGulshpD-Ps",
  authDomain: "apartment-manager-8ec7e.firebaseapp.com",
  projectId: "apartment-manager-8ec7e",
  storageBucket: "apartment-manager-8ec7e.firebasestorage.app",
  messagingSenderId: "557258793136",
  appId: "1:557258793136:web:f0632de3ec85d9b3b25b75",
  measurementId: "G-ZGBESNLVE8"
}

let app
let db
let auth
let firebaseReady = false

export const initFirebase = async () => {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
    await signInAnonymously(auth)
    firebaseReady = true
    console.log('Firebase connected!')
    return true
  } catch (e) {
    console.log('Firebase error:', e.message)
    return false
  }
}

export const isFirebaseReady = () => firebaseReady

export const createApartmentDB = async (apartment) => {
  if (!firebaseReady) return
  const docRef = doc(db, 'apartments', apartment.id)
  await setDoc(docRef, apartment)
}

export const getApartmentDB = async (roomCode) => {
  if (!firebaseReady) return null
  const q = query(collection(db, 'apartments'), where('roomCode', '==', roomCode))
  const snapshot = await getDocs(q)
  return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
}

export const updateApartmentDB = async (id, data) => {
  if (!firebaseReady) return
  const docRef = doc(db, 'apartments', id)
  await updateDoc(docRef, data)
}

export const createUserDB = async (user) => {
  if (!firebaseReady) return
  const docRef = doc(db, 'users', user.id)
  await setDoc(docRef, user)
}

export const createBillDB = async (bill) => {
  if (!firebaseReady) return
  const docRef = doc(db, 'bills', bill.id)
  await setDoc(docRef, bill)
}

export const updateBillDB = async (id, data) => {
  if (!firebaseReady) return
  const docRef = doc(db, 'bills', id)
  await updateDoc(docRef, data)
}

export const createMessageDB = async (message) => {
  if (!firebaseReady) return
  const docRef = doc(db, 'messages', message.id)
  await setDoc(docRef, message)
}

export const getMessagesByApartmentDB = async (apartmentId) => {
  if (!firebaseReady) return []
  const q = query(collection(db, 'messages'), where('apartmentId', '==', apartmentId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}