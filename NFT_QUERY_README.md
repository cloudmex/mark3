# NFT Query - Mark3

## Description

The NFT query functionality allows users to view all NFTs (trademarks) they own in their connected wallet, using the Alchemy API to obtain detailed information for each token.

## Features

- 🔍 **Automatic Query**: Detects when the user wants to see their NFTs
- 🎨 **Complete Information**: Shows metadata, images, and details of each NFT
- 🔗 **Wallet Integration**: Uses the connected wallet to get specific NFTs
- 📊 **Readable Format**: Presents information clearly and organized
- ⚡ **Fast Response**: Uses Alchemy API for efficient queries

## How It Works

### 1. Intent Detection

The system automatically detects when the user wants to see their NFTs using patterns such as:

- "My NFTs"
- "My tokens"
- "My trademarks"
- "View my NFTs"
- "Show my NFTs"
- "List my NFTs"
- "What NFTs do I have"
- "What tokens do I have"
- "My collections"
- "View my collection"
- "Show my collection"

### 2. Query Process

1. **Detection**: The chat detects the intent to query NFTs
2. **Validation**: Verifies that the wallet is connected
3. **Query**: Calls the Alchemy API with the wallet address
4. **Processing**: Formats the NFT information
5. **Response**: Shows the complete list of NFTs in the chat

## Alchemy API

### Endpoint Used

```
https://story-aeneid.g.alchemy.com/nft/v3/getNFTsForOwner?owner=${WALLET_ADDRESS}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=true&pageSize=100
```

### Parameters

- **owner**: User's wallet address
- **contractAddresses[]**: Story Protocol contract (`0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF`)
- **withMetadata**: Include complete metadata
- **pageSize**: Maximum 100 NFTs per query

### Response

```typescript
interface AlchemyNFTResponse {
  ownedNfts: NFTData[];
  totalCount: string;
  blockHash: string;
}

interface NFTData {
  contract: {
    address: string;
    name: string;
    symbol: string;
  };
  id: {
    tokenId: string;
    tokenMetadata?: {
      tokenType: string;
    };
  };
  title: string;
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
}
```

## Main Files

### `src/utils/nftService.ts`

Main service for querying NFTs:

```typescript
// Main function to get user's NFTs
export async function getUserNFTs(walletAddress: string): Promise<NFTData[]>

// Function to format the NFT list
export function formatNFTsList(nfts: NFTData[]): string

// Function to format individual NFT information
export function formatNFTInfo(nft: NFTData): string
```

### `src/pages/api/chat.ts`

Updated endpoint with NFT query detection:

```typescript
// NFT query intent detection
const detectNFTRequest = (message: string): boolean

// NFT query processing
if (wantsToSeeNFTs && walletAddress) {
  const nfts = await getUserNFTs(walletAddress);
  nftResponse = formatNFTsList(nfts);
}
```

### `src/pages/ai-chat.tsx`

Main page with query detection:

```typescript
// NFT query detection
const detectNFTRequest = (message: string): boolean

// Sending wallet address to endpoint
walletAddress: address || null
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
```

### Story Protocol Contract

```typescript
const CONTRACT_ADDRESS = "0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF";
```

## Usage

### For Users

1. **Connect your wallet** using RainbowKit
2. **Write in chat**: "View my NFTs" or "My trademarks"
3. **Receive information** of all your NFTs in readable format
4. **Explore details** of each individual NFT

### For Developers

#### Add New Detection Patterns

```typescript
const patterns = [
  /my nfts/i,
  /new pattern/i, // Add here
];
```

#### Customize Response Format

```typescript
export function formatNFTsList(nfts: NFTData[]): string {
  // Customize output format
  return `Custom format: ${nfts.length} NFTs`;
}
```

#### Add New Information Fields

```typescript
export function formatNFTInfo(nft: NFTData): string {
  return `
    **${nft.title}**
    ID: ${nft.id.tokenId}
    Description: ${nft.description}
    New field: ${nft.newField}
  `;
}
```

## Example Response

```
🎨 NFT Query

**🎨 Your NFTs (3 found):**

1. **My Trademark** (ID: 1)
📝 A trademark registered on the blockchain with complete protection
🖼️ Image: https://gateway.pinata.cloud/ipfs/QmX...
📅 Last updated: 15/12/2024
🔗 Contract: 0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF

2. **Brand Name** (ID: 2)
📝 Commercial brand for technology products
🖼️ Image: https://gateway.pinata.cloud/ipfs/QmY...
📅 Last updated: 14/12/2024
🔗 Contract: 0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF

3. **Logo Design** (ID: 3)
📝 Logo design for service company
🖼️ Image: https://gateway.pinata.cloud/ipfs/QmZ...
📅 Last updated: 13/12/2024
🔗 Contract: 0xa199Ee444d36674a0c7e27b79bc44ED546D50EbF

💡 Additional information:
- The NFTs shown are from your connected wallet
- Each NFT represents a trademark on the blockchain
- You can use token IDs for specific references
- Metadata includes complete information for each trademark

Would you like to know more about a specific NFT or make another query?
```

## Debug Logs

### NFT Service

```javascript
🔍 [NFT-SERVICE] Searching NFTs for wallet: 0x...
📡 [NFT-SERVICE] Query URL: https://story-aeneid.g.alchemy.com/...
✅ [NFT-SERVICE] NFTs found: 3
📋 [NFT-SERVICE] NFT data: [...]
```

### Chat API

```javascript
🎨 [CHAT-API] User wants to see NFTs, wallet: 0x...
✅ [CHAT-API] NFTs obtained successfully
```

## Limitations

- Requires connected wallet
- Maximum 100 NFTs per query
- Depends on Alchemy API availability
- Only shows NFTs from Story Protocol contract
- Requires internet connection

## Troubleshooting

### Error: "Wallet not connected"
- Verify that the wallet is connected
- Make sure you're on the correct network

### Error: "Could not get your NFTs"
- Check your internet connection
- Verify that Alchemy API is available
- Check that you have NFTs in the specified contract

### Error: "You don't have registered NFTs"
- Verify that you have NFTs in your wallet
- Make sure the NFTs are from the Story Protocol contract
- Check that you're on the correct network

## Upcoming Improvements

- [ ] Pagination for more than 100 NFTs
- [ ] Filters by NFT type
- [ ] Search by name or ID
- [ ] Data export
- [ ] Collection charts
- [ ] New NFT notifications
- [ ] Integration with more contracts
- [ ] Transaction history per NFT

## Contributing

To contribute to the NFT query functionality:

1. Fork the repository
2. Create a branch for your feature
3. Implement your changes
4. Test with different wallets and NFTs
5. Submit a pull request

## License

This project is under the same license as Mark3. 