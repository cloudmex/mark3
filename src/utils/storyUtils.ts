import { storyClient } from '../lib/storyProtocol';
import { IPAssetClient } from '@story-protocol/core-sdk';
import { Address, parseEther, zeroAddress } from 'viem'
import { network, NetworkConfig } from '../utils/storyConfig';

//Función para registrar un nuevo IP Asset

export const registerIPAsset = async (
  name: string,
  description: string,
  metadata: any,
  ownerAddress: string
): Promise<IPAssetClient> => {
  try {
    const ipAsset = await storyClient.ipAsset.register({
      name,
      description,
      metadata,
      owner: ownerAddress,
    });
    return ipAsset;
  } catch (error) {
    console.error('Error al registrar IP Asset:', error);
    throw error;
  }
};

// Función para obtener un IP Asset por su ID
export const getIPAsset = async (ipAssetId: string): Promise<IPAssetClient> => {
  try {
    const ipAsset = await storyClient.ipAsset.get(ipAssetId);
    return ipAsset;
  } catch (error) {
    console.error('Error al obtener IP Asset:', error);
    throw error;
  }
};

// Función para listar todos los IP Assets de un propietario
export const listOwnerIPAssets = async (ownerAddress: string): Promise<IPAssetClient[]> => {
  try {
    const ipAssets = await storyClient.ipAsset.listByOwner(ownerAddress);
    return ipAssets;
  } catch (error) {
    console.error('Error al listar IP Assets:', error);
    throw error;
  }
}; 


// Export contract addresses with appropriate defaults based on network
export const NFTContractAddress: Address =
    (process.env.NFT_CONTRACT_ADDRESS as Address) || network.defaultNFTContractAddress || zeroAddress

export const SPGNFTContractAddress: Address =
    (process.env.SPG_NFT_CONTRACT_ADDRESS as Address) || network.defaultSPGNFTContractAddress || zeroAddress


    