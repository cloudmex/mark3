import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import { TomoContextProvider } from '@tomo-inc/tomo-web-sdk';
// import '@tomo-inc/tomo-web-sdk/style.css'; // Import Tomo SDK styles
//Importación de Story Protocol

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { aeneid } from "@story-protocol/core-sdk";

const configWagmi = getDefaultConfig({
  appName: 'Mark3',
  projectId: '13175627aef4aa6f7224141911a49645',
  chains: [aeneid],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <TomoContextProvider
    //   theme="light" // o "dark" según prefieras
    //   chainTypes={['solana', 'tron', 'movement']} // Ajusta las cadenas que necesites
    //   clientId="YOUR_TOMO_CLIENT_ID" // ¡¡¡REEMPLAZA ESTO CON TU CLIENT ID REAL!!!
    // >
    // <Component {...pageProps} />
    // </TomoContextProvider>

    <WagmiProvider config={configWagmi}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} /> 
          {/* Your App */}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

