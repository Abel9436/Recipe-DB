import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MEALDB_API_BASE = 'https://www.themealdb.com/api/json/v1/1';

interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  [key: string]: string | null; // For dynamic ingredient and measure properties
}

interface SearchIntent {
  searchType: 'all' | 'culture' | 'ingredients';
  correctedQuery: string;
  searchTerms: string[];
  context: {
    culturalVariations: string[];
    ingredientAlternatives: string[];
    mealTypes: string[];
  };
}

async function understandSearchIntent(query: string): Promise<SearchIntent> {
  const prompt = `You are a culinary search assistant that helps understand recipe search queries. Analyze this recipe search query and determine:

1. The intended search type (all, culture, or ingredients)
2. Any misspellings, regional variations, or common terms that should be corrected
3. Related search terms that might help find relevant recipes
4. Cultural context and variations of the search term
5. Common ingredient substitutions or alternatives

Consider:
- Regional variations (e.g., "italiano" → "Italian")
- Common misspellings
- Cultural context (e.g., "chinese food" → "Chinese cuisine")
- Ingredient variations (e.g., "tomato sauce" → "tomato, sauce")
- Meal types and categories
- Dietary preferences and restrictions

Query: "${query}"

Respond in JSON format:
{
  "searchType": "all|culture|ingredients",
  "correctedQuery": "corrected version of the query",
  "searchTerms": ["array", "of", "related", "terms"],
  "context": {
    "culturalVariations": ["array", "of", "cultural", "variations"],
    "ingredientAlternatives": ["array", "of", "alternative", "ingredients"],
    "mealTypes": ["array", "of", "relevant", "meal", "types"]
  }
}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a culinary search assistant with deep knowledge of global cuisines, ingredients, and cooking techniques. You understand common misspellings, regional variations, and culinary terms across different cultures."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    
    // Combine all search terms for better coverage
    const allSearchTerms = [
      response.correctedQuery,
      ...(response.searchTerms || []),
      ...(response.context?.culturalVariations || []),
      ...(response.context?.ingredientAlternatives || []),
      ...(response.context?.mealTypes || [])
    ].filter((term, index, self) => term && self.indexOf(term) === index);

    return {
      searchType: response.searchType || 'all',
      correctedQuery: response.correctedQuery || query,
      searchTerms: allSearchTerms,
      context: response.context || {
        culturalVariations: [],
        ingredientAlternatives: [],
        mealTypes: []
      }
    };
  } catch (error) {
    console.error('Groq API error:', error);
    return {
      searchType: 'all',
      correctedQuery: query,
      searchTerms: [query],
      context: {
        culturalVariations: [],
        ingredientAlternatives: [],
        mealTypes: []
      }
    };
  }
}

export async function POST(request: Request) {
  try {
    const { query, searchType } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Understand search intent using Groq
    const { searchType: understoodType, correctedQuery, searchTerms, context } = await understandSearchIntent(query);

    // Use the understood search type if none was specified
    const finalSearchType = searchType || understoodType;

    let endpoint = '';
    switch (finalSearchType) {
      case 'culture':
        endpoint = `${MEALDB_API_BASE}/filter.php?a=${encodeURIComponent(correctedQuery)}`;
        break;
      case 'ingredients':
        endpoint = `${MEALDB_API_BASE}/filter.php?i=${encodeURIComponent(correctedQuery)}`;
        break;
      default:
        endpoint = `${MEALDB_API_BASE}/search.php?s=${encodeURIComponent(correctedQuery)}`;
    }

    const response = await fetch(endpoint);
    const data = await response.json();

    // If no results found with corrected query, try alternative search terms
    if (!data.meals || data.meals.length === 0) {
      // Try each search term until we find results
      for (const term of searchTerms) {
        const altEndpoint = `${MEALDB_API_BASE}/search.php?s=${encodeURIComponent(term)}`;
        const altResponse = await fetch(altEndpoint);
        const altData = await altResponse.json();
        
        if (altData.meals && altData.meals.length > 0) {
          return NextResponse.json({ 
            results: altData.meals,
            searchInfo: {
              originalQuery: query,
              correctedQuery,
              searchTerms,
              usedTerm: term,
              context
            }
          });
        }
      }

      // If still no results, try a broader search
      const broaderEndpoint = `${MEALDB_API_BASE}/search.php?s=${encodeURIComponent(correctedQuery.split(' ')[0])}`;
      const broaderResponse = await fetch(broaderEndpoint);
      const broaderData = await broaderResponse.json();

      if (broaderData.meals && broaderData.meals.length > 0) {
        return NextResponse.json({ 
          results: broaderData.meals,
          searchInfo: {
            originalQuery: query,
            correctedQuery,
            searchTerms,
            usedTerm: correctedQuery.split(' ')[0],
            context
          }
        });
      }
      
      // If no results found at all, return empty results with search info
      return NextResponse.json({ 
        results: [],
        searchInfo: {
          originalQuery: query,
          correctedQuery,
          searchTerms,
          usedTerm: correctedQuery,
          context
        }
      });
    }

    // For culture and ingredients searches, fetch detailed meal information
    if (finalSearchType !== 'all' && data.meals) {
      const detailedMeals = await Promise.all(
        data.meals.map(async (meal: Meal) => {
          const detailResponse = await fetch(`${MEALDB_API_BASE}/lookup.php?i=${meal.idMeal}`);
          const detailData = await detailResponse.json();
          return detailData.meals[0] as Meal;
        })
      );

      return NextResponse.json({ 
        results: detailedMeals,
        searchInfo: {
          originalQuery: query,
          correctedQuery,
          searchTerms,
          usedTerm: correctedQuery,
          context
        }
      });
    }

    return NextResponse.json({ 
      results: data.meals,
      searchInfo: {
        originalQuery: query,
        correctedQuery,
        searchTerms,
        usedTerm: correctedQuery,
        context
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search recipes. Please try again.' },
      { status: 500 }
    );
  }
} 