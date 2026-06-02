import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Header */}
      <header>
        {/* Navigation and header content */}
      </header>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default MainLayout;
