'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function RecipeDetail() {
  const params = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipe/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
          <p className="text-red-600 text-lg">{error || 'Recipe not found'}</p>
          <Link href="/" className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8 transform hover:-translate-x-2 transition-transform duration-300"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Search
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          <div className="relative h-96 group">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2 transform hover:scale-105 transition-transform duration-300">
                {recipe.strMeal}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {recipe.strCategory}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {recipe.strArea}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h2 className="text-2xl font-semibold text-emerald-900 mb-4">Ingredients</h2>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ing, index) => (
                      <li 
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg transform hover:translate-x-2 transition-transform duration-300"
                      >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-emerald-900">
                          <span className="font-medium">{ing.measure}</span> {ing.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {recipe.strTags && (
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-2xl font-semibold text-emerald-900 mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {recipe.strTags.split(',').map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-emerald-100 rounded-full text-sm font-medium text-emerald-700 transform hover:scale-105 transition-transform duration-300"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h2 className="text-2xl font-semibold text-emerald-900 mb-4">Instructions</h2>
                  <div className="prose prose-emerald max-w-none">
                    <p className="text-emerald-700 leading-relaxed">
                      {recipe.strInstructions}
                    </p>
                  </div>
                </div>

                {recipe.strYoutube && (
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <h2 className="text-2xl font-semibold text-emerald-900 mb-4">Video Tutorial</h2>
                    <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                      <iframe
                        src={recipe.strYoutube.replace('watch?v=', 'embed/')}
                        title="Recipe Tutorial"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                )}

                {recipe.strSource && (
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <a
                      href={recipe.strSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform hover:-translate-y-1 transition-all duration-300"
                    >
                      View Original Recipe
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 