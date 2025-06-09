import axios from 'axios';
import { IPFS_CONFIG } from './storyConfig';
import bs58 from 'bs58';
import { Hex, toHex } from 'viem';

export function ipfsHashToBytes32(ipfsHash: string): Hex {
    const decoded = bs58.decode(ipfsHash);
    // The actual hash is the last 32 bytes of the decoded buffer
    const hashBytes = decoded.slice(decoded.length - 32);
    return toHex(hashBytes);
}

export const uploadJSONToIPFS = async (jsonData: any) => {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${IPFS_CONFIG.pinataSecretKey}`,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const uploadFileToIPFS = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${IPFS_CONFIG.pinataSecretKey}`,
        },
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};
