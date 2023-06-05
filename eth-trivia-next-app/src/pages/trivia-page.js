import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

import { Trivia } from "../../components"

const inter = Inter({ subsets: ['latin'] })

export default function TriviaPage() {
  return (
    <>
      <Trivia />
    </>
  )
}
