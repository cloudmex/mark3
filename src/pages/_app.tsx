import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import { TomoContextProvider } from '@tomo-inc/tomo-web-sdk';
// import '@tomo-inc/tomo-web-sdk/style.css'; // Import Tomo SDK styles

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <TomoContextProvider
    //   theme="light" // o "dark" según prefieras
    //   chainTypes={['solana', 'tron', 'movement']} // Ajusta las cadenas que necesites
    //   clientId="YOUR_TOMO_CLIENT_ID" // ¡¡¡REEMPLAZA ESTO CON TU CLIENT ID REAL!!!
    // >
      <Component {...pageProps} />
    // </TomoContextProvider>
  );
}
