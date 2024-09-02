import '../../styles/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "./components/theme-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Data Analysis App',
  description: 'Analyze your data with ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}