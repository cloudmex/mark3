export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface NFTData {
  contract: {
    address: string;
    name: string;
    symbol: string;
  };
  
  tokenId: string;
  tokenMetadata?: {
    tokenType: string;
  };
  name: string;
  description: string;
  tokenUri?: {
    raw: string;
    gateway: string;
  };
  media?: Array<{
    raw: string;
    gateway: string;
    thumbnail: string;
    format: string;
    bytes: number;
  }>;
  metadata?: NFTMetadata;
  timeLastUpdated: string;
  image?:{
    cachedUrl: string;
    originalUrl: string;
    thumbnailUrl: string;
    format: string;
    size: number;
    contentType: string;
  }
}

export interface AlchemyNFTResponse {
  ownedNfts: NFTData[];
  totalCount: string;
  blockHash: string;
}

const ALCHEMY_API_KEY = '0ACboN5FhM8HVBsTwH-H0y9WGfVQbT9T';
const CONTRACT_ADDRESS = "0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF"; // Contrato de Story Protocol

export async function getUserNFTs(walletAddress: string): Promise<NFTData[]> {
  try {
    // Validar wallet address
    if (!walletAddress || walletAddress.length !== 42) {
      throw new Error('Wallet address inválida');
    }
    
    const url = `https://story-aeneid.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${walletAddress}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=true&pageSize=100`;
    console.log(url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: AlchemyNFTResponse = await response.json();
    
    return data.ownedNfts || [];
  } catch (error) {
    console.error('Error al obtener NFTs:', error);
    throw new Error(`Error al obtener NFTs: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

export function formatNFTInfo(nft: NFTData): string {
  const tokenId = nft.tokenId;
  const name = nft.name || nft.metadata?.name || `NFT #${tokenId}`;
  const description = nft.description || nft.metadata?.description || 'No description';
  const imageUrl = nft.image?.originalUrl || nft.metadata?.image || nft.media?.[0]?.gateway || '';
  
  let result = `### ${name} (ID: ${tokenId})

📝 **Description:** ${description}

📅 **Last updated:** ${new Date(nft.timeLastUpdated).toLocaleDateString('en-US')}

🔗 **Contract:** ${nft.contract.address}`;

  // Agregar imagen si existe
  if (imageUrl) {
    result += `

![${name}](${imageUrl})`;
  }

  result += `

---`;

  return result;
}

export function formatNFTsList(nfts: NFTData[]): string {
  if (nfts.length === 0) {
    return "You don't have any NFTs registered in your wallet.";
  }

  const nftList = nfts.map((nft) => {
    return formatNFTInfo(nft);
  }).join('\n\n');

  const result = `## 🎨 Your NFTs (${nfts.length} found)

${nftList}`;

  return result;
} 