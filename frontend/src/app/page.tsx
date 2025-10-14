'use client';

import { useState, useEffect } from "react";
import {
 Magic,
 LoginWithEmailOTPEventOnReceived,
 LoginWithEmailOTPEventEmit,
 RecencyCheckEventOnReceived,
 RecencyCheckEventEmit,
 DeviceVerificationEventEmit,
 DeviceVerificationEventOnReceived,
} from 'magic-sdk';

export default function Home() {
 const [email, setEmail] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [magic, setMagic] = useState<Magic | null>(null);

 // Initialize Magic SDK
 useEffect(() => {
   if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY) {
     const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string);
     setMagic(magicInstance);
   }
 }, []);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!magic || !email) return;

   setIsLoading(true);
   setError(null);

   try {
     // Initiate login flow
     const handle = magic.auth.loginWithEmailOTP({
       email,
       showUI: false,
       deviceCheckUI: false
     });

     handle
       .on(LoginWithEmailOTPEventOnReceived.EmailOTPSent, () => {
         // The email has been sent to the user
         const otp = window.prompt('Enter Email OTP');
         if (otp) {
           // Send the OTP for verification
           handle.emit(LoginWithEmailOTPEventEmit.VerifyEmailOtp, otp);
         } else {
           handle.emit(LoginWithEmailOTPEventEmit.Cancel);
         }
       })
       .on(LoginWithEmailOTPEventOnReceived.InvalidEmailOtp, () => {
         // User entered invalid OTP
         setError('Invalid OTP. Please try again.');
         const retryOtp = window.prompt('Invalid OTP. Enter Email OTP again:');
         if (retryOtp) {
           handle.emit(LoginWithEmailOTPEventEmit.VerifyEmailOtp, retryOtp);
         } else {
           handle.emit(LoginWithEmailOTPEventEmit.Cancel);
         }
       })
       .on('done', (result) => {
         // is called when the Promise resolves
         setIsLoading(false);
         alert('Login complete!');
         // DID Token returned in result
         const didToken = result;
         console.log('DID Token:', didToken);
       })
       .on('error', (reason) => {
         // is called if the Promise rejects
         setIsLoading(false);
         setError(reason?.message || 'Login failed');
         console.error('Login error:', reason);
       })
       .on('settled', () => {
         // is called when the Promise either resolves or rejects
         setIsLoading(false);
       })

       //** MFA Verification Events (if enabled for app)
       .on(LoginWithEmailOTPEventOnReceived.MfaSentHandle, () => {
         const mfa_totp = window.prompt('Enter MFA TOTP');
         if (mfa_totp) {
           handle.emit(LoginWithEmailOTPEventEmit.VerifyMFACode, mfa_totp);
         } else {
           handle.emit(LoginWithEmailOTPEventEmit.Cancel);
         }
       })
       .on(LoginWithEmailOTPEventOnReceived.InvalidMfaOtp, () => {
         setError('Invalid MFA code. Please try again.');
         const retryMfa = window.prompt('Invalid MFA code. Enter MFA TOTP again:');
         if (retryMfa) {
           handle.emit(LoginWithEmailOTPEventEmit.VerifyMFACode, retryMfa);
         } else {
           handle.emit(LoginWithEmailOTPEventEmit.Cancel);
         }
       })

       //** Device Verification Events (if enabled for app)
       .on(DeviceVerificationEventOnReceived.DeviceNeedsApproval, () => {
         setError('Device needs approval. Please check your email.');
       })
       .on(DeviceVerificationEventOnReceived.DeviceVerificationEmailSent, () => {
         alert('Device verification email sent. Please check your email and approve the device.');
       })
       .on(DeviceVerificationEventOnReceived.DeviceApproved, () => {
         alert('Device approved successfully!');
       })
       .on(DeviceVerificationEventOnReceived.DeviceVerificationLinkExpired, () => {
         setError('Device verification link expired. Retrying...');
         handle.emit(DeviceVerificationEventEmit.Retry);
       });

   } catch (err) {
     setIsLoading(false);
     setError('Error during login');
     console.error('Error during login', err);
   }
 };

 return (
   <div>
     <form onSubmit={handleSubmit}>
       <label htmlFor="email">Email:</label>
       <input
         type="email"
         id="email"
         name="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         required
         disabled={isLoading}
       />
       <button type="submit" disabled={isLoading || !email}>
         {isLoading ? 'Logging in...' : 'Submit'}
       </button>
     </form>
     {error && <p style={{ color: 'red' }}>{error}</p>}
   </div>
 );
}
