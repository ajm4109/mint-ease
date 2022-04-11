import { title } from 'process'

export default {
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    {
      name: 'title',
      description: 'Name of the NFT',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'collectionName',
      description: 'Name of the NFT collection',
      title: 'Collection Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'creator',
      title: 'Creator',
      type: 'reference',
      to: { type: 'creator' },
    },
    {
      name: 'collectionImage',
      title: 'Collection Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      title: 'Tags',
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'creator.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { creator } = selection
      return Object.assign({}, selection, {
        subtitle: creator && `by ${creator}`,
      })
    },
  },
}
