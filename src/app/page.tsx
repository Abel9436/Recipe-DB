'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Recipe } from '@/types/recipe';
import Link from 'next/link';

type SearchType = 'all' | 'culture' | 'ingredients';

interface SearchInfo {
  originalQuery: string;
  correctedQuery: string;
  searchTerms: string[];
  usedTerm: string;
  context?: {
    culturalVariations: string[];
    ingredientAlternatives: string[];
    mealTypes: string[];
  };
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearched, setLastSearched] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [title, setTitle] = useState('Global Recipe Finder');
  const [subtitle, setSubtitle] = useState('Discover delicious recipes from around the world. Search by ingredients, cuisine, or meal type.');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLTextAreaElement>(null);
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Update document class when dark mode changes
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingSubtitle && subtitleInputRef.current) {
      subtitleInputRef.current.focus();
    }
  }, [isEditingSubtitle]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingTitle(false);
  };

  const handleSubtitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingSubtitle(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setLastSearched(query.trim());
    setSearchInfo(null);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: query.trim(),
          searchType 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search request failed');
      }

      const data = await response.json();
      setResults(data.results || []);
      setSearchInfo(data.searchInfo || null);
    } catch (error) {
      console.error('Search failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to search recipes. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 perspective-1000 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-end mb-8">
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:rotate-y-180 hover:scale-110 dark:text-white text-gray-800"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <SunIcon className="h-6 w-6 animate-spin-slow" />
            ) : (
              <MoonIcon className="h-6 w-6 animate-spin-slow" />
            )}
          </button>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="relative group">
            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit} className="max-w-3xl mx-auto">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-7xl md:text-8xl font-bold text-emerald-900 dark:text-emerald-400 bg-transparent focus:outline-none text-center transform hover:scale-105 transition-all duration-300"
                  onBlur={() => setIsEditingTitle(false)}
                />
              </form>
            ) : (
              <h1 
                className="text-7xl md:text-8xl font-bold text-emerald-900 dark:text-emerald-400 mb-8 transform hover:scale-105 transition-transform duration-300 animate-typing hover:rotate-y-12 cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                {title}
              </h1>
            )}
          </div>

          <div className="relative group mt-4">
            {isEditingSubtitle ? (
              <form onSubmit={handleSubtitleSubmit} className="max-w-3xl mx-auto">
                <textarea
                  ref={subtitleInputRef}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full text-2xl md:text-3xl text-emerald-700 dark:text-emerald-300 bg-transparent focus:outline-none text-center transform hover:translate-z-20 transition-all duration-300 resize-none"
                  rows={2}
                  onBlur={() => setIsEditingSubtitle(false)}
                />
              </form>
            ) : (
              <p 
                className="text-2xl md:text-3xl text-emerald-700 dark:text-emerald-300 max-w-3xl mx-auto animate-text-slide-up-delayed transform hover:translate-z-20 transition-transform duration-300 cursor-pointer"
                onClick={() => setIsEditingSubtitle(true)}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for recipes (e.g., pasta, chicken, vegetarian)..."
                  className="w-full p-5 pl-14 text-lg border border-emerald-200 dark:border-emerald-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:translate-z-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  aria-label="Search recipes"
                />
                <MagnifyingGlassIcon className="h-7 w-7 text-emerald-400 dark:text-emerald-500 absolute left-5 top-1/2 transform -translate-y-1/2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300" />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-5 py-5 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300 transform hover:rotate-y-12 hover:translate-z-10"
              >
                <AdjustmentsHorizontalIcon className="h-7 w-7" />
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-5 text-lg bg-emerald-600 dark:bg-emerald-500 text-white rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm hover:shadow-lg transform hover:-translate-y-1 hover:rotate-y-12 transition-all duration-300"
              >
                Search
              </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-emerald-100 dark:border-emerald-900 transform hover:translate-z-20 transition-transform duration-300">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-lg font-medium text-emerald-700 dark:text-emerald-300 mb-3">
                      Search Type
                    </label>
                    <div className="flex gap-3">
                      {(['all', 'culture', 'ingredients'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSearchType(type)}
                          className={`flex-1 px-5 py-3 text-base font-medium transition-all duration-300 transform hover:scale-105 hover:rotate-y-12 ${
                            searchType === type
                              ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-md translate-z-10'
                              : 'bg-emerald-50 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {loading && (
          <div className="text-center py-16 animate-fade-in">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-500 dark:border-emerald-400 border-t-transparent mx-auto transform hover:rotate-y-180 transition-transform duration-1000"></div>
            <p className="mt-8 text-xl text-emerald-700 dark:text-emerald-300 animate-pulse">Searching for recipes...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300 hover:rotate-y-12">
              <p className="text-red-600 dark:text-red-400 text-xl">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && results.length === 0 && lastSearched && (
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-900 rounded-xl p-10 max-w-md mx-auto shadow-sm transform hover:scale-105 transition-transform duration-300 hover:rotate-y-12">
              <h3 className="text-3xl font-semibold text-emerald-900 dark:text-emerald-400 mb-6 animate-text-slide-up">No recipes found</h3>
              <p className="text-xl text-emerald-700 dark:text-emerald-300 mb-8 animate-text-slide-up-delayed">
                We couldn&apos;t find any recipes matching &quot;{lastSearched}&quot;.
              </p>
              {searchInfo && (
                <div className="text-left space-y-6">
                  {searchInfo.context && (
                    <>
                      {searchInfo.context.culturalVariations.length > 0 && (
                        <div className="animate-text-slide-up-delayed-2">
                          <p className="text-xl text-emerald-800 dark:text-emerald-200 font-medium mb-4">
                            Try these cuisine types:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {searchInfo.context.culturalVariations.map((variation, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setQuery(variation);
                                  handleSearch(new Event('submit') as unknown as React.FormEvent);
                                }}
                                className="px-4 py-2 bg-emerald-50 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 rounded-full text-base hover:bg-emerald-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                              >
                                {variation}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchInfo.context.mealTypes.length > 0 && (
                        <div className="animate-text-slide-up-delayed-3">
                          <p className="text-xl text-emerald-800 dark:text-emerald-200 font-medium mb-4">
                            Or try these meal types:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {searchInfo.context.mealTypes.map((mealType, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setQuery(mealType);
                                  handleSearch(new Event('submit') as unknown as React.FormEvent);
                                }}
                                className="px-4 py-2 bg-emerald-50 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 rounded-full text-base hover:bg-emerald-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                              >
                                {mealType}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchInfo.context.ingredientAlternatives.length > 0 && (
                        <div className="animate-text-slide-up-delayed-4">
                          <p className="text-xl text-emerald-800 dark:text-emerald-200 font-medium mb-4">
                            Or try these ingredients:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {searchInfo.context.ingredientAlternatives.map((ingredient, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setQuery(ingredient);
                                  handleSearch(new Event('submit') as unknown as React.FormEvent);
                                }}
                                className="px-4 py-2 bg-emerald-50 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 rounded-full text-base hover:bg-emerald-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                              >
                                {ingredient}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {searchInfo.searchTerms.length > 1 && (
                    <div className="animate-text-slide-up-delayed-5">
                      <p className="text-xl text-emerald-800 dark:text-emerald-200 font-medium mb-4">
                        Or try these related searches:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {searchInfo.searchTerms.map((term, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setQuery(term);
                              handleSearch(new Event('submit') as unknown as React.FormEvent);
                            }}
                            className="px-4 py-2 bg-emerald-50 dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 rounded-full text-base hover:bg-emerald-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-8">
            {searchInfo && searchInfo.originalQuery !== searchInfo.usedTerm && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-6 max-w-3xl mx-auto animate-fade-in">
                <p className="text-lg text-emerald-700 dark:text-emerald-300">
                  Showing results for <span className="font-semibold">{searchInfo.usedTerm}</span>
                  {searchInfo.originalQuery !== searchInfo.usedTerm && (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {' '}(searched for &quot;{searchInfo.originalQuery}&quot;)
                    </span>
                  )}
                </p>
                
                {searchInfo.context && (
                  <div className="mt-6 space-y-4">
                    {searchInfo.context.culturalVariations.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Cultural Variations:</p>
                        <div className="flex flex-wrap gap-2">
                          {searchInfo.context.culturalVariations.map((variation, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(variation);
                                handleSearch(new Event('submit') as unknown as React.FormEvent);
                              }}
                              className="px-4 py-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                            >
                              {variation}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchInfo.context.ingredientAlternatives.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Ingredient Alternatives:</p>
                        <div className="flex flex-wrap gap-2">
                          {searchInfo.context.ingredientAlternatives.map((ingredient, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(ingredient);
                                handleSearch(new Event('submit') as unknown as React.FormEvent);
                              }}
                              className="px-4 py-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                            >
                              {ingredient}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchInfo.context.mealTypes.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Related Meal Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {searchInfo.context.mealTypes.map((mealType, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setQuery(mealType);
                                handleSearch(new Event('submit') as unknown as React.FormEvent);
                              }}
                              className="px-4 py-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                            >
                              {mealType}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {searchInfo.searchTerms.length > 1 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Try these related searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchInfo.searchTerms.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(term);
                            handleSearch(new Event('submit') as unknown as React.FormEvent);
                          }}
                          className="px-4 py-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:rotate-y-12"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {results.map((recipe, index) => (
                <Link
                  key={recipe.idMeal}
                  href={`/recipe/${recipe.idMeal}`}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:rotate-y-12 animate-card-slide-up">
                    <div className="relative h-56 group">
                      <img
                        src={recipe.strMealThumb}
                        alt={recipe.strMeal}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-base font-medium transform hover:translate-z-20 transition-transform duration-300">
                          {recipe.strCategory}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h2 className="text-2xl font-semibold text-emerald-900 dark:text-emerald-400 mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300 transform hover:translate-z-10">
                        {recipe.strMeal}
                      </h2>
                      <p className="text-lg text-emerald-700 dark:text-emerald-300 mb-6 transform hover:translate-z-10">
                        {recipe.strArea}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {recipe.strTags?.split(',').slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-4 py-2 bg-emerald-50 dark:bg-gray-700 rounded-full text-base text-emerald-700 dark:text-emerald-300 transform hover:translate-z-10 transition-transform duration-300"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                        {recipe.strTags && recipe.strTags.split(',').length > 3 && (
                          <span className="px-4 py-2 bg-emerald-50 dark:bg-gray-700 rounded-full text-base text-emerald-700 dark:text-emerald-300 transform hover:translate-z-10 transition-transform duration-300">
                            +{recipe.strTags.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
    </div>
    </main>
  );
}
