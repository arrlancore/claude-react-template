"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function CallbackClientPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's a session in the URL fragment
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Session error:', error);
          setStatus('error');
          setErrorMessage(error.message);
          // Redirect to auth page with error after 3 seconds
          setTimeout(() => {
            router.push(`/auth?error=session_error&error_description=${encodeURIComponent(error.message)}`);
          }, 3000);
          return;
        }

        if (data.session) {
          setStatus('success');
          // Successful authentication, redirect to dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          // No session found, might be an error or expired
          setStatus('error');
          setErrorMessage('No valid session found');
          setTimeout(() => {
            router.push('/auth?error=no_session');
          }, 3000);
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setStatus('error');
        setErrorMessage('An unexpected error occurred');
        setTimeout(() => {
          router.push('/auth?error=unexpected_error');
        }, 3000);
      }
    };

    // Wait a moment for the URL to be fully processed by Supabase
    const timer = setTimeout(handleAuthCallback, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <h2 className="text-xl font-semibold">Completing sign in...</h2>
            <p className="text-muted-foreground">Please wait while we set up your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="h-8 w-8 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-green-700">Sign in successful!</h2>
            <p className="text-muted-foreground">Redirecting you to your dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="h-8 w-8 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-red-500 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-red-700">Sign in failed</h2>
            <p className="text-muted-foreground">
              {errorMessage || 'Something went wrong during authentication.'}
            </p>
            <p className="text-sm text-muted-foreground">Redirecting back to sign in page...</p>
          </>
        )}
      </div>
    </div>
  );
}
