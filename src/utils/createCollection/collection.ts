//Importaciones
import { useState, useRef } from 'react';
import { Address, parseEther, zeroAddress } from 'viem'
import { useAccount, useWalletClient } from 'wagmi';
import { getStoryClient } from '../storyConfig';


  //Método para creación de colección
  const newCollection = async () => {

    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();

    const [error, setError] = useState<string | null>(null);


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
  }