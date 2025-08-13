# ACI - Automações Comerciais Integradas - Project Context

## Project Overview

This project, ACI (Automações Comerciais Integradas), is a comprehensive e-commerce automation system built with React, TypeScript, and Vite. It integrates with Shopee, Telegram, and AI (Google Gemini) to provide functionalities like product search, affiliate link generation, messaging automation, and AI-powered content/image generation.

Key features include:
- **Authentication System**: Email/password and simulated Google OAuth login, with user roles (admin/user).
- **Admin Panel**: Configuration for APIs (Shopee, Telegram, WhatsApp, Gemini), user management, and dashboard metrics.
- **Integrations**:
  - **Shopee**: Search products, find top sellers, generate affiliate links.
  - **Telegram**: Send messages, automate group interactions.
  - **AI (Google Gemini)**: Generate images, chat responses, and process product information.
  - **WhatsApp**: Automation (under development).
- **Deployment**: Dockerized application with Nginx.

## Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **APIs**: Google Gemini, Telegram Bot API
- **Authentication**: Custom system with simulated JWT
- **Deployment**: Docker, Nginx
- **State Management**: React Context API (e.g., `ThemeContext`)

## Project Structure

```
aci-automacoes/
├── components/          # React components (e.g., AdminPage.tsx, AuthPage.tsx)
├── services/            # Business logic and API integrations (e.g., authService.ts, geminiService.ts, configService.ts)
├── contexts/            # React context providers (e.g., ThemeContext.tsx)
├── scripts/             # Automation scripts (e.g., git setup, commits)
├── docs/                # Documentation (RFCs, ADRs)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── database/            # (Likely for local database interactions or Supabase setup)
├── dist/                # Build output directory
├── node_modules/        # NPM dependencies
├── plan/                # Project planning documents
├── ...
├── App*.tsx             # Various versions of the main App component
├── index.html           # Main HTML file
├── index.tsx            # Main application entry point
├── constants.ts         # Application constants (e.g., Shopee categories)
├── vite.config.ts       # Vite build configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── eslint.config.js     # ESLint configuration
├── .prettierrc          # Prettier code formatting configuration
├── package.json         # NPM project configuration, dependencies, and scripts
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Docker Compose configuration for local development
├── nginx.conf           # Nginx web server configuration
├── .env.example         # Example environment variables file
└── README.md            # Main project documentation
```

## Building and Running

### Prerequisites
- Node.js 18+
- Git
- Docker (for containerized deployment)

### Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run development server**:
    ```bash
    npm run dev
    ```
    This starts the Vite development server, typically on `http://localhost:5173`.

### Production Build

1.  **Build the application**:
    ```bash
    npm run build
    ```
    This creates optimized static files in the `dist/` directory.

2.  **Preview the build**:
    ```bash
    npm run preview
    ```
    This serves the built application locally for testing.

### Docker Deployment

1.  **Build and run with Docker Compose**:
    ```bash
    npm run docker:dev
    ```
    This builds the Docker image and starts the container using `docker-compose.yml`. The app is usually accessible at `http://localhost:3000`.

2.  **Run production Docker Compose**:
    ```bash
    npm run docker:prod
    ```
    This uses `docker-compose.prod.yml` for production settings.

## Development Conventions

- **Code Quality**:
  - Uses ESLint (`npm run lint`) and Prettier (`npm run format`) for code style and formatting.
  - Scripts are available to automatically fix issues (`npm run lint:fix`).
- **Git Workflow**:
  - Custom PowerShell/Batch scripts are provided for Git operations (`npm run git:commit`, `npm run git:feature`, etc.) to standardize commit messages.
- **Configuration**:
  - API keys and other sensitive settings are managed via environment variables (`.env.local`).
  - The `configService` manages application configuration for various integrations.
- **Architecture**:
  - Follows a component-based architecture with React.
  - Business logic and API interactions are separated into `services/`.
  - Uses React Context for state management where needed (e.g., theme).

## Key Files and Directories

- **`README.md`**: Primary source of project information, setup instructions, and available scripts.
- **`package.json`**: Defines project metadata, dependencies, and NPM scripts.
- **`services/`**: Contains core logic for interacting with external APIs (Gemini, Shopee) and managing application state (auth, config).
- **`components/`**: Holds reusable UI components, including main pages like `AdminPage.tsx`.
- **`Dockerfile` & `docker-compose.yml`**: Define how the application is containerized and deployed.
- **`constants.ts`**: Stores application-wide constants, such as Shopee product categories.