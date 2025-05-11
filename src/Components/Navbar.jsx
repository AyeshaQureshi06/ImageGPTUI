'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut
import Popup from './Popup';

const Navbar = () => {
  const { data: session, status } = useSession(); // Get session data and status
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleLoginClick = () => {
    setIsPopupVisible(true); // Show the popup when "Login" is clicked
  };

  const handleLogoutClick = () => {
    signOut(); // Use next-auth's signOut to log the user out
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false); // Hide the popup
  };

  return (
    <div style={styles.navbar}>
      <h1 style={styles.title}>PixelToProse</h1>
      {status === 'authenticated' ? (
        <div style={styles.userContainer}>
          <img
            src={session.user?.image || '/default-avatar.png'}
            alt="User Avatar"
            style={styles.avatar}
            title="User Avatar"
          />
          <span style={styles.userName}>{session.user.name}</span>
          <button style={styles.logoutButton} onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      ) : (
        <button style={styles.loginButton} onClick={handleLoginClick}>
          Login
        </button>
      )}
    
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#520003',
    color: '#3D52A0',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 20,
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'white',
    paddingLeft: '90px',
  },
  loginButton: {
    backgroundColor: '#fff',
    color: '#007bff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
};

export default Navbar;
