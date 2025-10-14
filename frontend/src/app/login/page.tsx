'use client';

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
 LoginWithEmailOTPEventOnReceived,
 LoginWithEmailOTPEventEmit,
 DeviceVerificationEventOnReceived,
 DeviceVerificationEventEmit,
} from 'magic-sdk';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { OTPModal } from '@/components/OTPModal';

type NotificationState = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'default';
} | null;

type OTPModalState = {
  isOpen: boolean;
  title: string;
  description: string;
  type: 'email' | 'mfa';
  error?: string;
} | null;

export default function LoginPage() {
 const [email, setEmail] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [notification, setNotification] = useState<NotificationState>(null);
 const [otpModal, setOtpModal] = useState<OTPModalState>(null);
 const [currentHandle, setCurrentHandle] = useState<any>(null);
 
 const { magic, login } = useAuth();

 const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'default' = 'default') => {
   setNotification({ message, type });
   setTimeout(() => setNotification(null), 5000);
 };

 const handleOTPSubmit = (otp: string) => {
   if (!currentHandle) return;
   
   if (otpModal?.type === 'email') {
     currentHandle.emit(LoginWithEmailOTPEventEmit.VerifyEmailOtp, otp);
   } else if (otpModal?.type === 'mfa') {
     currentHandle.emit(LoginWithEmailOTPEventEmit.VerifyMFACode, otp);
   }
   
   setOtpModal(null);
 };

 const handleOTPCancel = () => {
   if (currentHandle) {
     currentHandle.emit(LoginWithEmailOTPEventEmit.Cancel);
   }
   setOtpModal(null);
   setCurrentHandle(null);
   setIsLoading(false);
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!magic || !email) return;

   setIsLoading(true);
   setNotification(null);

   try {
     const handle = magic.auth.loginWithEmailOTP({
       email,
       showUI: false,
       deviceCheckUI: false
     });

     setCurrentHandle(handle);

     handle
       .on(LoginWithEmailOTPEventOnReceived.EmailOTPSent, () => {
         setOtpModal({
           isOpen: true,
           title: 'Email Verification',
           description: `We've sent a verification code to ${email}. Please enter it below.`,
           type: 'email'
         });
       })
       .on(LoginWithEmailOTPEventOnReceived.InvalidEmailOtp, () => {
         setOtpModal(prev => prev ? {
           ...prev,
           error: 'Invalid verification code. Please try again.'
         } : null);
       })
       .on('done', async (result) => {
         setIsLoading(false);
         setCurrentHandle(null);
         showNotification('Login successful! Redirecting...', 'success');
         
         try {
           await login(result as string);
         } catch (error) {
           showNotification('Login failed. Please try again.', 'error');
         }
       })
       .on('error', (reason) => {
         setIsLoading(false);
         setCurrentHandle(null);
         setOtpModal(null);
         showNotification(reason?.message || 'Login failed. Please try again.', 'error');
         console.error('Login error:', reason);
       })
       .on('settled', () => {
         setIsLoading(false);
       })
       .on(LoginWithEmailOTPEventOnReceived.MfaSentHandle, () => {
         setOtpModal({
           isOpen: true,
           title: 'Two-Factor Authentication',
           description: 'Please enter your MFA code from your authenticator app.',
           type: 'mfa'
         });
       })
       .on(LoginWithEmailOTPEventOnReceived.InvalidMfaOtp, () => {
         setOtpModal(prev => prev ? {
           ...prev,
           error: 'Invalid MFA code. Please try again.'
         } : null);
       })
       .on(DeviceVerificationEventOnReceived.DeviceNeedsApproval, () => {
         showNotification('Device needs approval. Please check your email.', 'warning');
       })
       .on(DeviceVerificationEventOnReceived.DeviceVerificationEmailSent, () => {
         showNotification('Device verification email sent. Please check your email and approve the device.', 'default');
       })
       .on(DeviceVerificationEventOnReceived.DeviceApproved, () => {
         showNotification('Device approved successfully!', 'success');
       })
       .on(DeviceVerificationEventOnReceived.DeviceVerificationLinkExpired, () => {
         showNotification('Device verification link expired. Retrying...', 'warning');
         handle.emit(DeviceVerificationEventEmit.Retry);
       });

   } catch (err) {
     setIsLoading(false);
     setCurrentHandle(null);
     showNotification('Error during login. Please try again.', 'error');
     console.error('Error during login', err);
   }
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
     <div className="w-full max-w-md space-y-6">
       <div className="text-center space-y-2">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
           Welcome Back
         </h1>
         <p className="text-gray-600 dark:text-gray-400">
           Sign in to your account using Magic Link
         </p>
       </div>

       <Card>
         <CardHeader>
           <CardTitle>Sign In</CardTitle>
           <CardDescription>
             Enter your email address to receive a secure login link
           </CardDescription>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmit} className="space-y-4">
             <Input
               type="email"
               label="Email Address"
               placeholder="Enter your email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               disabled={isLoading}
             />
             
             <Button 
               type="submit" 
               disabled={isLoading || !email.trim()}
               isLoading={isLoading}
               className="w-full"
             >
               {isLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
             </Button>
           </form>
         </CardContent>
       </Card>

       {notification && (
         <Alert variant={notification.type}>
           {notification.message}
         </Alert>
       )}

       <div className="text-center text-sm text-gray-500 dark:text-gray-400">
         <p>
           By signing in, you agree to our{' '}
           <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
             Terms of Service
           </a>{' '}
           and{' '}
           <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
             Privacy Policy
           </a>
         </p>
       </div>
     </div>

     {otpModal && (
       <OTPModal
         isOpen={otpModal.isOpen}
         title={otpModal.title}
         description={otpModal.description}
         error={otpModal.error}
         onSubmit={handleOTPSubmit}
         onCancel={handleOTPCancel}
       />
     )}
   </div>
 );
}