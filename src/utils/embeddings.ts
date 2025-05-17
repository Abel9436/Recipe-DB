import OpenAI from 'openai';
import { Recipe } from '@/types/recipe';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export function prepareRecipeText(recipe: Recipe): string {
  const ingredients = recipe.ingredients
    .map(ing => `${ing.measure} ${ing.name}`)
    .join(', ');
  
  return `${recipe.strMeal} - ${recipe.strCategory} - ${recipe.strArea} - ${ingredients} - ${recipe.strInstructions}`;
}

export async function searchRecipes(
  query: string,
  recipes: Recipe[],
  filters?: { category?: string; area?: string; tags?: string[] }
): Promise<{ recipe: Recipe; similarity: number }[]> {
  const queryEmbedding = await generateEmbedding(query);
  
  let filteredRecipes = recipes;
  
  if (filters) {
    if (filters.category) {
      filteredRecipes = filteredRecipes.filter(r => r.strCategory === filters.category);
    }
    if (filters.area) {
      filteredRecipes = filteredRecipes.filter(r => r.strArea === filters.area);
    }
    if (filters.tags?.length) {
      filteredRecipes = filteredRecipes.filter(r => 
        r.strTags && filters.tags?.some(tag => r.strTags?.includes(tag))
      );
    }
  }

  const results = filteredRecipes
    .map(recipe => ({
      recipe,
      similarity: cosineSimilarity(queryEmbedding, recipe.embedding || [])
    }))
    .sort((a, b) => b.similarity - a.similarity);

  return results;
} 