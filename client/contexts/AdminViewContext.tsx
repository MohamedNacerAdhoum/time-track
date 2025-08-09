import { createContext, useContext, ReactNode } from 'react';

interface AdminViewContextType {
  isAdminView: boolean;
}

const AdminViewContext = createContext<AdminViewContextType>({
  isAdminView: false,
});

export const useAdminView = () => useContext(AdminViewContext);

export function AdminViewProvider({ 
  children,
  isAdminView = false 
}: { 
  children: ReactNode; 
  isAdminView?: boolean 
}) {
  return (
    <AdminViewContext.Provider value={{ isAdminView }}>
      {children}
    </AdminViewContext.Provider>
  );
}
