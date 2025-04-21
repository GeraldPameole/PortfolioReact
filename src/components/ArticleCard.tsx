import React from "react";

interface ArticleProps {
  article: {
    slug: string;
    data: {
      title: string;
      description: string;
      publishDate: string;
      image?: string;
      tags?: string[];
      theme?: string;
    };
    body: string;
  };
}

export const ArticleCard: React.FC<ArticleProps> = ({ article }) => {
  return (
    <a href={`/blog/${article.slug}`} className="group">
      <article className="h-full bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          {article.data.image && (
            <img
              src={article.data.image}
              alt={article.data.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center text-white text-xs">
              <span className="flex items-center">
                <i className="fas fa-calendar-alt mr-1"></i>
                {new Date(article.data.publishDate).toLocaleDateString(
                  "fr-FR",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {article.data.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {article.data.description}
          </p>
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between">
            <div className="flex flex-wrap gap-2">
              {article.data.tags &&
                article.data.tags.slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
            <span className="text-indigo-600 dark:text-indigo-400 inline-flex items-center text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
              Lire
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </a>
  );
};
