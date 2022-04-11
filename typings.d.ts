interface Image {
  assets: {
    url: string
  }
}

interface Category {
  title: string
}

export interface Creator {
  _id: string
  name: string
  address: string
  slug: {
    current: string
  }
  image: ImageBitmap
  bio: string
}

export interface Collection {
  _id: string
  title: string
  collectionName: string
  address: string
  description: string
  creator: Creator
  collectionImage: Image
  mainImage: Image
  slug: {
    current: string
  }
}
