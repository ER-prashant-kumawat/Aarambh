import { createContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyType: string;
  registeredState: string;
  incorporationStatus: string;
  progressDays: number;
  totalDays: number;
  advisorName: string;
  advisorPhone: string;
  panStatus: string;
  tanStatus: string;
  gstStatus: string;
  milestoneStep: number;
  complianceConfigured: number[];
  emailPlan: string | null;
  webPlan: string | null;
  emailActivated: boolean;
  webLaunched: boolean;
}

export interface DocumentType {
  _id: string;
  name: string;
  type: string;
  size: string;
  ext: string;
  filePath: string;
  status: string;
  dateUploaded: string;
}

export interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  documents: DocumentType[];
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchDocs: () => Promise<void>;
  uploadDoc: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  deleteDoc: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateCompliance: (index: number, configured: boolean) => Promise<{ success: boolean; error?: string }>;
  updateTechSetup: (data: Partial<Pick<User, 'emailPlan' | 'webPlan' | 'emailActivated' | 'webLaunched'>>) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

import { API_URL } from '../utils/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [documents, setDocuments] = useState<DocumentType[]>([]);

  // Load User on Startup
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        axios.defaults.headers.common['x-auth-token'] = token;
        const res = await axios.get(`${API_URL}/auth/me`);
        setUser(res.data);
        
        // Fetch User Documents
        const docsRes = await axios.get(`${API_URL}/documents`);
        setDocuments(docsRes.data);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register User
  const register = async (userData: any) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      return { success: true };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Registration failed' 
      };
    }
  };

  // Login User
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      return { success: true };
    } catch (err: any) {
      console.error('Login error:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Invalid credentials' 
      };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setDocuments([]);
  };

  // Fetch Documents
  const fetchDocs = async () => {
    try {
      const res = await axios.get(`${API_URL}/documents`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  // Upload Document
  const uploadDoc = async (formData: FormData) => {
    try {
      const res = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDocuments(prev => [res.data, ...prev]);
      return { success: true };
    } catch (err: any) {
      console.error('Upload document error:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Upload failed' 
      };
    }
  };

  // Delete Document
  const deleteDoc = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      return { success: true };
    } catch (err: any) {
      console.error('Delete document error:', err);
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Delete failed' 
      };
    }
  };

  // Toggle a compliance item's configured state
  const updateCompliance = async (index: number, configured: boolean) => {
    try {
      const res = await axios.put(`${API_URL}/dashboard/compliance`, { index, configured });
      setUser(res.data);
      return { success: true };
    } catch (err: any) {
      console.error('Update compliance error:', err);
      return {
        success: false,
        error: err.response?.data?.msg || 'Failed to update compliance status'
      };
    }
  };

  // Update tech setup hub selections/activation flags
  const updateTechSetup = async (data: Partial<Pick<User, 'emailPlan' | 'webPlan' | 'emailActivated' | 'webLaunched'>>) => {
    try {
      const res = await axios.put(`${API_URL}/dashboard/tech-setup`, data);
      setUser(res.data);
      return { success: true };
    } catch (err: any) {
      console.error('Update tech setup error:', err);
      return {
        success: false,
        error: err.response?.data?.msg || 'Failed to update tech setup'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        documents,
        register,
        login,
        logout,
        fetchDocs,
        uploadDoc,
        deleteDoc,
        updateCompliance,
        updateTechSetup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
