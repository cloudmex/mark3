# Blockchain Transactions in AI Chat - Mark3

## Description

The transaction system integrated into AI Chat allows users to register trademarks directly from their conversation with the AI, using their connected wallet and Story Protocol technology. The system requests all required data for a complete and valid registration.

## Features

- 🤖 **Automatic Detection**: The chat automatically detects when the user wants to register a trademark
- 📋 **Complete Form**: Requests all required data for registration
- 🔗 **Wallet Integration**: Uses the connected wallet to execute transactions
- 📝 **On-chain Registration**: Registers trademarks directly on the Story Protocol blockchain
- ⚡ **Real-time Transactions**: Real-time transaction status
- 🔍 **Integrated Explorer**: Direct links to block explorer
- ✅ **Data Validation**: Validates that all required fields are complete

## Required Data for Registration

### Required Fields:
- **Trademark Name**: The name that will identify the trademark on the blockchain
- **Description**: Detailed description of the trademark and its purpose
- **Author**: The author or creator of the trademark
- **IPFS Image ID**: The IPFS identifier where the image is stored

### Automatic Data:
- **Legal Owner**: Automatically taken from the user's connected wallet

## How It Works

### 1. Intent Detection

The system automatically detects when the user wants to register a trademark using patterns such as:

- "I want to register a trademark"
- "Register a trademark"
- "I want to register my trademark"
- "Register a trademark"
- "I need to register a trademark"
- "I wish to register a trademark"

### 2. Complete Registration Process

1. **Detection**: The chat detects the registration intent
2. **Information**: The AI explains the required data and process
3. **Form**: A 2-step form is shown to collect data
4. **Validation**: All required fields are validated
5. **Transaction**: The user confirms in their wallet
6. **Confirmation**: Transaction status is shown
7. **Success**: The trademark is registered on the blockchain

### 3. Registration Form

The form is divided into 2 steps:

**Step 1: Basic Information**
- Trademark name
- Description

**Step 2: Image and Confirmation**
- IPFS image ID
- Summary of all entered data

## Main Files

### `src/utils/storyProtocolTransactions.ts`
Custom hook for handling Story Protocol transactions:

```typescript
export interface TrademarkRegistrationData {
  name: string;           // Required
  description: string;    // Required
  author: string;         // Required
  imageIpfsId: string;    // Required
  legalOwner: Address;    // Automatic (wallet)
}
```

### `src/components/TrademarkRegistrationForm.tsx`
Complete 3-step form for collecting data:

```typescript
// Data validation
export const validateTrademarkData = (data) => {
  // Validates required fields
  // Returns errors if data is missing
}
```

### `src/pages/ai-chat.tsx`
Main chat page with complete integration:

```typescript
// Intent detection
const detectTrademarkRegistration = (message: string) => {
  // Improved detection patterns
}

// Form handling
const handleTrademarkRegistration = async (data) => {
  // Validation and transaction execution
}
```

## Configuration

### 1. Connected Wallet

The user must have their wallet connected to execute transactions:

```typescript
const { isConnected } = useAccount();
```

### 2. Story Protocol

The system uses Story Protocol contracts configured in `_app.tsx`:

```typescript
const configWagmi = getDefaultConfig({
  chains: [aeneid], // Story Protocol chain
});
```

## Usage

### For Users

1. **Connect your wallet** using RainbowKit
2. **Write in chat**: "I want to register a trademark"
3. **Complete the form** with all required data:
   - Trademark name
   - Description
   - Trademark author
   - IPFS image ID
4. **Confirm the transaction** in your wallet
5. **Wait for confirmation** on the blockchain

### For Developers

#### Add New Transaction Types

```typescript
// In storyProtocolTransactions.ts
const transferTrademark = useCallback(async (trademarkId, toAddress) => {
  // Transfer logic
}, []);
```

#### Customize Validations

```typescript
// In storyProtocolTransactions.ts
export const validateTrademarkData = (data) => {
  // Add new validations
  if (!data.newField) {
    errors.push('New field required');
  }
};
```

#### Modify the Form

```typescript
// In TrademarkRegistrationForm.tsx
const renderStep4 = () => (
  // Add new steps to the form
);
```

## Transaction States

### Loading
- Shows spinner and processing message
- Includes transaction hash if available
- Disables form during process

### Success
- Shows success confirmation
- Includes link to block explorer
- Transaction hash for verification
- Automatically closes the form

### Error
- Shows specific error message
- Allows retrying the transaction
- Keeps form data

## Validations

### Required Fields
- **Name**: Cannot be empty
- **Description**: Cannot be empty
- **IPFS ID**: Must be a valid identifier

### Additional Validations
- **Connected wallet**: Required to execute transactions
- **Data format**: Specific format validation
- **Field length**: Appropriate character limits

## Security

- **Wallet validation**: Verifies that the wallet is connected
- **Data validation**: Validates all fields before sending
- **Error handling**: Captures and displays errors securely
- **User confirmation**: Requires explicit confirmation
- **Automatic legal owner**: Taken from connected wallet

## Limitations

- Requires connected wallet
- Depends on Story Protocol network availability
- Transactions may fail due to insufficient gas or funds
- Only works on configured network (Aeneid)
- Requires valid IPFS ID for image

## Troubleshooting

### Error: "Wallet not connected"
- Verify that the wallet is connected
- Make sure you're on the correct network

### Error: "Missing required data"
- Complete all required fields
- Verify that fields are not empty

### Error: "Invalid IPFS ID"
- Verify that the IPFS ID is correct
- Make sure the image is uploaded to IPFS

### Error: "Transaction failed"
- Verify that you have sufficient funds
- Check that you're on the correct network
- Review logs for more details

## Upcoming Improvements

- [ ] Automatic image upload to IPFS
- [ ] Image preview from IPFS
- [ ] Search for existing trademarks
- [ ] Transaction history
- [ ] Push notifications
- [ ] Support for multiple networks
- [ ] Automatic gas estimation
- [ ] Integration with more transaction types
- [ ] Support for trademark NFTs

## Contributing

To contribute to the transaction functionality:

1. Fork the repository
2. Create a branch for your feature
3. Implement your changes
4. Test transactions on testnet
5. Submit a pull request

## License

This project is under the same license as Mark3. 