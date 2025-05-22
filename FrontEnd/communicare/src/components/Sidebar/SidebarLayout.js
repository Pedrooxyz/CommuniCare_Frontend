import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 

const SidebarLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '64px', width: '100%' }}>
        <Outlet /> {}
      </div>
    </div>
  );
};

export default SidebarLayout;