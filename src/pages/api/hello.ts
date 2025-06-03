// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import { http } from "viem";
import { Account, privateKeyToAccount, Address } from "viem/accounts";
import { aeneid, mainnet, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Chain, createPublicClient, createWalletClient, WalletClient } from 'viem'
import dotenv from 'dotenv'

dotenv.config()

// Network configuration types
type NetworkType = 'aeneid' | 'mainnet'

interface NetworkConfig {
    rpcProviderUrl: string
    blockExplorer: string
    protocolExplorer: string
    defaultNFTContractAddress: Address | null
    defaultSPGNFTContractAddress: Address | null
    chain: Chain
}

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

// Initialize client configuration
export const network = getNetwork()
validateEnvironmentVars();

// Conexión a la SDK de Story Protocol

const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`;
const account: Account = privateKeyToAccount(privateKey);

const config: StoryConfig = {
  account: account, // the account object from above
  transport: http(process.env.RPC_PROVIDER_URL),
  chainId: "aeneid",
};
//Set up client.
//Se exporta client
export const client = StoryClient.newClient(config);

export const networkInfo = {
    ...networkConfigs[network],
    rpcProviderUrl: process.env.RPC_PROVIDER_URL || networkConfigs[network].rpcProviderUrl,
}


// Export additional useful constants
export const PROTOCOL_EXPLORER = networkInfo.protocolExplorer

const baseConfig = {
    chain: networkInfo.chain,
    transport: http(networkInfo.rpcProviderUrl),
} as const
export const publicClient = createPublicClient(baseConfig)
export const walletClient = createWalletClient({
    ...baseConfig,
    account,
}) as WalletClient

//Registrar IP Asset

async function main() {
  const ipMetadata = {
    title: "Ippy",
    description: "Official mascot of Story.",
    image:
      "https://ipfs.io/ipfs/QmSamy4zqP91X42k6wS7kLJQVzuYJuW2EN94couPaq82A8",
    imageHash:
      "0x21937ba9d821cb0306c7f1a1a2cc5a257509f228ea6abccc9af1a67dd754af6e",
    mediaUrl:
      "https://ipfs.io/ipfs/QmSamy4zqP91X42k6wS7kLJQVzuYJuW2EN94couPaq82A8",
    mediaHash:
      "0x21937ba9d821cb0306c7f1a1a2cc5a257509f228ea6abccc9af1a67dd754af6e",
    mediaType: "image/png",
    creators: [
      {
        name: "Story Foundation",
        address: "0x67ee74EE04A0E6d14Ca6C27428B27F3EFd5CD084",
        description: "The World's IP Blockchain",
        contributionPercent: 100,
        socialMedia: [
          {
            platform: "Twitter",
            url: "https://twitter.com/storyprotocol",
          },
          {
            platform: "Website",
            url: "https://story.foundation",
          },
        ],
      },
    ],
  };
}

main();

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: "John Doe" });
}