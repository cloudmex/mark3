import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { useEffect, useState } from "react";
import { publicClient } from "../utils/storyConfig";
import { SPGNFTContractAddress } from "../utils/storyUtils";
import { isAddress, zeroAddress } from "viem";
import { Footer } from "./portfolio";
import { useAccount, useWalletClient } from 'wagmi';
import { getStoryClient } from '../utils/storyConfig';
import { config } from '@/utils/config';
import { ConnectButton } from '@rainbow-me/rainbowkit';



//Endpoint para extraer los NFTs de Mark3.
const ALCHEMY_API_KEY = '0ACboN5FhM8HVBsTwH-H0y9WGfVQbT9T';
const BASE_URL = "https://story-aeneid.g.alchemy.com/nft/v3/" + ALCHEMY_API_KEY;
const CONTRACT_ADDRESS = '0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF';

// Interfaces para tipar los datos
interface NftMetadata {
  name: string;
  description: string;
  image: string;
}

interface MarcaItem {
  id: string;
  name: string;
  type: string;
  registrationDate: string;
  status: string;
  imageUrl: string;
  detailsUrl: string;
  metadata?: NftMetadata;
}

// ABI mínimo para interactuar con el contrato
const spgNftContract = {
  address: SPGNFTContractAddress,
  abi: [
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
      "name": "tokenURI",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const
}



//Método para la colección Mark3
export default function GaleriaPage() {

  const Header = () => (

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


  const [marcas, setMarcas] = useState<MarcaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  async function getTotalSupply(): Promise<number> {
    const url = `${BASE_URL}/getContractMetadata?contractAddress=${CONTRACT_ADDRESS}`;
    const response = await fetch(url);
    const data = await response.json();
    return Number(data.totalSupply);
  }

  async function getMetadataByTokenId(tokenId: number): Promise<any> {
    const url = `${BASE_URL}/getNFTMetadata?contractAddress=${CONTRACT_ADDRESS}&tokenId=${tokenId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  const fetchMarcas = async () => {
    setIsLoading(true);
  
    try {
      const url = `${BASE_URL}/getNFTsForContract?contractAddress=${CONTRACT_ADDRESS}&withMetadata=true&pageSize=100`;
      const response = await fetch(url);
      const data = await response.json();
  
      setMarcas(data.nfts || []);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };
  
 useEffect(() => {
    fetchMarcas();
  }, []);

  console.log(marcas);




  return (
    <>
      <Head>
        <title> Trademarks Gallery - Mark3</title>
        <meta
          name="description"
          content="Explore all the brands and IP Assets registered in Mark3."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen bg-gray-800 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans flex flex-col`}>
        
        <Header/>

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-12"> 
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-300 mb-4">
              Trademarks Gallery
            </h2>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
              Explore all the trademarks and IP Assets that have been registered in our platform.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">
              <p>Error loading trademarks: {error}</p>
            </div>
          ) : marcas.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {marcas.map((item: any) => (
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

                      <p className="text-sm text-gray-400 mb-1">Type: {item.tokenType}</p>

                      <p className="text-sm text-gray-400 mb-1">
                        Registered:{" "}
                        {item.raw?.metadata?.createdAt
                          ? new Date(Number(item.raw.metadata.createdAt) * 1000).toLocaleDateString()
                          : "No disponible"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400 mb-4">No hay marcas registradas para mostrar todavía.</p>
              <Link href="/register" passHref>
                <span className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-lg">
                  Register your Trademark
                </span>
              </Link>
            </div>
          )}
        </main >
        <Footer></Footer>
      </div >
    </>
  );
}
