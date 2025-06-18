import { useState, useRef } from 'react';
import Head from "next/head";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { uploadJSONToIPFS, ipfsHashToBytes32, uploadFileToIPFS } from '../utils/ipfs';
import { getStoryClient } from '../utils/storyConfig';
import { IpMetadata } from '@story-protocol/core-sdk';
import { SPGNFTContractAddress, createCommercialRemixTerms } from '../utils/storyUtils';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Address, parseEther, zeroAddress } from 'viem'
import { Footer } from './portfolio';

const Header = () => {
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
          <Link href="/#features" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Benefits</span></Link>
          <Link href="/#how-it-works" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">How It Works</span></Link>
          <Link href="/gallery" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Gallery</span></Link>
          <Link href="/portfolio" passHref><span className="hover:text-blue-300 transition-colors cursor-pointer">Portfolio</span></Link>
        </nav>
        <div className="wallet"><ConnectButton /></div>
      </div>
    </header>
  );
};

Footer();

//Formulario para el registro de IP Assets
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    author: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    if (!isConnected || !walletClient) {
      setError("Please, connect your wallet to register an IP");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = '';
      if (imageFile) {
        const imageIpfsHash = await uploadFileToIPFS(imageFile);
        imageUrl = `ipfs://${imageIpfsHash}`;
      }

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
        image: imageUrl,
        imageHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        mediaUrl: '',
        mediaHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        mediaType: imageFile ? imageFile.type : 'text/plain',
      });

      const metadataIpfsHash = await uploadJSONToIPFS(ipMetadata);

      const metadataHashBytes32 = ipfsHashToBytes32(metadataIpfsHash);

      const response = await storyClientWithSigner.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: "0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF", //Dirección del contrato para la colección de NFTs
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

      setSuccess(`IP Asset succesfully registered: ${response.ipId}`);
      setFormData({ name: '', description: '', author: '' });
      setImageFile(null);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error al registrar el IP Asset');
    } finally {
      setIsLoading(false);
    }
  };

  /*
  //Método para creación de colección
  const newCollection = async () => {
    if (!isConnected || !walletClient) {
      setError("Please, connect your wallet to register an IP Asset.");
      return;
    }

    const storyClientWithSigner = getStoryClient(walletClient);

    const newCollectionResponse = await storyClientWithSigner.nftClient.createNFTCollection({
      name: "Mark3",
      symbol: "M3",
      isPublicMinting: true,
      mintOpen: true,
      mintFeeRecipient: zeroAddress,
      contractURI: "",
    });

    setTimeout(() => {
      console.log(
        `New SPG NFT collection created at transaction hash ${newCollectionResponse.txHash}`
      );
      console.log(`NFT contract address: ${newCollectionResponse.spgNftContract}`);
    }, 10000);
  }*/

  return (
    <div className={`min-h-screen bg-gray-800 text-white ${GeistSans.variable} ${GeistMono.variable} font-sans`}>
      <Head>
        <title>Register your IP Asset - Mark3</title>
        <meta name="description" content="Start the process of registering your intellectual property on the blockchain with Mark3."/>
      </Head>
      
      <Header />

      <main className="container mx-auto px-4 py-16 pt-32">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-300 mb-4">
          Register IP Asset
          </h2>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
              Here you can register your intellectual property using Mark3.
            </p>
          </div>

        {!isConnected && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-6 text-center">
              Please, connect your wallet to continue.
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

        <form onSubmit={handleSubmit} ref={formRef} className="max-w-2xl mx-auto bg-gray-700/50 p-8 rounded-xl">
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Name of your Intellectual Property:
            </label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
              Descripction:
            </label>
            <textarea 
              id="description" 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-300 text-sm font-bold mb-2">
            Upload File (e.g., PNG, JPG):
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              accept="image/*"
              disabled={!isConnected}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="author" className="block text-gray-300 text-sm font-bold mb-2">
              Author or Legal Owner:
            </label>
            <input 
              type="text" 
              id="author" 
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading || !isConnected}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors ${
              (isLoading || !isConnected) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing up...' : 'Register and Sign Transaction'}
          </button>

            <br></br> <br></br>

                     
        </form>
      </main>

      {/*<button 
            onClick={ newCollection }
            disabled={isLoading || !isConnected}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors ${
              (isLoading || !isConnected) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Create Collection
          </button>*/}
          
      <Footer />
    </div>
  );
}