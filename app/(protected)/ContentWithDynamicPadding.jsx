import { useSidebar } from '../context/SidebarContext';

export default function ContentWithDynamicPadding({ children }) {
  const { isCollapsed } = useSidebar();
  return (
    <main className={`pt-16 transition-all duration-300 min-h-screen bg-gray-50 dark:bg-gray-900 ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
      {children}
    </main>
  );
} 