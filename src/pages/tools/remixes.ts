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
    defaultMintingFee: BigInt(defaultMintingFee),
    commercialAttribution: true,
    commercializerChecker: '0x...',
    commercializerCheckerData: '0x...',
    derivativesAllowed: true,
    derivativesAttribution: true,
    commercialRevShare: 0,
    commercialRevCeiling: 0n,
    derivativesReciprocal: true,
    derivativeRevCeiling: 0n,
    expiration: 0n, // 0 significa sin expiración
  };
}; 