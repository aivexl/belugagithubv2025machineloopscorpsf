import { defineType, defineField } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const coinTagType = defineType({
  name: 'coinTag',
  title: 'Coin Tag',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Nama Coin',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'symbol',
      type: 'string',
      title: 'Symbol Coin',
      validation: (Rule) => Rule.required().min(1).max(10).uppercase(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'Deskripsi',
      rows: 3,
    }),
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Logo Coin',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Deskripsi untuk accessibility',
        },
      ],
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Kategori',
      options: {
        list: [
          { title: 'Bitcoin', value: 'bitcoin' },
          { title: 'Ethereum', value: 'ethereum' },
          { title: 'DeFi', value: 'defi' },
          { title: 'NFT', value: 'nft' },
          { title: 'Gaming', value: 'gaming' },
          { title: 'Layer 1', value: 'layer1' },
          { title: 'Layer 2', value: 'layer2' },
          { title: 'Stablecoin', value: 'stablecoin' },
          { title: 'Meme', value: 'meme' },
          { title: 'Lainnya', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'marketCapRank',
      type: 'number',
      title: 'Market Cap Rank',
      description: 'Peringkat berdasarkan market cap (1 = terbesar)',
      validation: (Rule) => Rule.min(1).max(10000),
    }),
    defineField({
      name: 'isActive',
      type: 'boolean',
      title: 'Aktif',
      description: 'Apakah coin tag ini aktif ditampilkan?',
      initialValue: true,
    }),
    defineField({
      name: 'isTop10',
      type: 'boolean',
      title: 'Top 10',
      description: 'Apakah ini termasuk top 10 coin?',
      initialValue: false,
    }),
    defineField({
      name: 'link',
      type: 'url',
      title: 'Link Coin',
      description: 'URL untuk halaman detail coin (contoh: /crypto/bitcoin)',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https', 'mailto', 'tel']
      }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'symbol',
      media: 'logo',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Untitled',
        subtitle: subtitle ? `$${subtitle}` : 'No symbol',
        media: media || DocumentIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Market Cap Rank',
      name: 'marketCapRankAsc',
      by: [
        { field: 'marketCapRank', direction: 'asc' }
      ]
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [
        { field: 'name', direction: 'asc' }
      ]
    },
    {
      title: 'Symbol A-Z',
      name: 'symbolAsc',
      by: [
        { field: 'symbol', direction: 'asc' }
      ]
    },
  ],
})