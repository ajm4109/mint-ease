import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'

interface Props {
  collection: Collection
}

const Slug = ({ collection }: Props) => {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-10">
      {/* Left side */}
      <section className="lg:col-span-4">
        <aside className="flex h-full flex-1 flex-col items-center justify-center bg-gradient-to-br from-cyan-800 to-red-400 p-3 lg:min-h-screen">
          <picture className="mb-3 rounded-lg bg-gradient-to-br from-red-500 to-cyan-700 object-cover p-2 shadow-md shadow-[#bead6f]">
            <img
              className="w-40 rounded-lg lg:h-96 lg:w-72"
              src={urlFor(collection.collectionImage).url()}
              alt="ape"
            />
          </picture>
          <div className="w-1/2 space-y-4 text-center md:w-1/3">
            <h1 className="text text-4xl font-bold text-white">
              {collection.collectionName}
            </h1>
            <p className="pb-4 text-white">{collection.description}</p>
          </div>
        </aside>
      </section>

      {/* Right side */}
      <section className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between p-4 pt-0">
          <h1 className="text-xl">Mint-Ease NFT Mint</h1>
          <button
            onClick={() => {
              !address ? connectWithMetamask() : disconnect()
            }}
            className="w-fit rounded-full border border-black bg-indigo-400 px-5 py-2 shadow"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>

        <hr className="mx-auto my-2 w-11/12 rounded-full border border-stone-700 bg-stone-700" />

        {address ? (
          <p className="pb-5 text-center text-sm text-teal-600">
            Signed in as{' '}
            <span className="font-bold">
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
          </p>
        ) : (
          <p className="pb-5 text-center text-sm text-white">Not Signed In</p>
        )}

        {/* RS Content */}
        <div className="flex flex-1 flex-col items-center px-5 text-center lg:justify-center">
          <picture className="flex w-full items-center justify-center">
            <img
              className="w-80 object-cover pb-10 lg:aspect-video lg:w-5/6"
              src={urlFor(collection.mainImage).url()}
              alt="mint ease monkies"
            />
          </picture>
          <h1 className="pb-5 text-3xl font-bold lg:text-5xl lg:font-extrabold">
            Mint-Ease {collection.title} NFT Collection
          </h1>
        </div>
        <button
          disabled={!address}
          className="w-full rounded border bg-purple-900 px-5 py-2 text-xl font-bold text-white shadow-xl disabled:bg-gray-400"
        >
          Mint NFT
        </button>
        <Link href="/">
          <a className="mt-5">
            <p className="mx-auto w-fit underline hover:scale-105 hover:cursor-pointer hover:text-blue-700">
              Back To Home
            </p>
          </a>
        </Link>
      </section>
    </div>
  )
}

export default Slug

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $slug][0]{
  _id,
  title,
  address,
  description,
  collectionName,
  mainImage {
    asset
  },
  collectionImage {
    asset
  },
  slug {
    current
  },
  creator-> {
    _id,
    name,
    address,
    slug {
      current
    },
  },
}`

  const collection = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
