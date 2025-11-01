"use client";

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import { CoinGeckoProvider } from './CoinGeckoContext';
import { urlFor } from '../utils/sanity';
import SubscribeContainer from './SubscribeContainer';
import { CoinLogosOnly } from './CoinTags';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.locale('id');

export default function ArticleDetailClient({ article, relatedArticles = [] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderPortableText = (content) => {
    if (!Array.isArray(content)) {
      return <div className="whitespace-pre-line">{content || ''}</div>;
    }

      const renderChildren = (children = [], markDefs = []) => {
      const getAnnotationByKey = (key) => markDefs.find((def) => def._key === key);
      return children.map((child) => {
        if (!child || typeof child.text !== 'string') return null;
        let element = child.text;

        const wrap = (wrapped) => (element = wrapped);

        if (child.marks && child.marks.length > 0) {
          child.marks.forEach((mark) => {
            // String decorators
            if (mark === 'strong') wrap(<strong key={child._key}>{element}</strong>);
            else if (mark === 'em') wrap(<em key={child._key}>{element}</em>);
            else if (mark === 'underline') wrap(<u key={child._key}>{element}</u>);
            else if (mark === 'strike-through') wrap(<s key={child._key}>{element}</s>);
            else if (mark === 'code') wrap(
              <code key={child._key} className="bg-gray-800 px-1 py-0.5 rounded" style={{fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}}>{element}</code>
            );
              else {
                // Annotation objects (e.g., textStyle, link, internalLink)
              const def = getAnnotationByKey(mark);
              if (def) {
                  if (def._type === 'textStyle') {
                    const style = def.px ? { fontSize: `${def.px}px` } : undefined;
                    const presetClass = !def.px && def.preset ? (
                      def.preset === 'sm' ? 'text-sm' :
                      def.preset === 'base' ? 'text-base' :
                      def.preset === 'lg' ? 'text-lg' :
                      def.preset === 'xl' ? 'text-xl' : ''
                    ) : '';
                    wrap(<span key={child._key} className={presetClass} style={style}>{element}</span>);
                } else if (def._type === 'link' && def.href) {
                  wrap(<a key={child._key} href={def.href} className="text-blue-400 underline" target="_blank" rel="noreferrer noopener">{element}</a>);
                } else if (def._type === 'internalLink' && def.reference?._ref) {
                  wrap(<span key={child._key} className="text-blue-400 underline">{element}</span>);
                }
              }
            }
          });
        }

        return <React.Fragment key={child._key}>{element}</React.Fragment>;
      });
    };

    const blocks = [];
    
    // First, process blocks and group consecutive list items
    const processedBlocks = [];
    let currentList = null; // { type: 'bullet'|'number', level: number, items: [] }
    
    const flushList = () => {
      if (currentList && currentList.items.length > 0) {
        const ListTag = currentList.type === 'bullet' ? 'ul' : 'ol';
        processedBlocks.push({
          type: 'list',
          listType: currentList.type,
          level: currentList.level,
          items: currentList.items,
          ListTag
        });
        currentList = null;
      }
    };
    
    const convertProcessedBlocksToJSX = () => {
      if (processedBlocks.length === 0) return;
      
      processedBlocks.forEach((procBlock) => {
        if (procBlock.type === 'list') {
          const ListTag = procBlock.ListTag;
          const listStyle = procBlock.listType === 'bullet' 
            ? 'list-disc list-outside pl-6 space-y-2 my-4 text-gray-200' 
            : 'list-decimal list-outside pl-6 space-y-2 my-4 text-gray-200';
          blocks.push(
            <ListTag key={procBlock.items[0]?.key || `list-${blocks.length}`} className={listStyle}>
              {procBlock.items.map((item) => (
                <li key={item.key} className="leading-relaxed">{item.content}</li>
              ))}
            </ListTag>
          );
        } else if (procBlock.type === 'block') {
          const Tag = procBlock.blockType;
          blocks.push(
            <Tag key={procBlock.key} className={procBlock.className}>
              {procBlock.content}
            </Tag>
          );
        }
      });
      // Clear processedBlocks after converting
      processedBlocks.length = 0;
    };
    
    content.forEach((block, idx) => {
      if (!block || typeof block !== 'object') return;
      
      if (block._type === 'block') {
        // Check if this is a list item
        if (block.listItem) {
          const listLevel = block.level || 1;
          const listType = block.listItem; // 'bullet' or 'number'
          
          // If we have a current list and it matches, add to it
          if (currentList && currentList.type === listType && currentList.level === listLevel) {
            const markDefs = block.markDefs || [];
            const childrenEls = renderChildren(block.children, markDefs);
            currentList.items.push({ key: block._key || idx, content: childrenEls });
          } else {
            // Flush current list and start a new one
            flushList();
            const markDefs = block.markDefs || [];
            const childrenEls = renderChildren(block.children, markDefs);
            currentList = {
              type: listType,
              level: listLevel,
              items: [{ key: block._key || idx, content: childrenEls }]
            };
          }
          return;
        }
        
        // Not a list item, flush any current list first
        flushList();
        
        // Determine paragraph alignment from textStyle annotations used in children
        const markDefs = block.markDefs || [];
        const findAlign = () => {
          for (const ch of block.children || []) {
            for (const m of ch.marks || []) {
              const def = markDefs.find((d) => d._key === m && d._type === 'textStyle');
              if (def?.align) return def.align;
            }
          }
          return undefined;
        };
        const align = findAlign();
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : align === 'justify' ? 'text-justify' : '';

        const childrenEls = renderChildren(block.children, markDefs);
        const base = 'text-gray-200 leading-relaxed';
        switch (block.style) {
          case 'h1':
            processedBlocks.push({ type: 'block', blockType: 'h1', key: block._key || idx, content: childrenEls, className: `text-3xl font-bold mb-4 ${base} ${alignClass}` });
            break;
          case 'h2':
            processedBlocks.push({ type: 'block', blockType: 'h2', key: block._key || idx, content: childrenEls, className: `text-2xl font-bold mb-3 ${base} ${alignClass}` });
            break;
          case 'h3':
            processedBlocks.push({ type: 'block', blockType: 'h3', key: block._key || idx, content: childrenEls, className: `text-xl font-bold mb-2 ${base} ${alignClass}` });
            break;
          case 'blockquote':
            processedBlocks.push({ type: 'block', blockType: 'blockquote', key: block._key || idx, content: childrenEls, className: `border-l-4 border-blue-500 pl-4 italic text-gray-300 my-4 ${alignClass}` });
            break;
          default:
            processedBlocks.push({ type: 'block', blockType: 'p', key: block._key || idx, content: childrenEls, className: `mb-4 ${base} ${alignClass}` });
        }
        return;
      }
      
      // Flush list before non-block content
      flushList();
      
      // Convert processedBlocks to JSX and add to blocks array in order
      convertProcessedBlocksToJSX();

      if (block._type === 'image' && block.asset) {
        const src = (() => { try { return urlFor(block).url(); } catch { return '/Asset/beluganewlogov2.png'; } })();
        const captionText = block.caption || '';
        blocks.push(
          <figure key={block._key || idx} className="my-6">
            <img src={src} alt={block.alt || ''} className="w-full rounded" onError={(e) => { e.target.src = '/Asset/beluganewlogov2.png'; }} />
            {captionText ? (
              <figcaption className="text-sm text-gray-400 mt-2 text-center">{captionText}</figcaption>
            ) : null}
          </figure>
        );
        return;
      }

      if (block._type === 'divider') {
        blocks.push(<hr key={block._key || idx} className="my-6 border-gray-700" />);
        return;
      }

      if (block._type === 'codeBlock') {
        blocks.push(
          <pre key={block._key || idx} className="my-4 p-4 rounded bg-gray-900 overflow-auto">
            <code>{block.code || ''}</code>
          </pre>
        );
        return;
      }

      if (block._type === 'youtube' && block.url) {
        try {
          const url = new URL(block.url);
          const v = url.searchParams.get('v');
          const embedSrc = v ? `https://www.youtube.com/embed/${v}` : block.url;
          blocks.push(
            <div key={block._key || idx} className="aspect-video my-6">
              <iframe className="w-full h-full" src={embedSrc} title={block.title || 'YouTube video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          );
        } catch {}
        return;
      }

      if (block._type === 'tweet' && block.url) {
        blocks.push(
          <div key={block._key || idx} className="my-6">
            <a href={block.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View Tweet</a>
          </div>
        );
        return;
      }

      if (block._type === 'callout') {
        const variants = {
          info: 'bg-blue-900/40 border-blue-700',
          success: 'bg-green-900/30 border-green-700',
          warning: 'bg-yellow-900/30 border-yellow-700',
          danger: 'bg-red-900/30 border-red-700',
        };
        const cls = variants[block.variant] || variants.info;
        blocks.push(
          <div key={block._key || idx} className={`my-4 p-4 rounded border ${cls}`}>
            {block.title && <div className="font-semibold mb-1 text-white">{block.title}</div>}
            {block.body && <div className="text-gray-200">{block.body}</div>}
          </div>
        );
        return;
      }

      if (block._type === 'cta') {
        blocks.push(
          <div key={block._key || idx} className="my-6 p-6 rounded-lg bg-blue-900/30 border border-blue-700">
            {block.headline && <div className="text-xl font-bold text-white mb-2">{block.headline}</div>}
            {block.subcopy && <div className="text-gray-200 mb-4">{block.subcopy}</div>}
            {block.buttonLabel && block.buttonUrl && (
              <a href={block.buttonUrl} className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500">{block.buttonLabel}</a>
            )}
          </div>
        );
        return;
      }

      if (block._type === 'table' && Array.isArray(block.rows)) {
        blocks.push(
          <div key={block._key || idx} className="overflow-x-auto my-6">
            <table className="min-w-full border border-gray-700">
              <tbody>
                {block.rows.map((row, rIdx) => (
                  <tr key={row._key || rIdx} className="border-t border-gray-700">
                    {(row.cells || []).map((cell, cIdx) => (
                      <td key={cIdx} className={`p-2 ${block.hasHeader && rIdx === 0 ? 'font-semibold text-white' : 'text-gray-200'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        return;
      }

      // Fallback for unknown blocks
      blocks.push(<pre key={block._key || idx} className="text-xs text-gray-400 bg-gray-900/40 p-2 rounded overflow-auto">{JSON.stringify(block, null, 2)}</pre>);
    });

    // Flush any remaining list after processing all content
    flushList();
    
    // Convert any remaining processedBlocks to JSX (blocks that came after the last non-block)
    convertProcessedBlocksToJSX();

    return <>{blocks}</>;
  };

  return (
    <CoinGeckoProvider>
      {/* Main Layout - Same as homepage */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 flex-1 w-full">
        <section className="col-span-1 xl:col-span-2 space-y-4 md:space-y-6">
          {/* Article Header */}
          <div className="bg-duniacrypto-panel rounded-lg shadow overflow-hidden">
            {/* Featured Image - Same height as slider (400px) */}
            <div className="relative h-96 md:h-[400px]">
              <img
                src={article.imageUrl || '/Asset/beluganewlogov2.png'}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/Asset/beluganewlogov2.png';
                }}
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-block px-3 py-1.5 rounded-full text-white font-bold text-sm tracking-wide shadow-lg ${
                  article.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                }`}>
                  {article.category === 'newsroom' ? 'News' : 'Academy'}
                </span>
              </div>
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                {/* Coin tag logos above title (smaller than article title) */}
                {article.coinTags && article.coinTags.length > 0 && (
                  <div className="mb-2">
                    <CoinLogosOnly
                      coinTags={article.coinTags}
                      size="sm"
                      maxDisplay={8}
                      className="justify-start"
                    />
                  </div>
                )}
                <h1 className="text-lg md:text-2xl font-bold text-white line-clamp-2 drop-shadow-lg mb-8">
                  {article.title}
                </h1>
                <div className="text-xs sm:text-sm text-gray-200 flex gap-2 items-center">
                  <span>{article.source || 'Dunia Crypto'}</span>
                  <span>•</span>
                  <span>{article.publishedAt ? dayjs(article.publishedAt).format('DD MMM YYYY HH:mm') : 'Baru saja'}</span>
                </div>
              </div>
            </div>
            
            {/* Article Excerpt */}
            {article.excerpt && (
              <div className="p-4 md:p-6 border-b border-gray-700">
                <div className="text-gray-200 text-base md:text-lg leading-relaxed">{article.excerpt}</div>
              </div>
            )}
          </div>
          
          {/* Article Content */}
          <div className="bg-duniacrypto-panel rounded-lg shadow p-4 md:p-6">
            <div className="leading-relaxed text-sm md:text-base">
              {renderPortableText(article.content)}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-duniacrypto-panel rounded-lg shadow p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Artikel Terkait</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {relatedArticles.slice(0, 4).map((relatedArticle) => (
                  <a
                    key={relatedArticle._id}
                    href={`/${relatedArticle.category === 'newsroom' ? 'newsroom' : 'academy'}/${relatedArticle.slug.current}`}
                    className="block group hover:bg-white/10 rounded-lg p-3 md:p-4 transition cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline border border-gray-700 hover:border-gray-600"
                  >
                    <div className="flex gap-3 md:gap-4">
                      <img
                        src={relatedArticle.imageUrl || '/Asset/beluganewlogov2.png'}
                        alt={relatedArticle.title}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/Asset/beluganewlogov2.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-blue-300 transition mb-2 leading-tight">
                          {relatedArticle.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span className={`inline-block px-2 py-1 rounded text-white font-medium ${
                            relatedArticle.category === 'newsroom' ? 'bg-blue-700' : 'bg-blue-500'
                          }`}>
                            {relatedArticle.category === 'newsroom' ? 'News' : 'Academy'}
                          </span>
                          <span>
                            {isClient ? dayjs(relatedArticle.publishedAt).fromNow() : 'Loading...'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1 - Kategori Level */}
          <div className="mb-2">
            <div className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">Belajar lagi yuk!</div>
            <div className="text-2xl md:text-3xl font-bold font-mono text-blue-500 mb-6">#allaboutcrypto</div>
          </div>
          <section className="mb-12 mt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Pilih Level Pembelajaranmu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { id: 'newbie', title: 'Newbie', color: 'bg-green-600', description: 'Mulai dari dasar cryptocurrency', image: '/Asset/beluganewlogov2.png' },
                { id: 'intermediate', title: 'Intermediate', color: 'bg-yellow-600', description: 'Tingkatkan pengetahuan blockchain', image: '/Asset/beluganewlogov2.png' },
                { id: 'expert', title: 'Expert', color: 'bg-red-600', description: 'Mahir dalam teknologi crypto', image: '/Asset/beluganewlogov2.png' }
              ].map((level) => (
                <div
                  key={level.id}
                  className={`p-0 rounded-lg border-2 border-blue-500 transition-all duration-200 text-left group bg-duniacrypto-panel text-gray-300 hover:bg-gray-800 flex flex-col h-full cursor-pointer`}
                  tabIndex={0}
                  onClick={() => { window.location.href = `/academy?level=${level.id}`; }}
                >
                  <div className="w-full flex flex-col h-full">
                    <div className="relative w-full h-40 md:h-48 rounded-t-lg overflow-hidden bg-duniacrypto-panel">
                      <img
                        src={level.image}
                        alt={level.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/Asset/beluganewlogov2.png';
                        }}
                      />
                    </div>
                    <div className={`rounded-b-lg w-full flex flex-col justify-center items-start p-6 ${level.color} bg-opacity-80 flex-1`}>
                      <h3 className="text-xl font-bold mb-0 text-center w-full">{level.title}</h3>
                      <p className="text-sm opacity-80 mb-0 text-center w-full">{level.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 2 - Kategori Topik Crypto */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Topik Crypto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {['DeFi', 'NFT', 'Wallet', 'Blockchain', 'Trading', 'Airdrop', 'Security', 'Tokenomics', 'Stablecoin', 'GameFi', 'Web3', 'DAO', 'Mining', 'Metaverse'].map((topic) => (
                <button
                  key={topic}
                  className="p-3 rounded-lg border transition-all duration-200 text-sm font-medium no-underline bg-duniacrypto-panel border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                  onClick={() => { window.location.href = `/academy?topic=${encodeURIComponent(topic)}`; }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </section>

          {/* SECTION 3 - Kategori Jaringan Blockchain */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Jaringan Blockchain</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {['Bitcoin Network', 'Ethereum Network', 'Binance Smart Chain (BSC)', 'Solana Network', 'Polygon Network', 'Avalanche Network', 'Arbitrum Network', 'Cardano Network'].map((network) => (
                <button
                  key={network}
                  className="p-3 rounded-lg border transition-all duration-200 text-sm font-medium no-underline bg-duniacrypto-panel border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                  onClick={() => { window.location.href = `/academy?network=${encodeURIComponent(network)}`; }}
                >
                  {network}
                </button>
              ))}
            </div>
          </section>
        </section>

        {/* Sidebar - Same as homepage */}
        <aside className="col-span-1 space-y-4 md:gap-6">
          {/* Subscribe for Crypto Updates - Same as homepage */}
          <SubscribeContainer 
            containerClassName="w-full max-w-full mt-0 mb-8"
            className=""
          />
        </aside>
      </main>
    </CoinGeckoProvider>
  );
}