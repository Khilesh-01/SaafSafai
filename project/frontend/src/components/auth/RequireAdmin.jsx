import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const RequireAdmin = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Invalid token');
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === null) return null; // Optional: Loading spinner

  return isAdmin ? children : <Navigate to="/login" />;
};

export default RequireAdmin;
