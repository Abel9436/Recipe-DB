# Global Recipe Finder

A Next.js application that allows users to search for recipes using AI-powered semantic search. The application uses TheMealDB API for recipe data and OpenAI's Embedding API for semantic search capabilities.

## Features

- Semantic search for recipes by ingredient, culture, or diet
- Responsive and accessible UI
- Static site generation for optimal performance
- AI-powered recipe matching
- No tracking or cookies
- SEO optimized

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd global-recipe-finder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Fetch and process recipe data:
```bash
npm run fetch-recipes
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

```bash
npm run build
npm start
```

## Security Features

- HTTPS enforcement
- CORS and CSP headers
- Environment variables for sensitive data
- Input sanitization
- No third-party tracking

## SEO Optimization

- Meta tags
- Schema.org structured data
- Optimized Core Web Vitals
- Lazy loading for images
- Fast page rendering

## License

MIT
