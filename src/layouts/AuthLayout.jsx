import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Authentication-specific layout */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
