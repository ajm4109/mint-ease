import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { sanityClient, urlFor } from '../sanity'
import { Collection } from '../typings'

interface Props {
  collections: Collection[]
}

const Home = ({ collections }: Props) => {
  return (
    <div>
      <Head>
        <title>Mint-Ease</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center p-7 text-2xl">
        <h1>
          Welcome to the{' '}
          <span className="text-3xl font-bold underline">Aj Prime</span> NFT
          Drop Page
        </h1>
      </div>

      <main className="grid min-h-screen grid-cols-1 space-y-12 bg-gradient-to-br from-black via-black to-violet-900 p-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collections.map((collection) => (
          <Link key={collection._id} href={`/nft/${collection.slug.current}`}>
            <a className="mx-auto mt-12 w-fit cursor-pointer">
              <article className="flex w-fit flex-col items-center space-y-7 rounded-xl border border-cyan-300 bg-slate-400/10 p-7 shadow-to-br shadow-cyan-200 backdrop-blur-2xl">
                <div>
                  <img
                    src={urlFor(collection.collectionImage).url()}
                    alt=""
                    className="aspect-square h-80 w-60 rounded-xl object-cover shadow-lg shadow-[#bead6f]"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white">
                    {collection.collectionName}
                  </h2>
                  <p className="text-white">{collection.description}</p>
                </div>
              </article>
            </a>
          </Link>
        ))}
      </main>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const query = `*[_type=='collection']{
    _id,
    title,
    collectionName,
    address,
    description,
    mainImage{
      asset
    },
    collectionImage{
      asset
    },
    slug{
      current
    },
    creator ->{
      _id,
      name,
      address,
      slug{
        current
      }
    },
  }
  | order(title desc)`

  const collections = await sanityClient.fetch(query)
  console.log(collections)

  return {
    props: {
      collections,
    },
  }
}
