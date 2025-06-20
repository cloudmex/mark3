import { useState, useCallback } from 'react';
import { useAccount, useWalletClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, Address, Hex } from 'viem';
import { aeneid, IpMetadata } from '@story-protocol/core-sdk';
import { getStoryClient, } from '../utils/storyConfig';
import { createCommercialRemixTerms } from '../utils/storyUtils';


import { uploadJSONToIPFS, ipfsHashToBytes32 } from '../utils/ipfs';

export interface TrademarkRegistrationData {
  name: string;
  description: string;
  imageIpfsId: string; // ID de IPFS de la imagen
  author: string; // Autor de la marca
  legalOwner: Address; // Wallet del usuario (se toma automáticamente)
}

export interface TransactionState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  hash: Hex | null;
  receipt: any | null;
}

export function useStoryProtocolTransactions() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [transactionState, setTransactionState] = useState<TransactionState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    hash: null,
    receipt: null,
  });

  const { writeContract, isPending, isSuccess, isError, error, data: hash } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  // Función para registrar una marca
  const registerTrademark = useCallback(async (trademarkData: TrademarkRegistrationData) => {
    if (!isConnected || !address) {
      const errorMsg = 'Wallet not connected. Please connect your wallet first.';
      console.error('Error: Wallet not connected');
      setTransactionState(prev => ({
        ...prev,
        isError: true,
        error: errorMsg
      }));
      return false;
    }

    setTransactionState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
      receipt: null,
    });


    try {

      if (!walletClient) {
        throw new Error('Wallet client not available');
      }

      const storyClientWithSigner = getStoryClient(walletClient);

      const ipMetadata: IpMetadata = storyClientWithSigner.ipAsset.generateIpMetadata({
        title: trademarkData.name,
        description: trademarkData.description,
        createdAt: Math.floor(Date.now() / 1000).toString(),
        creators: [ 
          {
            name: trademarkData.author,
            address: address!,
            contributionPercent: 100,
          },
        ],
        image: trademarkData.imageIpfsId,
        imageHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        mediaUrl: '',
        mediaHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        mediaType: 'text/plain',  
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


      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error registering trademark';
      console.error('Error registering trademark:', err);
      
      setTransactionState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: errorMessage
      }));
      return false;
    }
  }, [isConnected, address, writeContract, walletClient]);


  // Actualizar estado cuando cambie la transacción
  if (hash && !transactionState.hash) {
    setTransactionState(prev => ({ ...prev, hash }));
  }

  if (isConfirming && !transactionState.isLoading) {
    setTransactionState(prev => ({ ...prev, isLoading: true }));
  }

  if (isConfirmed && !transactionState.isSuccess) {
    setTransactionState(prev => ({ 
      ...prev, 
      isLoading: false, 
      isSuccess: true, 
      receipt 
    }));
  }

  if (isError && !transactionState.isError) {
    const errorMsg = error?.message || 'Error in transaction';
    console.error('Error in transaction:', errorMsg);
    setTransactionState(prev => ({ 
      ...prev, 
      isLoading: false, 
      isError: true, 
      error: errorMsg
    }));
  }

  const resetTransaction = useCallback(() => {
    setTransactionState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
      hash: null,
      receipt: null,
    });
  }, []);

  return {
    registerTrademark,
    transactionState,
    resetTransaction,
    isConnected,
    address,
  };
}

// Funciones auxiliares para codificar datos de transacción
function encodeTrademarkRegistration(data: TrademarkRegistrationData): Hex {
  // En un caso real, esto usaría la ABI de Story Protocol
  // Por ahora, creamos datos de ejemplo
  const transactionPayload = {
    action: 'register_trademark',
    name: data.name,
    description: data.description,
    imageIpfsId: data.imageIpfsId,
    author: data.author,
    legalOwner: data.legalOwner,
    timestamp: Date.now()
  };
  
  const encodedData = `0x${Buffer.from(JSON.stringify(transactionPayload)).toString('hex')}`;
  
  return encodedData as Hex;
}

function encodeTrademarkTransfer(trademarkId: string, toAddress: Address): Hex {
  const transactionPayload = {
    action: 'transfer_trademark',
    trademarkId,
    to: toAddress,
    timestamp: Date.now()
  };
  
  const encodedData = `0x${Buffer.from(JSON.stringify(transactionPayload)).toString('hex')}`;
  
  return encodedData as Hex;
}

function encodeTrademarkLicense(trademarkId: string, licensee: Address, terms: string): Hex {
  const transactionPayload = {
    action: 'license_trademark',
    trademarkId,
    licensee,
    terms,
    timestamp: Date.now()
  };
  
  const encodedData = `0x${Buffer.from(JSON.stringify(transactionPayload)).toString('hex')}`;
  
  return encodedData as Hex;
}

// Utilidades para formatear información de transacciones
export const formatTransactionHash = (hash: Hex): string => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

export const getExplorerUrl = (hash: Hex): string => {
  // URL del explorador de Aeneid (Story Protocol)
  return `https://explorer.aeneid.network/tx/${hash}`;
};

// Función para validar los datos de registro de marca
export function validateTrademarkData(data: Partial<TrademarkRegistrationData>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Trademark name is required');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }

  if (!data.author || data.author.trim().length === 0) {
    errors.push('Author is required');
  }

  if (!data.imageIpfsId || data.imageIpfsId.trim().length === 0) {
    errors.push('IPFS image ID is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
} 