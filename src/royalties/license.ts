
import { Address, toHex } from 'viem'
import { RoyaltyPolicyLRP, SPGNFTContractAddress, convertRoyaltyPercentToTokens, createCommercialRemixTerms } from '../utils/storyUtils'
import { aeneid, IPAssetClient, mainnet, NftClient, StoryClient, StoryConfig, WIP_TOKEN_ADDRESS} from '@story-protocol/core-sdk'
import { useState, useRef } from 'react';
import { Chain, createPublicClient, http, WalletClient, PublicClient, custom, getAddress } from 'viem'
import { useAccount, useWalletClient } from 'wagmi';
import { getStoryClient } from '../utils/storyConfig'
import { getAccount } from 'wagmi/actions';


// This is Ippy on Aeneid testnet. The license terms specify 1 $WIP mint fee
// and a 5% commercial rev share.
//Contrato con el método "claimAllRevenue"

const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5'
// This is the license terms the child IP used to become derivative.
const LICENSE_TERMS_ID: string = '96'
// This is a random derivative asset of Ippy for testing.
const CHILD_IP_ID: Address = '0x732AcAb7C31e4668a32299a22257DB4CA0e54312'

const main = async function () {
    // 1. Mint license tokens from the child
    //

    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const [error, setError] = useState<string | null>(null);



    if (!isConnected || !walletClient) {
        setError("Please, connect your wallet to register an IP");
        return;
      }

    // FOR SETUP: Create a new IP Asset we can use
    const storyClientWithSigner = getStoryClient(walletClient);


    // You will be paying for the License Token using $WIP:
    // https://aeneid.storyscan.xyz/address/0x1514000000000000000000000000000000000000
    // If you don't have enough $WIP, the function will auto wrap an equivalent amount of $IP into
    // $WIP for you.
    //
    // Docs: https://docs.story.foundation/sdk-reference/license#mintlicensetokens
    const mintTokens = await storyClientWithSigner.license.mintLicenseTokens({
        licenseTermsId: LICENSE_TERMS_ID,
        licensorIpId: CHILD_IP_ID,
        amount: 1,
        maxMintingFee: BigInt(0), // disabled
        maxRevenueShare: 100, // default
    })
    console.log('Minted license from child:', {
        'Transaction Hash': mintTokens.txHash,
    })

    // 2. Child Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const childClaimRevenue = await storyClientWithSigner.royalty.claimAllRevenue({
        ancestorIpId: CHILD_IP_ID,
        claimer: CHILD_IP_ID,
        currencyTokens: [WIP_TOKEN_ADDRESS],
        childIpIds: [],
        royaltyPolicies: [],
    })
    console.log('Child claimed revenue:', childClaimRevenue.claimedTokens)

    // 3. Parent Claim Revenue
    //
    // Docs: https://docs.story.foundation/sdk-reference/royalty#claimallrevenue
    const parentClaimRevenue = await storyClientWithSigner.royalty.claimAllRevenue({
        ancestorIpId: PARENT_IP_ID,
        claimer: PARENT_IP_ID,
        currencyTokens: [WIP_TOKEN_ADDRESS],
        childIpIds: [CHILD_IP_ID],
        royaltyPolicies: [RoyaltyPolicyLRP],
    })
    console.log('Parent claimed revenue receipt:', parentClaimRevenue.claimedTokens)
}

main()
