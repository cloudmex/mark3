import { useState, useRef } from 'react';
import { convertRoyaltyPercentToTokens, createCommercialRemixTerms, SPGNFTContractAddress } from '../utils/storyUtils'
import { aeneid, IPAssetClient, mainnet, NftClient, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Chain, createPublicClient, http, WalletClient, PublicClient, custom, Address, getAddress } from 'viem'
import { useAccount, useWalletClient } from 'wagmi';
import { getStoryClient } from '../utils/storyConfig'
import { getAccount } from 'wagmi/actions';

const main = async function () {

    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [error, setError] = useState<string | null>(null);



    if (!isConnected || !walletClient) {
        setError("Please, connect your wallet to register an IP");
        return;
      }

    // FOR SETUP: Create a new IP Asset we can use
    const storyClientWithSigner = getStoryClient(walletClient);


    const parentIp = await storyClientWithSigner.ipAsset.mintAndRegisterIpAssetWithPilTerms({
       
       
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
            {
                terms: createCommercialRemixTerms({ defaultMintingFee: 0, commercialRevShare: 0 }),
            },
        ],
    })
    console.log('Parent IPA created:', {
        'Transaction Hash': parentIp.txHash,
        'IPA ID': parentIp.ipId,
        'License Terms ID': parentIp.licenseTermsIds?.[0],
    })

    // FOR SETUP: Mint a license token in order to trigger IP Royalty Vault deployment
    const mintLicense = await storyClientWithSigner.license.mintLicenseTokens({
        licenseTermsId: parentIp.licenseTermsIds?.[0]!,
        licensorIpId: parentIp.ipId as Address,
        amount: 1,
        maxMintingFee: BigInt(0), // disabled
        maxRevenueShare: 100, // default
    })
    console.log('Minted license:', {
        'Transaction Hash': mintLicense.txHash,
        'License Token ID': mintLicense.licenseTokenIds?.[0],
    })

    // Get the IP Royalty Vault Address
    // Note: This is equivalent to the currency address of the ERC-20
    // Royalty Tokens.
    const royaltyVaultAddress = await storyClientWithSigner.royalty.getRoyaltyVaultAddress(parentIp.ipId as Address)
    console.log('Royalty Vault Address:', royaltyVaultAddress)

    // Transfer the Royalty Tokens from the IP Account to the address
    // executing this transaction (you could use any other address as well)
    const transferRoyaltyTokens = await storyClientWithSigner.ipAccount.transferErc20({
        ipId: parentIp.ipId as Address,
        tokens: [
            {
                address: royaltyVaultAddress,
                amount: convertRoyaltyPercentToTokens(1),
                target: walletClient.account.address,
            },
        ],
    })
    console.log('Transferred royalty tokens:', { 'Transaction Hash': transferRoyaltyTokens.txHash })
}

main()