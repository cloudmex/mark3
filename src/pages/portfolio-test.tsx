import Head from "next/head";
import { useEffect, useState } from "react";
import { useAccount } from 'wagmi';
import { Header, Footer } from "./portfolio";
import { GeistSans, GeistMono } from "geist/font";
import Link from "next/link";

const ALCHEMY_API_KEY = '0ACboN5FhM8HVBsTwH-H0y9WGfVQbT9T';
const BASE_URL = `https://story-aeneid.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}`;
const CONTRACT_ADDRESS = '0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF';

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
              {userNFTs.map((nft, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 p-6 rounded-xl shadow-xl hover:scale-105 transition-transform"
                >
                  {nft.image?.cachedUrl && (
                    <img
                      src={nft.image.cachedUrl}
                      alt={nft.title}
                      className="rounded-md mb-4 w-full h-48 object-cover"
                    />
                  )}
                  <h3 className="text-xl font-semibold text-green-400 mb-2">
                    {nft.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-400 mb-1">Tipo: {nft.tokenType}</p>
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
