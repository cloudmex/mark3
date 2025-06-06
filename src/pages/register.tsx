import { useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { uploadJSONToIPFS, ipfsHashToBytes32 } from '../utils/ipfs';
import { getStoryClient } from '../utils/storyConfig';
import { IpMetadata } from '@story-protocol/core-sdk';
import { SPGNFTContractAddress, createCommercialRemixTerms } from '../utils/storyUtils';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Address, parseEther, zeroAddress } from 'viem'


//Formulario para el registro de IP Assets
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !walletClient) {
      setError("Por favor, conecta tu wallet para registrar un IP Asset.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const storyClientWithSigner = getStoryClient(walletClient);
      const ipMetadata: IpMetadata = storyClientWithSigner.ipAsset.generateIpMetadata({
        title: formData.name,
        description: formData.description,
        createdAt: Math.floor(Date.now() / 1000).toString(),
        creators: [ 
          {
            name: formData.author,
            address: address!,
            contributionPercent: 100,
          },
        ],
        image: '',
        imageHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        mediaUrl: '',
        mediaHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        mediaType: 'text/plain',
      });

      const metadataIpfsHash = await uploadJSONToIPFS(ipMetadata);

      const metadataHashBytes32 = ipfsHashToBytes32(metadataIpfsHash);

      const response = await storyClientWithSigner.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
          {
            terms: createCommercialRemixTerms({ defaultMintingFee: 1, commercialRevShare: 5 }),
          },
        ],
        ipMetadata: {
          ipMetadataURI: `ipfs://${metadataIpfsHash}`,
          ipMetadataHash: metadataHashBytes32,
          nftMetadataURI: `ipfs://${metadataIpfsHash}`,
          nftMetadataHash: metadataHashBytes32,
        },
        txOptions: { waitForTransaction: true },
      });

      setSuccess(`IP Asset registrado exitosamente! ID: ${response.ipId}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al registrar el IP Asset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-800 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans`}>
      <Head>
        <title>Registrar IP Asset - Mark3</title>
        <meta name="description" content="Registra tu propiedad intelectual en la blockchain" />
      </Head>

      {/*Elemento usado para conectar la wallet*/}
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
            <Link href="/" passHref>
                <span className="text-2xl font-bold text-blue-400 cursor-pointer hover:text-blue-300">
                    &larr; Volver a Inicio
                </span>
            </Link>
            <ConnectButton />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">Registrar IP Asset</h1>

        {!isConnected && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-6 text-center">
              Por favor, conecta tu wallet para continuar.
            </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-700/50 p-8 rounded-xl">
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Nombre de la Marca o Activo:
            </label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isConnected}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
              Descripción:
            </label>
            <textarea 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isConnected}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="author" className="block text-gray-300 text-sm font-bold mb-2">
              Autor o Propietario Legal:
            </label>
            <input 
              type="text" 
              id="author" 
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={!isConnected}
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading || !isConnected}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors ${
              (isLoading || !isConnected) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registrando...' : 'Registrar y Firmar Transacción'}
          </button>
        </form>
      </main>
    </div>
  );
}