import React from 'react';

/**
 * A reusable spinner component for loading states.
 * This uses Tailwind CSS for styling and animation.
 */
const Spinner = () => {
  return (
    // This container centers the spinner on the screen.
    <div className="flex justify-center items-center min-h-screen w-full">
      <div 
        className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};


/**
 * This is the loading UI for the `(counselling)/[uni]` route segment.
 * Next.js will automatically show this component while the page content is loading.
 */
export default function Loading() {
  // The loading UI is simply the Spinner component.
  return <Spinner />;
}