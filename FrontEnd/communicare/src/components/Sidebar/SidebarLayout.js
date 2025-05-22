import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const SidebarLayout = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
