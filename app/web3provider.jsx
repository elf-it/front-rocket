"use client"
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from "wagmi/providers/alchemy"
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import contractData from "../contractData.json"

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [bsc],
    [
        publicProvider(),
        alchemyProvider({ apiKey: "" }),
        jsonRpcProvider({
            rpc: () => ({
                http: contractData.net //'https://bsc-dataseed.binance.org',
            }),
        })
    ]
)
/*
const config = createConfig({
    autoConnect: true,
    connectors: [
        new InjectedConnector({
            chains,
            options: {
                name: 'Metamask',
                shimDisconnect: true,
            },
        }),
    ],
    publicClient,
    jsonRpcProvider,
    webSocketPublicClient
})
*/
const config = createConfig(
    getDefaultConfig({
        chains,
        publicClient,
        appName: "Rocket Science",
        appDescription: "Rocket Science",
        appUrl: "https://rocketone.space",
        appIcon: "https://rocketone.space/logo.png",
    })
  )

export default function Web3Provider({ children }){
    return(
        <WagmiConfig config={config}>
            <ConnectKitProvider theme="soft" customTheme={{
                "--ck-accent-color": "#00D54B",
                "--ck-accent-text-color": "#ffffff",
            }}>
                { children }
            </ConnectKitProvider>
        </WagmiConfig>
    )
}