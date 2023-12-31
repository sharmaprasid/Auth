import { ToastContainer } from 'react-toastify';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MONGOAUTH',
  description: 'Complete  authentication using nextjs and mongodb',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <NextAuthProvider> */}
        <ToastContainer />{children}
        {/* </NextAuthProvider> */}
      </body>
    </html>
  )
}
