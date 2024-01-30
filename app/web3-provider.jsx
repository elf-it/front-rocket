"use client"
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'

const chains = [bsc]
const projectId = 'a591bce1e850e4226ba6155c6fb1bff3' //'9d03105127dc27c29a3d794bd92c8299'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

export default function Web3ModalProvider({children}) {
    return (
      <>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
        <Web3Modal
            projectId={projectId}
            ethereumClient={ethereumClient}
            themeMode="light"
            themeVariables={{
              '--w3m-logo-image-url': '/logo.png',
              '--w3m-overlay-background-color': 'rgba(0, 0, 0, 0.3)',
              '--w3m-background-border-radius': '20px',
              '--w3m-container-border-radius': '20px',
              '--w3m-font-family': 'Roboto, sans-serif',
              '--w3m-accent-color': '#3396FF',
              '--w3m-accent-fill-color': '#ffffff'
            }}
          />
      </>
    );
  }