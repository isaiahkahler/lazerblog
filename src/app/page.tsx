import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import HomeClient from './client'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      home!
      <HomeClient />
    </div>
  )
}
