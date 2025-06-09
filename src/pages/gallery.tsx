import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "./portfolio";
import { useEffect, useState } from "react";
import { publicClient } from "../utils/storyConfig";
import { SPGNFTContractAddress } from "../utils/storyUtils";
import { isAddress } from "viem";
import { Footer } from "./portfolio";

// Placeholder para el header, idealmente sería un componente importado
Header(); //Se hace la llamada a la importación del header de portfolio.tsx

// Placeholder para el footer
Footer();

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
            "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ],
            "name": "tokenURI",
            "outputs": [ { "internalType": "string", "name": "", "type": "string" } ],
            "stateMutability": "view",
            "type": "function"
        }
    ] as const
}

export default function GaleriaPage() {
  const [marcas, setMarcas] = useState<MarcaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchMarcas = async () => {
          setIsLoading(true);
          try {
              if (!isAddress(SPGNFTContractAddress) || SPGNFTContractAddress === '0x') {
                  throw new Error("La dirección del contrato SPG NFT no es válida.");
              }

              const totalSupply = await publicClient.readContract({
                  ...spgNftContract,
                  functionName: 'totalSupply'
              });

              const fetchedMarcas: MarcaItem[] = [];
              for (let i = 1; i <= Number(totalSupply); i++) {
                  const tokenId = BigInt(i);
                  try {
                    const tokenURI = await publicClient.readContract({
                        ...spgNftContract,
                        functionName: 'tokenURI',
                        args: [tokenId]
                    });
                    
                    const ipfsGateway = "https://ipfs.io/ipfs/";
                    const metadataUrl = tokenURI.startsWith("ipfs://")
                      ? `${ipfsGateway}${tokenURI.substring(7)}`
                      : tokenURI;

                    const metadataResponse = await fetch(metadataUrl);
                    if (!metadataResponse.ok) {
                        console.warn(`No se pudo obtener metadata para el token ${tokenId}: ${metadataResponse.statusText}`);
                        continue;
                    }
                    const metadata: NftMetadata = await metadataResponse.json();
                    
                    fetchedMarcas.push({
                        id: tokenId.toString(),
                        name: metadata.name || `Marca #${tokenId}`,
                        type: "Trademark / On-chain",
                        registrationDate: new Date().toISOString().split('T')[0], // Placeholder
                        status: "Active",
                        imageUrl: metadata.image ? (metadata.image.startsWith("ipfs://") ? `${ipfsGateway}${metadata.image.substring(7)}` : metadata.image) : `https://via.placeholder.com/150/808080/FFFFFF?text=No+Image`,
                        detailsUrl: `/gallery/${tokenId}`,
                        metadata: metadata
                    });
                  } catch (e) {
                      console.warn(`Error procesando el token ${tokenId}:`, e);
                  }
              }
              setMarcas(fetchedMarcas.reverse());
          } catch (err) {
              console.error("Error obteniendo las marcas:", err);
              setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
          } finally {
              setIsLoading(false);
          }
      };

      fetchMarcas();
  }, []);

  return (
    <>
      <Head>
        <title>Galería de Marcas - Mark3</title>
        <meta
          name="description"
          content="Explora todas las marcas y activos intelectuales registrados en la plataforma Mark3."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen bg-gray-800 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans flex flex-col`}>
        <Header />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-300 mb-4">
              Galería de Marcas Registradas
            </h2>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
              Explora todas las marcas y activos intelectuales que han sido registrados en nuestra plataforma.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400">Cargando marcas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">
              <p>Error al cargar las marcas: {error}</p>
            </div>
          ) : marcas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {marcas.map((item) => (
                <div key={item.id} className="bg-gray-700/50 p-6 rounded-xl shadow-xl flex flex-col justify-between transform hover:scale-105 transition-transform duration-300">
                  <div>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="rounded-md mb-4 w-full h-48 object-cover bg-gray-600"/>
                    )}
                    <h3 className="text-xl font-semibold text-green-400 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">Tipo: {item.type}</p>
                    <p className="text-sm text-gray-400 mb-1">Registrado: {item.registrationDate}</p>
                    <p className={`text-sm font-semibold ${item.status === 'Active' ? 'text-green-500' : 'text-yellow-500'} mb-4`}>
                      Estado: {item.status}
                    </p>
                  </div>
                  <Link href={item.detailsUrl} passHref>
                    <span className="block text-center mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer w-full">
                      Ver Detalles
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400 mb-4">No hay marcas registradas para mostrar todavía.</p>
              <Link href="/register" passHref>
                <span className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-lg">
                  Registra la Tuya
                </span>
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 