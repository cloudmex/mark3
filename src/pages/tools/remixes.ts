import { LicenseTerms } from '@story-protocol/core-sdk';

// Dirección del contrato SPG NFT en la red Sepolia
export const SPGNFTContractAddress = '0x...'; // Reemplazar con la dirección correcta

// Función para crear términos de licencia comercial
export const createCommercialRemixTerms = ({
  defaultMintingFee = 1,
  commercialRevShare = 5,
}: {
  defaultMintingFee?: number;
  commercialRevShare?: number;
}): LicenseTerms => {
  return {
    transferable: true,
    royaltyPolicy: '0x...', // Reemplazar con la dirección correcta de la política de regalías
    commercialUse: true,
    commercialAttribution: true,
    commercialRevShare: commercialRevShare,
    commercialRevCeiling: 100,
    derivativeUse: true,
    derivativeAttribution: true,
    derivativeRevShare: 5,
    derivativeRevCeiling: 100,
    defaultMintingFee: defaultMintingFee,
    expiration: 0, // 0 significa sin expiración
  };
}; 