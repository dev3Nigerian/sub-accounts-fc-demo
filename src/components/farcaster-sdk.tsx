"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function FarcasterSDK() {
  useEffect(() => {
      // Call SDK ready after app is loaded
      const callReady = async () => {
      try {
          // Wait for app to be fully loaded
          await sdk.actions.ready();
          console.log("Farcaster SDK ready() called successfully");
      } catch (error) {
          // Silently fail if not in Farcaster context
          console.warn("Farcaster SDK not available:", error);
      }
    };

      // Wait for DOM to be ready, then call ready
      if (typeof window !== "undefined") {
          // Wait a bit for app to initialize
          const timer = setTimeout(() => {
              callReady();
          }, 100);

          return () => clearTimeout(timer);
    }
  }, []);

  return null;
}

