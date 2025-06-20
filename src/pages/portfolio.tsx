import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { useEffect, useState } from "react";
import { publicClient } from "../utils/storyConfig";
import { SPGNFTContractAddress } from "../utils/storyUtils";
import { isAddress, zeroAddress } from "viem";
import { useAccount, useWalletClient } from 'wagmi';
import { getStoryClient } from '../utils/storyConfig';
import { config } from '@/utils/config';
import { ConnectButton } from '@rainbow-me/rainbowkit';


//Endpoint para extraer los NFTs.
const ALCHEMY_API_KEY = '0';
const BASE_URL = `https://story-aeneid.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`;
//Dirección de contrato de la colección de los NFTs.
const CONTRACT_ADDRESS = '0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF';

// Componente Header exportado para uso en otros archivos
export const Header = () => {
  const { isConnected } = useAccount();
  
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-md shadow-lg fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
          <h1 className="text-3xl font-bold text-blue-400 cursor-pointer">
            Mark<span className="text-green-400">3</span>
          </h1>
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/#features" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Features</span></Link>
          <Link href="/#how-it-works" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">How It Works</span></Link>
          <Link href="/gallery" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Gallery</span></Link>
          <Link href="/portfolio" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Portfolio</span></Link>
                  <Link href={isConnected ? "/register" : "#"} passHref>
                  <span className={`font-semibold px-4 py-2 rounded-lg transition-colors ${
                    isConnected 
                      ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                      : 'bg-gray-500 cursor-not-allowed'
                  }`}>
                    Register Trademark
                  </span>
                </Link>
                </nav>
                {/*Elemento usado para conectar la wallet*/}
            <div className="wallet"><ConnectButton /></div> 
            </div>  
    </header>
  );
};

//Se muestran los IP Assets creados por el usuario.
export default function PortfolioPage() {

  const { address, isConnected } = useAccount();

  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserNFTs = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      const url = `${BASE_URL}/getNFTsForOwner?owner=${address}&contractAddresses[]=${CONTRACT_ADDRESS}`;
      const response = await fetch(url);
      const data = await response.json();
      setUserNFTs(data.ownedNfts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) fetchUserNFTs();
  }, [isConnected, address]);

  return (
    <>
      <Head>
        <title>My Portfolio - Mark3</title>
      </Head>

      <div className={`min-h-screen bg-gray-900 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans flex flex-col`}>
        <Header />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-blue-300">My Registered Trademarks</h2>
            <p className="text-gray-400 mt-4">View the trademarks you've registered in the Mark3 platform.</p>
          </div>

          {!isConnected ? (
            <div className="text-center text-yellow-400">
              <p>Please connect your wallet to see your portfolio.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400">Loading your NFTs...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-400">
              <p>Error: {error}</p>
            </div>
          ) : userNFTs.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 mb-4">You haven't registered any trademarks yet.</p>
              <Link href="/register">
                <span className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg">
                  Register your Trademark
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userNFTs.map((item: any) => (
                  <div
                    key={item.tokenId}
                    className="bg-gray-700/50 p-6 rounded-xl shadow-xl flex flex-col justify-between transform hover:scale-105 transition-transform duration-300"
                  >
                    <div>
                      {item.image?.cachedUrl && (
                        <img
                          src={item.image.cachedUrl}
                          alt={item.name}
                          className="rounded-md mb-4 w-full h-48 object-cover bg-gray-600"
                        />
                      )}

                      <h3 className="text-xl font-semibold text-green-400 mb-2">{item.name || 'Sin nombre'}</h3>

                      <p className="text-sm text-gray-400 mb-1">Tipo: {item.tokenType}</p>

                      <p className="text-sm text-gray-400 mb-1">
                        Registrado:{" "}
                        {item.raw?.metadata?.createdAt
                          ? new Date(Number(item.raw.metadata.createdAt) * 1000).toLocaleDateString()
                          : "No disponible"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

// Placeholder para el footer, igual que en register.tsx

export const Footer = () => (
  <footer className="py-12 bg-gray-900 border-t border-gray-700">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Mark3. All rights reserved.
      </p>
    </div>
  </footer>
);
