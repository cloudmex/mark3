import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { getUserNFTs, formatNFTsList } from '../../utils/nftService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, history, hasTransactionIntent, wantsToSeeNFTs, walletAddress } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'API key de OpenAI no configurada' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Función para detectar si el usuario quiere ver sus NFTs
    const detectNFTRequest = (message: string): boolean => {
      const lowerMessage = message.toLowerCase();
      
      const patterns = [
        // Patrones que requieren wallet especificada
        /ver nfts de 0x/i,
        /mostrar nfts de 0x/i,
        /listar nfts de 0x/i,
        /qué nfts tiene 0x/i,
        /nfts de 0x/i,
        /tokens de 0x/i,
        /marcas registradas de 0x/i,
        /colección de 0x/i,
        
        // Patrones generales (que requerirán wallet especificada)
        /ver nfts/i,
        /mostrar nfts/i,
        /listar nfts/i,
        /qué nfts/i,
        /mis nfts/i,
        /mis tokens/i,
        /mis marcas registradas/i,
        /mis colecciones/i,
        /ver mi colección/i,
        /mostrar mi colección/i,
        /nfts/i,
        /tokens/i,
        /marcas registradas/i,
        /colección/i,
      ];

      return patterns.some(pattern => pattern.test(lowerMessage));
    };

    // Verificar si el usuario quiere ver sus NFTs (usar el parámetro enviado o detectar)
    const shouldSeeNFTs = wantsToSeeNFTs || detectNFTRequest(message);

    // Si quiere ver NFTs y tiene wallet, obtener los NFTs
    let nftResponse = '';
    if (shouldSeeNFTs && walletAddress) {
      try {
        const nfts = await getUserNFTs(walletAddress);
        nftResponse = formatNFTsList(nfts);
      } catch (error) {
        console.error('Error al obtener NFTs:', error);
        nftResponse = 'Sorry, I could not get the NFTs for you at this time. Please try again later.';
      }
    } else if (shouldSeeNFTs && !walletAddress) {
      nftResponse = 'To see NFTs, you need to specify a wallet address in the message. Example: "Show NFTs of 0x1234567890123456789012345678901234567890"';
    }

    // Construir el historial de mensajes para el contexto
    const messages = [
      {
        role: 'system' as const,
        content: `You are an AI assistant specialized in trademark registration, blockchain, and the Mark3 platform. 
        
        Your function is to help users with:
        - Information about trademark registration and intellectual property
        - Explanations about blockchain technology and its application in trademarks
        - Queries about the Mark3 platform and its services
        - Basic legal advice about trademark protection
        - Queries about user's NFTs and tokens
        
        IMPORTANT: If the user wants to register a trademark, you must:
        1. Confirm that you understand their request
        2. Explain that a form with specific data is needed
        3. Inform about the required data:
           - Trademark name (required)
           - Trademark description (required)
           - Trademark author (required)
           - IPFS image ID (required)
        4. Explain that the legal owner is automatically taken from the connected wallet
        5. Provide information about the benefits of on-chain registration
        
        IMPORTANT: If the user wants to see NFTs, you must:
        1. Confirm that you understand their request
        2. Provide information about the NFTs from the specified wallet
        3. Explain that they need to include the wallet address in the message
        4. Examples of valid patterns:
           - "Show NFTs of 0x1234..."
           - "What NFTs does 0x..."
           - "My registered trademarks of 0x..."
           - "Show collection of 0x..."
           - "NFTs of 0x..."
        5. The address must be complete (42 characters including 0x)
        
        Always respond in English in a clear, professional, and helpful manner. 
        If you don't have specific information about something, indicate it honestly.
        Maintain a friendly but professional tone.`
      },
      ...history,
      {
        role: 'user' as const,
        content: message
      }
    ];

    // Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    let response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Si el usuario quiere registrar una marca, agregar información adicional
    if (hasTransactionIntent) {
      response += `

## 🔗 Trademark Registration on Blockchain

I've detected that you want to register a trademark. To proceed, you'll need to complete a form with the following data:

### 📋 Required Data:
- **Trademark name** (required): The name that will identify your trademark
- **Description** (required): Detailed description of your trademark and its purpose
- **Author** (required): The author of the trademark
- **IPFS image ID** (required): The IPFS identifier where your trademark image is stored

### 👤 Legal Owner
Will be automatically taken from your connected wallet

### ✅ Benefits of on-chain registration:
- Total immutability and transparency
- Instant global verification
- Protection against counterfeiting
- Complete ownership history

### 💡 Next steps:
1. A form will be displayed to complete the data
2. Fill in all required fields
3. Confirm the transaction in your wallet
4. Your trademark will be registered on the blockchain!

Are you ready to proceed with the registration?`
    }

    // Si el usuario quiere ver NFTs, agregar la información de NFTs
    if (shouldSeeNFTs) {
      const walletInfo = `for wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
        
      response += `

## 🎨 NFT Query ${walletInfo}

${nftResponse}

### 💡 Additional information:
- The NFTs shown are from the wallet specified in the message
- Each NFT represents a trademark registered on the blockchain
- You can use token IDs for specific references
- Metadata includes complete information about each trademark

### 💡 To query other wallets:
- Include the complete address in your message: "Show NFTs of 0x1234567890123456789012345678901234567890"
- You can query any wallet without needing to connect it

Would you like to query another wallet?`
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error en el endpoint de chat:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
} 