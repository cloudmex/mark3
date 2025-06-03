//Funciones de utilidad de IFPS

import axios from 'axios';
import { IPFS_CONFIG } from './storyConfig';

export const uploadJSONToIPFS = async (file: File) => { //Subir un archivo a IPFS
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
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

export const uploadMetadataToIPFS = async (metadata: any) => { //Subir metadatos a IPFS
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
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
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}; 