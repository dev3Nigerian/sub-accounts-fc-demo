import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";
import { Toaster } from "sonner";

import { getConfig } from "../wagmi";
import { Providers } from "./providers";
import { FarcasterSDK } from "../components/farcaster-sdk";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonymous Forum",
  description: "A decentralized anonymous forum where users can post and receive USDC tips on Base",
};

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie")
  );
  return (
    <html lang="en">
      <head>
        <meta
          name="fc:miniapp"
          content={JSON.stringify({
            version: "1",
            imageUrl: "https://sub-accounts-fc-demo.vercel.app/icons/hero-1200x630.png",
            button: {
              title: "Open Forum",
              action: {
                type: "launch_miniapp",
                url: "https://sub-accounts-fc-demo.vercel.app"
              }
            }
          })}
        />
        <meta property="og:image" content="https://sub-accounts-fc-demo.vercel.app/icons/hero-1200x630.png" />
        <meta property="og:title" content="Anonymous Forum" />
        <meta property="og:description" content="Post anonymously, tip freely" />
      </head>
      <body className={inter.className}>
        <Providers initialState={initialState}>
          <FarcasterSDK />
          {props.children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
