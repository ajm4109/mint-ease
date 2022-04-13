import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { BigNumber } from 'ethers'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'

interface Props {
  collection: Collection
}

const Slug = ({ collection }: Props) => {
  //metamask auth
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  // ---

  //states
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [loading, setLoading] = useState(true)
  const [priceEth, setPriceEth] = useState<string>()
  const [nftAddress, setNftAddress] = useState<string>(collection.address)
  // ---

  const nftDrop = useNFTDrop(collection.address)

  // Learn to properly time out Loading on collections with no collections address

  useEffect(() => {
    if (!nftDrop) return

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice()
  }, [nftDrop])

  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.getTotalCount()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }

    fetchNFTDropData()
  }, [nftDrop])

  setTimeout(() => {
    if (loading == true && nftAddress == undefined) {
      setLoading(false)
      setNftAddress('na')
    }
  }, 1000 * 10)

  const mintNft = () => {
    if (!nftDrop || !address) return

    const quantity = 1

    nftDrop
      ?.claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt
        const claimedtoken = tx[0].id
        const claimedNFT = await tx[0].data()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-10">
      {/* Left side */}
      <section className="lg:col-span-4">
        <aside className="flex h-full flex-1 flex-col items-center justify-center bg-gradient-to-br from-cyan-800 to-red-400 p-3 lg:min-h-screen">
          <picture className="mb-3 rounded-lg bg-gradient-to-br from-red-500 to-cyan-700 object-cover p-2 shadow-md shadow-[#bead6f]">
            <img
              className="w-40 rounded-lg object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.collectionImage).url()}
              alt={collection.collectionName}
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
          <h1 className=" mb-3 text-3xl font-bold lg:text-5xl lg:font-extrabold">
            Mint-Ease {collection.title} NFT Collection
          </h1>
        </div>

        {loading ? (
          <div className="mx-auto w-fit">
            <p className="animate-ping text-sm font-bold text-green-500">
              Loading...
            </p>
          </div>
        ) : nftAddress === 'na' ? (
          <span className="text-xs text-white">
            This Collection Isn't Created Yet
          </span>
        ) : (
          <div className="mx-auto w-fit">
            <p className="text-sm font-bold text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFTs claimed
            </p>
          </div>
        )}

        <button
          onClick={mintNft}
          disabled={
            !address ||
            loading ||
            claimedSupply === totalSupply?.toNumber() ||
            nftAddress === 'na'
          }
          className="mt-7 w-full rounded border bg-purple-900 px-5 py-2 text-xl font-bold text-white shadow-xl disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading...</>
          ) : nftAddress === 'na' ? (
            <>Collection coming soon...</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign In To Mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceEth})</span>
          )}
        </button>
        <Link href="/">
          <a className="mx-auto mt-5 w-fit">
            <p className="underline hover:scale-105 hover:cursor-pointer hover:text-blue-700">
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
