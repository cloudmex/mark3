import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Función para detectar URLs de imágenes
  const isImageUrl = (url: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('ipfs.io') || 
           lowerUrl.includes('gateway.pinata.cloud') ||
           lowerUrl.includes('nftstorage.link');
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          // Personalizar enlaces para mostrar imágenes
          a: ({ href, children }) => {
            if (!href) return <>{children}</>;
            
            if (isImageUrl(href)) {
              return (
                <div className="my-2">
                  <img 
                    src={href} 
                    alt="NFT Image" 
                    className="max-w-full h-auto rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              );
            }
            
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {children}
              </a>
            );
          },
          // Personalizar párrafos
          p: ({ children }) => {
            return (
              <p className="mb-2">
                {children}
              </p>
            );
          },
          // Personalizar listas
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300">
              {children}
            </li>
          ),
          // Personalizar títulos
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-blue-400 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-blue-400 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold text-blue-400 mb-2">
              {children}
            </h3>
          ),
          // Personalizar código
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto mb-2">
                <code className="text-sm font-mono">{children}</code>
              </pre>
            );
          },
          // Personalizar blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-2">
              {children}
            </blockquote>
          ),
          // Personalizar tablas
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border-collapse border border-gray-600">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-600 px-3 py-2 bg-gray-700 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-600 px-3 py-2">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 