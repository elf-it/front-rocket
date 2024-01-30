import { AuthProvider } from './Providers'
import "tw-elements/dist/css/tw-elements.min.css"
import './globals.css'
import 'tailwindcss'
import { Inter } from 'next/font/google'
import Web3Provider from './web3provider'
import SideNav from '@/components/SideNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rocket Science',
  description: 'This is Rocket Science',
  other: {
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  },
}

export default function RootLayout({ children }) {

  return (
    <html lang="en" style={{backgroundColor: "#f1f1f1"}}>
      <body className={inter.className} style={{backgroundColor: "#f1f1f1"}}>
        <AuthProvider>
          <Web3Provider>
            <SideNav>
              {children}
            </SideNav>
          </Web3Provider>
        </AuthProvider>
      </body>
    </html>
  )
}
