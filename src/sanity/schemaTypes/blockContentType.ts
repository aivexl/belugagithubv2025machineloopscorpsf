import {defineType, defineArrayMember} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Inline code', value: 'code'},
          {title: 'Underline', value: 'underline'},
          {title: 'Strike-through', value: 'strike-through'},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'External link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            title: 'Internal link',
            name: 'internalLink',
            type: 'object',
            fields: [
              {
                title: 'Reference',
                name: 'reference',
                type: 'reference',
                to: [{type: 'article'}],
              },
            ],
          },
          {
            title: 'Text Style',
            name: 'textStyle',
            type: 'object',
            options: { collapsible: true, collapsed: true },
            fields: [
              {
                title: 'Align',
                name: 'align',
                type: 'string',
                options: { list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Center', value: 'center'},
                  {title: 'Right', value: 'right'},
                  {title: 'Justify', value: 'justify'},
                ]},
              },
              {
                title: 'Size preset',
                name: 'preset',
                type: 'string',
                options: { list: [
                  {title: 'Small', value: 'sm'},
                  {title: 'Normal', value: 'base'},
                  {title: 'Large', value: 'lg'},
                  {title: 'X-Large', value: 'xl'},
                ]},
              },
              {
                title: 'Font size (px)',
                name: 'px',
                type: 'number',
                description: 'Overrides preset when set',
                validation: (Rule) => Rule.min(8).max(96),
              }
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Teks keterangan di bawah gambar',
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Teks alternatif untuk aksesibilitas',
        }
      ]
    }),

    // Divider / Horizontal rule
    defineArrayMember({
      type: 'object',
      name: 'divider',
      title: 'Divider',
      fields: [
        {
          name: 'variant',
          type: 'string',
          title: 'Variant',
          options: {list: [
            {title: 'Default', value: 'default'},
            {title: 'Subtle', value: 'subtle'},
          ]},
          initialValue: 'default',
        },
      ],
      preview: {
        prepare() { return {title: 'Divider'} }
      }
    }),

    // Code block (syntax highlighted) - custom object (no plugin required)
    defineArrayMember({
      type: 'object',
      name: 'codeBlock',
      title: 'Code',
      fields: [
        {name: 'filename', type: 'string', title: 'Filename'},
        {name: 'language', type: 'string', title: 'Language', options: {list: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'JSON', value: 'json'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'Bash', value: 'bash'},
          {title: 'Python', value: 'python'},
          {title: 'Go', value: 'go'},
        ]}},
        {name: 'code', type: 'text', title: 'Code'},
      ],
    }),

    // YouTube embed
    defineArrayMember({
      type: 'object',
      name: 'youtube',
      title: 'YouTube',
      fields: [
        {name: 'url', type: 'url', title: 'YouTube URL'},
        {name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.max(120)},
      ],
    }),

    // Tweet embed
    defineArrayMember({
      type: 'object',
      name: 'tweet',
      title: 'Tweet',
      fields: [
        {name: 'url', type: 'url', title: 'Tweet URL'},
      ],
    }),

    // Highlight / Callout block
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {name: 'variant', type: 'string', title: 'Variant', options: {list: [
          {title: 'Info', value: 'info'},
          {title: 'Success', value: 'success'},
          {title: 'Warning', value: 'warning'},
          {title: 'Danger', value: 'danger'},
        ]}},
        {name: 'title', type: 'string', title: 'Title'},
        {name: 'body', type: 'text', title: 'Body'},
      ],
    }),

    // Custom CTA block
    defineArrayMember({
      type: 'object',
      name: 'cta',
      title: 'Call To Action',
      fields: [
        {name: 'headline', type: 'string', title: 'Headline'},
        {name: 'subcopy', type: 'text', title: 'Subcopy'},
        {name: 'buttonLabel', type: 'string', title: 'Button Label'},
        {name: 'buttonUrl', type: 'url', title: 'Button URL'},
      ],
    }),

    // Table (simple) - use row objects to avoid nested arrays
    defineArrayMember({
      type: 'object',
      name: 'table',
      title: 'Table',
      fields: [
        {
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'row',
              title: 'Row',
              fields: [
                {name: 'cells', type: 'array', title: 'Cells', of: [{type: 'string'}]},
              ],
            }
          ],
        },
        {name: 'hasHeader', type: 'boolean', title: 'First row is header', initialValue: true},
      ],
    }),

    // Chart (generic embed)
    defineArrayMember({
      type: 'object',
      name: 'chart',
      title: 'Chart',
      fields: [
        {name: 'embedCode', type: 'text', title: 'Embed code or JSON config'},
        {name: 'caption', type: 'string', title: 'Caption'},
      ],
    }),
  ],
})
