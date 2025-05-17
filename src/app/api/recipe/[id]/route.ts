import { NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${params.id}`);
    const meal = response.data.meals?.[0];

    if (!meal) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Extract ingredients and measurements
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || '',
        });
      }
    }

    const recipe = {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strMealThumb: meal.strMealThumb,
      strTags: meal.strTags,
      strYoutube: meal.strYoutube,
      strSource: meal.strSource,
      ingredients,
    };

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    );
  }
} 