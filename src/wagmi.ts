import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [
      baseAccount({
        appName: "Sub Accounts Demo",
        subAccounts: {
          creation: "on-connect",
          defaultAccount: "sub",
        },
        ...(process.env.NEXT_PUBLIC_PAYMASTER_SERVICE_URL && {
          paymasterUrls: {
            [baseSepolia.id]: process.env.NEXT_PUBLIC_PAYMASTER_SERVICE_URL,
          },
        }),
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
