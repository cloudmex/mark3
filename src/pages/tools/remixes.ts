import { LicenseTerms } from '@story-protocol/core-sdk';
import { zeroAddress } from 'viem';

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
    derivativesApproval: false,
    commercialRevShare: 0,
    commercialRevCeiling: 0n,
    derivativesReciprocal: true,
    derivativeRevCeiling: 0n,
    expiration: 0n, // 0 significa sin expiración
    currency: zeroAddress,
    uri: 'https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json',
  };
}; 