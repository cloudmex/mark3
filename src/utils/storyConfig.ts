//Archivo para la configuración de Story Protocol

//Importación de dependencias
import { aeneid, mainnet, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Chain, createPublicClient, createWalletClient, http, WalletClient } from 'viem'
import { privateKeyToAccount, Address, Account } from 'viem/accounts'
import dotenv from 'dotenv'
import { networkInfo } from '@/pages/api/hello';

//Función para la configuración de las variables de entorno.
dotenv.config(); 

//Configuración de los tipos de red.
//Aeneid es la red de prueba de Story Protocol. Por otro lado, mainnet es la red principal.
type NetworkType = 'aeneid' | 'mainnet'

//Configuración para agregar las redes.
export interface NetworkConfig {
  rpcProviderUrl: string
  blockExplorer: string
  protocolExplorer: string
  defaultNFTContractAddress: Address | null
  defaultSPGNFTContractAddress: Address | null
  chain: Chain
};

// Configuración del cliente de Story Protocol


// Network configurations
const networkConfigs: Record<NetworkType, NetworkConfig> = {
    aeneid: {
        rpcProviderUrl: 'https://aeneid.storyrpc.io',
        blockExplorer: 'https://aeneid.storyscan.io',
        protocolExplorer: 'https://aeneid.explorer.story.foundation',
        defaultNFTContractAddress: '0x937bef10ba6fb941ed84b8d249abc76031429a9a' as Address,
        defaultSPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc' as Address,
        chain: aeneid,
    },
    mainnet: {
        rpcProviderUrl: 'https://mainnet.storyrpc.io',
        blockExplorer: 'https://storyscan.io',
        protocolExplorer: 'https://explorer.story.foundation',
        defaultNFTContractAddress: null,
        defaultSPGNFTContractAddress: '0x98971c660ac20880b60F86Cc3113eBd979eb3aAE' as Address,
        chain: mainnet,
    },
} as const

// Helper functions
const validateEnvironmentVars = () => {
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error('WALLET_PRIVATE_KEY is required in .env file')
    }
}

const getNetwork = (): NetworkType => {
  const network = process.env.STORY_NETWORK as NetworkType
  if (network && !(network in networkConfigs)) {
      throw new Error(`Invalid network: ${network}. Must be one of: ${Object.keys(networkConfigs).join(', ')}`)
  }
  return network || 'aeneid'
}

export const network = getNetwork()
validateEnvironmentVars()


export const storyConfig: StoryConfig = {
  chainId: network,
  transport: http(networkInfo.rpcProviderUrl),
  account: process.env.NEXT_PUBLIC_WALLET_ADDRESS as `0x${string}`,
};

// Crear el cliente de Story Protocol
export const storyClient = StoryClient.newClient(storyConfig);

// Direcciones de los contratos de Story Protocol
export const CONTRACT_ADDRESSES = {
  SPG_NFT: '0x...', // Reemplazar con la dirección correcta del contrato SPG NFT
  LICENSING: '0x...', // Reemplazar con la dirección correcta del contrato de licencias
};

// Configuración de IPFS
export const IPFS_CONFIG = {
  pinataApiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretKey: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
}; 