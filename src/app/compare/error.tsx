'use client'; // <-- CRITICAL: Error components must be Client Components

import { useEffect } from 'react';

// CORRECTED FUNCTION SIGNATURE with explicit types
export default function Error({
  error, 
  reset, 
}: {
  error: Error & { digest?: string }; // Ensures 'error' is a standard Error object
  reset: () => void;                 // Ensures 'reset' is a function with no return value
}) {
  
  useEffect(() => {
    // Log the error for monitoring
    console.error("Uncaught Page Error:", error);
  }, [error]);

  return (
    <div /* ... JSX content ... */>
        <h2>Something went wrong!</h2>
        <p>Detail: {error.message}</p>
        <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}