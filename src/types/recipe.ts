export interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  ingredients: {
    name: string;
    measure: string;
  }[];
  embedding?: number[];
}

export interface SearchFilters {
  category?: string;
  area?: string;
  tags?: string[];
}

export interface SearchResult {
  recipe: Recipe;
  similarity: number;
} 