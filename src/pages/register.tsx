import { useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { uploadJSONToIPFS } from '../utils/ipfs';
import { client } from '../utils/storyConfig';
import { IpMetadata } from '@story-protocol/core-sdk';
import { SPGNFTContractAddress, createCommercialRemixTerms } from '../utils/storyUtils';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
        title: formData.name,
        description: formData.description,
        createdAt: Math.floor(Date.now() / 1000).toString(),
        creators: [ 
          {
            name: formData.author,
            address: '0x0000000000000000000000000000000000000000', // Dirección por defecto
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

      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
          {
            terms: createCommercialRemixTerms({ defaultMintingFee: 1, commercialRevShare: 5 }),
          },
        ],
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${metadataIpfsHash}`,
          ipMetadataHash: metadataIpfsHash,
          nftMetadataURI: `https://ipfs.io/ipfs/${metadataIpfsHash}`,
          nftMetadataHash: metadataIpfsHash,
        },
        txOptions: { waitForTransaction: true },
      });

      setSuccess(`IP Asset registrado exitosamente! ID: ${response.ipId}`);
    } catch (err) {
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

      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Registrar IP Asset</h1>

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
              Nombre:
            </label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
            />
          </div>

          <div className="mb-6">
            <label htmlFor="author" className="block text-gray-300 text-sm font-bold mb-2">
              Autor:
            </label>
            <input 
              type="text" 
              id="author" 
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registrando...' : 'Registrar IP Asset'}
          </button>
        </form>
      </main>
    </div>
  );
}