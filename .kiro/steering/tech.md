# Technology Stack

## Frontend Framework
- **React 19.1.0** with TypeScript
- **Vite** as build tool and dev server
- **JSX** with react-jsx transform

## AI Integration
- **Google Gemini AI** (@google/genai) for:
  - Product search and data extraction
  - Content generation (text and images)
  - Chat functionality
  - Affiliate link generation

## Styling & UI
- **Tailwind CSS** with custom dark theme
- Custom CSS variables for consistent theming
- Responsive design patterns

## Development Tools
- **TypeScript 5.8.2** with strict configuration
- **Node.js** runtime
- **ESNext** module system

## Common Commands

```bash
# Development
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Environment Configuration
- `.env.local` for API keys (GEMINI_API_KEY)
- Vite handles environment variable injection
- API key exposed as `process.env.API_KEY` in runtime

## Build Configuration
- **Vite config**: Custom alias setup (@/ for root)
- **TypeScript**: ES2022 target, bundler module resolution
- **Path mapping**: @/* resolves to project root