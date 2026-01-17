import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isSignedIn || !user) {
        setRoleLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/profile/${user.id}`, {
          credentials: 'include',
        });

        if (response.ok) {
          const profileData = await response.json();
          setUserRole(profileData.role);
        } else {
          // If profile doesn't exist, default to 'user'
          setUserRole('user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('user');
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [isSignedIn, user]);

  if (!isLoaded || roleLoading) return null; // or loading spinner

  // 🔐 If user not signed in, redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  // ✅ Use role from backend database
  const role = userRole || "user";
  console.log("🔍 Authenticated User Role:", role);

  // ✅ Check role against allowedRoles
  if (!allowedRoles || allowedRoles.includes(role)) {
    return children;
  }

  // ❌ Role not allowed → redirect to /unauthorized
  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
