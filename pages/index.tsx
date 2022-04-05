import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Mint-Ease</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Home Page</h1>
      <Link href="/nft/war-ape">
        <a>nft/war-ape</a>
      </Link>
    </div>
  )
}

export default Home
