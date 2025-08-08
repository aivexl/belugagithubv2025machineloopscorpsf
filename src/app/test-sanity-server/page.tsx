import { getAllArticles, getArticlesByCategory } from '../../utils/sanity';

export default async function TestSanityServerPage() {
  try {
    console.log('Fetching articles from Sanity (server-side)...');
    
    const [allArticles, newsroomArticles, academyArticles] = await Promise.all([
      getAllArticles(),
      getArticlesByCategory('newsroom'),
      getArticlesByCategory('academy')
    ]);
    
    console.log('All articles:', allArticles);
    console.log('Newsroom articles:', newsroomArticles);
    console.log('Academy articles:', academyArticles);
    
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Test Sanity Connection (Server-Side)</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-duniacrypto-panel p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">All Articles ({allArticles.length})</h2>
            {allArticles.length === 0 ? (
              <p className="text-gray-400">No articles found</p>
            ) : (
              <ul className="space-y-2">
                {allArticles.map((article) => (
                  <li key={article._id} className="text-sm">
                    <strong>{article.title}</strong>
                    <br />
                    <span className="text-gray-400">Category: {article.category}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-duniacrypto-panel p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Newsroom ({newsroomArticles.length})</h2>
            {newsroomArticles.length === 0 ? (
              <p className="text-gray-400">No newsroom articles found</p>
            ) : (
              <ul className="space-y-2">
                {newsroomArticles.map((article) => (
                  <li key={article._id} className="text-sm">
                    <strong>{article.title}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-duniacrypto-panel p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Academy ({academyArticles.length})</h2>
            {academyArticles.length === 0 ? (
              <p className="text-gray-400">No academy articles found</p>
            ) : (
              <ul className="space-y-2">
                {academyArticles.map((article) => (
                  <li key={article._id} className="text-sm">
                    <strong>{article.title}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-900 text-blue-200 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Debug Info:</h2>
          <p>Total Articles: {allArticles.length}</p>
          <p>Newsroom Articles: {newsroomArticles.length}</p>
          <p>Academy Articles: {academyArticles.length}</p>
          <p>Check server console for detailed logs</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching articles:', error);
    
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Test Sanity Connection (Server-Side)</h1>
        <div className="bg-red-900 text-red-200 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Error:</h2>
          <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }
} 