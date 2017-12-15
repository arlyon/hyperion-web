/**
 * Registers the service worker.
 * @returns {Promise<void>}
 * @constructor
 */
export async function RegisterServiceWorker() {
    // Check for browser support of service worker
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
        } catch (error) {
            if (process.env.ENV == 'development') console.log("Could not register service worker.")
        }
    }
}