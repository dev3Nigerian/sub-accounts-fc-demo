"use client";

import { useEffect } from "react";

// Type declarations for Farcaster SDK
declare global {
  interface Window {
    farcaster?: {
      sdk?: {
        actions?: {
          ready: () => void | Promise<void>;
        };
      };
    };
  }
}

export function FarcasterSDK() {
  useEffect(() => {
    // Function to call SDK ready
    const callSDKReady = async () => {
      try {
        // Check if SDK is available in current window
        if (window.farcaster?.sdk?.actions?.ready) {
          await window.farcaster.sdk.actions.ready();
          return true;
        }
        
        // Check parent window if in iframe
        if (window.parent && window.parent !== window && (window.parent as any).farcaster?.sdk?.actions?.ready) {
          await (window.parent as any).farcaster.sdk.actions.ready();
          return true;
        }

        return false;
      } catch (error) {
        console.warn("Error calling Farcaster SDK ready:", error);
        return false;
      }
    };

    // Initialize SDK when component mounts
    const initializeSDK = async () => {
      // Try immediately
      const success = await callSDKReady();
      
      // If not successful, retry a few times (SDK might load after page)
      if (!success) {
        let retries = 0;
        const maxRetries = 10;
        
        const retryInterval = setInterval(async () => {
          retries++;
          const success = await callSDKReady();
          
          if (success || retries >= maxRetries) {
            clearInterval(retryInterval);
          }
        }, 200); // Check every 200ms

        // Clean up after max retries
        setTimeout(() => clearInterval(retryInterval), maxRetries * 200);
      }
    };

    // Start initialization
    if (typeof window !== "undefined") {
      // Wait for DOM to be ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeSDK);
      } else {
        // DOM already ready, initialize immediately
        initializeSDK();
      }
    }
  }, []);

  return null;
}

