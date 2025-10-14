'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Magic } from 'magic-sdk';
import { useRouter } from 'next/navigation';

interface User {
  issuer: string;
  email: string;
  publicAddress: string;
}

interface AuthContextType {
  user: User | null;
  magic: Magic | null;
  isLoading: boolean;
  login: (didToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [magic, setMagic] = useState<Magic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize Magic SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY) {
      const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string);
      setMagic(magicInstance);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    if (magic) {
      checkAuth();
    }
  }, [magic]);

  const checkAuth = async () => {
    if (!magic) return;
    
    try {
      const isLoggedIn = await magic.user.isLoggedIn();
      
      if (isLoggedIn) {
        const userMetadata = await magic.user.getInfo();
        setUser({
          issuer: userMetadata.issuer!,
          email: userMetadata.email!,
          publicAddress: userMetadata.publicAddress!,
        });
        
        // Set token in cookie for middleware
        const didToken = await magic.user.getIdToken();
        document.cookie = `magic-token=${didToken}; path=/; max-age=86400; secure; samesite=strict`;
      } else {
        setUser(null);
        // Remove token cookie
        document.cookie = 'magic-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      document.cookie = 'magic-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (didToken: string) => {
    if (!magic) return;
    
    try {
      // Set token in cookie
      document.cookie = `magic-token=${didToken}; path=/; max-age=86400; secure; samesite=strict`;
      
      // Get user metadata
      const userMetadata = await magic.user.getInfo();
      setUser({
        issuer: userMetadata.issuer!,
        email: userMetadata.email!,
        publicAddress: userMetadata.publicAddress!,
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!magic) return;
    
    try {
      await magic.user.logout();
      setUser(null);
      
      // Remove token cookie
      document.cookie = 'magic-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      magic,
      isLoading,
      login,
      logout,
      checkAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}