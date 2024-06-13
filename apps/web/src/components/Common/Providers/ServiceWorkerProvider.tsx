import type { FC } from 'react';

import { useEffect } from 'react';

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register the service worker
      (navigator.serviceWorker as ServiceWorkerContainer)
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('ServiceWorker registered successfully!');

          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New update available
                  console.log(
                    'New ServiceWorker available. Refresh the page to update.'
                  );
                }
              };
            }
          };
        })
        .catch(console.error);
    }
  }, []);

  return null;
};

export default ServiceWorkerProvider;
