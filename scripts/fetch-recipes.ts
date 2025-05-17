import axios from 'axios';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { Recipe } from '../src/types/recipe';
import { generateEmbedding, prepareRecipeText } from '../src/utils/embeddings';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MealResponse {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

async function fetchAllRecipes(): Promise<Recipe[]> {
  const recipes: Recipe[] = [];
  let currentPage = 1;

  while (true) {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${currentPage}`
      );

      if (!response.data.meals || response.data.meals.length === 0) {
        break;
      }

      const mealPromises = response.data.meals.map(async (meal: MealResponse) => {
        const detailResponse = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const mealDetail = detailResponse.data.meals[0];

        // Extract ingredients
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = mealDetail[`strIngredient${i}`];
          const measure = mealDetail[`strMeasure${i}`];
          if (ingredient && ingredient.trim()) {
            ingredients.push({
              name: ingredient.trim(),
              measure: measure ? measure.trim() : '',
            });
          }
        }

        return {
          ...mealDetail,
          ingredients,
        };
      });

      const pageRecipes = await Promise.all(mealPromises);
      recipes.push(...pageRecipes);
      currentPage++;

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error fetching recipes:', error);
      break;
    }
  }

  return recipes;
}

async function generateEmbeddings(recipes: Recipe[]): Promise<Recipe[]> {
  const recipesWithEmbeddings = await Promise.all(
    recipes.map(async (recipe) => {
      try {
        const text = prepareRecipeText(recipe);
        const embedding = await generateEmbedding(text);
        return { ...recipe, embedding };
      } catch (error) {
        console.error(`Error generating embedding for ${recipe.strMeal}:`, error);
        return recipe;
      }
    })
  );

  return recipesWithEmbeddings;
}

async function main() {
  try {
    console.log('Fetching recipes...');
    const recipes = await fetchAllRecipes();
    console.log(`Fetched ${recipes.length} recipes`);

    console.log('Generating embeddings...');
    const recipesWithEmbeddings = await generateEmbeddings(recipes);
    console.log('Embeddings generated successfully');

    const outputPath = path.join(process.cwd(), 'src', 'data', 'recipes.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(recipesWithEmbeddings, null, 2));

    console.log('Recipe data saved successfully');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

main(); 