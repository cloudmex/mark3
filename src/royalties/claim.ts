import { WIP_TOKEN_ADDRESS } from "@story-protocol/core-sdk";
import { getStoryClient } from '@/utils/storyConfig'
import { Address, parseEther, zeroAddress } from 'viem'
import { RoyaltyPolicyLRP } from '../utils/storyUtils'
import { useState, useRef } from 'react';
import { convertRoyaltyPercentToTokens, createCommercialRemixTerms, SPGNFTContractAddress } from '../utils/storyUtils'
import { aeneid, IPAssetClient, mainnet, NftClient, StoryClient, StoryConfig } from '@story-protocol/core-sdk'
import { Chain, createPublicClient, http, WalletClient, PublicClient, custom, getAddress } from 'viem'
import { useAccount, useWalletClient } from 'wagmi';
import { getAccount } from 'wagmi/actions';



// TODO: You can change this.
//Contrato con el método "claimAllRevenue"
const IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'

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



    // 1. Check if there is any revenue to claim

    const claimableRevenue = await storyClientWithSigner.royalty.claimableRevenue({
        claimer: IP_ID,
        royaltyVaultIpId: IP_ID,
        token: WIP_TOKEN_ADDRESS,
    })
    console.log('Claimable revenue:', claimableRevenue)

    if (claimableRevenue > 0) {
        // 2. Claim Revenue
        //
        // Docs: https://docs.story.foundation/sdk-reference/royalty#claimrevenue
        const claim = await storyClientWithSigner.royalty.claimAllRevenue({
            ancestorIpId: IP_ID,
            claimer: IP_ID,
            currencyTokens: [WIP_TOKEN_ADDRESS],
            childIpIds: [],
            royaltyPolicies: [],
        })
        console.log('Claimed revenue:', claim.claimedTokens)
    } else {
        console.log('No revenue to claim')
    }
}

main()