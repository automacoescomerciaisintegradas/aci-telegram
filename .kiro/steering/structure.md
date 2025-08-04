# Project Structure

## Root Level
- `App.tsx` - Main application component with routing and authentication
- `index.tsx` - React app entry point
- `constants.ts` - Shared constants (Shopee categories, etc.)
- `index.html` - HTML template
- `package.json` - Dependencies and scripts

## Components Directory (`/components`)
All React components follow PascalCase naming:

### Core Pages
- `AdminPage.tsx` - Configuration dashboard with tabs
- `AuthPage.tsx` - Authentication/login page
- `ChatPage.tsx` - AI chat interface

### Feature Components
- `ShopeeSearch.tsx` - Product search functionality
- `LinkGenerator.tsx` - Affiliate link generation
- `TopSales.tsx` - Best-selling products display
- `ImageGenerator.tsx` - AI image creation
- `TelegramPage.tsx` - Telegram message automation
- `TelegramShopeePage.tsx` - Combined Telegram + Shopee features

### UI Components
- `Sidebar.tsx` - Navigation sidebar with user info
- `Header.tsx` - Page headers
- `Icons.tsx` - SVG icon components
- `GeneratedContent.tsx` - Content display component
- `GenerateLinkModal.tsx` - Modal for link generation

## Services Directory (`/services`)
- `geminiService.ts` - Google Gemini AI integration functions

## Documentation (`/docs`)
- `plano-implementacao.md` - Implementation roadmap (Portuguese)

## Configuration Files
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript compiler options
- `.env.local` - Environment variables
- `.gitignore` - Git ignore patterns

## Architecture Patterns
- **Component-based**: Each feature is a self-contained component
- **Service layer**: AI operations abstracted to services
- **Type safety**: TypeScript interfaces for all data structures
- **State management**: Local React state (no external state library)
- **Routing**: Simple page-based navigation via props