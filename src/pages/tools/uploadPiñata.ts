import axios from 'axios';
import { IPFS_CONFIG } from '../../utils/storyConfig';

// Función para subir JSON a IPFS usando Pinata
export const uploadJSONToIPFS = async (jsonData: any) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: IPFS_CONFIG.pinataApiKey,
          pinata_secret_api_key: IPFS_CONFIG.pinataSecretKey,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}; 