import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CivicNotification } from '../types';
import { storage } from '../services/storage';
import { GHMC_WARDS } from '../data/ghmcWards';

interface LoginResult {
  success: boolean;
  message?: string;
  isPendingApproval?: boolean;
  user?: User;
}

interface RegisterOfficerParams {
  name: string;
  email: string;
  phone: string;
  officerId: string;
  wardNumber: number;
  departmentId: string;
  designation?: string;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => LoginResult;
  registerCitizen: (name: string, email: string, phone: string) => { success: boolean; message?: string };
  registerOfficer: (params: RegisterOfficerParams) => { success: boolean; message?: string };
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  notifications: CivicNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [notifications, setNotifications] = useState<CivicNotification[]>([]);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storage.subscribe(() => {
      const activeUser = storage.getCurrentUser();
      setCurrentUser(activeUser ? { ...activeUser } : null);
      if (activeUser) {
        setNotifications(storage.getNotifications(activeUser.id));
      } else {
        setNotifications([]);
      }
    });

    if (currentUser) {
      setNotifications(storage.getNotifications(currentUser.id));
    }

    return () => unsubscribe();
  }, []);

  const refreshNotifications = () => {
    if (currentUser) {
      setNotifications(storage.getNotifications(currentUser.id));
    }
  };

  const login = (email: string, _password?: string): LoginResult => {
    const users = storage.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      return {
        success: false,
        message: 'No account found matching this email address. Please check your spelling or create an account.',
      };
    }

    if (!found.isActive) {
      return {
        success: false,
        message: 'This account has been deactivated or suspended by municipal administration.',
      };
    }

    // Check if officer registration is pending approval
    if (found.role === 'officer' && found.isApproved === false) {
      return {
        success: false,
        isPendingApproval: true,
        message: `Your Municipal Officer account (Officer ID: ${found.officerId || 'Staff'}) is currently pending official verification by the GHMC Commissioner. Access will be granted once approved.`,
      };
    }

    storage.setCurrentUser(found);
    setCurrentUser(found);
    setNotifications(storage.getNotifications(found.id));
    return { success: true, user: found };
  };

  const registerCitizen = (
    name: string,
    email: string,
    phone: string
  ): { success: boolean; message?: string } => {
    const users = storage.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `user-citizen-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: 'citizen',
      isApproved: true,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    storage.addUser(newUser);
    storage.setCurrentUser(newUser);
    setCurrentUser(newUser);

    // Initial welcome notification
    storage.addNotification({
      userId: newUser.id,
      complaintId: '',
      title: 'Welcome to CCIRS Hyderabad',
      message: 'Your citizen account is verified. You can now report civic problems in GHMC wards with real-time GPS tracking.',
      type: 'system',
    });
    setNotifications(storage.getNotifications(newUser.id));
    return { success: true };
  };

  const registerOfficer = (
    params: RegisterOfficerParams
  ): { success: boolean; message?: string } => {
    const users = storage.getUsers();
    const existingEmail = users.find((u) => u.email.toLowerCase() === params.email.trim().toLowerCase());
    if (existingEmail) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const existingOfficerId = users.find(
      (u) => u.officerId && u.officerId.toLowerCase() === params.officerId.trim().toLowerCase()
    );
    if (existingOfficerId) {
      return { success: false, message: `Official Employee ID "${params.officerId}" is already registered in the system.` };
    }

    const departments = storage.getDepartments();
    const dept = departments.find((d) => d.id === params.departmentId) || departments[0];
    const ward = GHMC_WARDS.find((w) => w.wardNumber === params.wardNumber);
    if (!ward) {
      return {
        success: false,
        message: 'Invalid GHMC ward selected. Please select a valid official ward between 1 and 150.',
      };
    }

    const newOfficer: User = {
      id: `user-officer-${Date.now()}`,
      name: params.name.trim(),
      email: params.email.trim(),
      phone: params.phone.trim(),
      role: 'officer',
      officerId: params.officerId.trim().toUpperCase(),
      wardNumber: ward.wardNumber,
      wardName: ward.wardName,
      zone: ward.zone,
      departmentId: dept.id,
      departmentName: dept.name,
      designation: params.designation?.trim() || `Ward ${ward.wardNumber} Inspection Engineer`,
      isApproved: false, // Requires administrator verification per Section 2.C
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    storage.addUser(newOfficer);

    // Send notification to Admin
    const adminUser = users.find((u) => u.role === 'admin');
    if (adminUser) {
      storage.addNotification({
        userId: adminUser.id,
        complaintId: '',
        title: 'New Officer Registration Pending Verification',
        message: `${newOfficer.name} (Officer ID: ${newOfficer.officerId}) registered for ${dept.name}, Ward ${ward.wardNumber} (${ward.wardName}). Please review in Staff Roster.`,
        type: 'system',
      });
    }

    return {
      success: true,
      message: 'Officer registration submitted successfully! Your account is now pending verification by the GHMC Commissioner. You will be able to sign in once approved.',
    };
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setNotifications([]);
  };

  const switchDemoUser = (userId: string) => {
    const users = storage.getUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      storage.setCurrentUser(user);
      setCurrentUser(user);
      setNotifications(storage.getNotifications(user.id));
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = storage.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser({ ...updated });
    }
  };

  const markNotificationAsRead = (id: string) => {
    storage.markNotificationAsRead(id);
    refreshNotifications();
  };

  const markAllNotificationsAsRead = () => {
    if (currentUser) {
      storage.markAllNotificationsAsRead(currentUser.id);
      refreshNotifications();
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        registerCitizen,
        registerOfficer,
        logout,
        switchDemoUser,
        updateProfile,
        notifications,
        unreadNotifsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
