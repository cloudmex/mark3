import { createConfig, http } from 'wagmi';
import { storyAeneid } from 'wagmi/chains';

export const config = createConfig({
  chains: [storyAeneid],
  transports: {
    [storyAeneid.id]: http(),
  },
});