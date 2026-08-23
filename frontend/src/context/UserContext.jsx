import React, { createContext, useContext, useState, useEffect } from 'react';
import { compressImage } from '../utils/imageCompressor';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bebe_garcon_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [participants, setParticipants] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const fetchParticipants = async () => {
    try {
      const res = await fetch('/api/participants');
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants || []);
      }
    } catch (err) {
      console.error("Error fetching participants", err);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const openRegisterModal = () => {
    fetchParticipants();
    setIsRegisterModalOpen(true);
  };

  const registerUser = async ({ name, photo, avatar = '🦕', role = 'Proche' }) => {
    const cleanName = name.trim();
    if (!cleanName) return null;

    const userObj = {
      name: cleanName,
      photo: photo || null,
      avatar: avatar,
      role: role
    };

    try {
      const res = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj)
      });
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants);
        const registered = data.participants.find(p => p.name.toLowerCase() === cleanName.toLowerCase()) || userObj;
        setCurrentUser(registered);
        localStorage.setItem('bebe_garcon_user', JSON.stringify(registered));
        setIsRegisterModalOpen(false);
        return registered;
      }
    } catch (err) {
      console.error("Error saving participant", err);
      setCurrentUser(userObj);
      localStorage.setItem('bebe_garcon_user', JSON.stringify(userObj));
      setIsRegisterModalOpen(false);
      return userObj;
    }
  };

  const selectExistingUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('bebe_garcon_user', JSON.stringify(user));
  };

  const logoutOrSwitch = () => {
    setCurrentUser(null);
    localStorage.removeItem('bebe_garcon_user');
    setIsRegisterModalOpen(true);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        participants,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
        openRegisterModal,
        registerUser,
        selectExistingUser,
        logoutOrSwitch,
        refreshParticipants: fetchParticipants
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
