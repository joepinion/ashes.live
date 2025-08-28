---
description: Repository Information Overview
alwaysApply: true
---

# Ashes.live Information

## Summary
Ashes.live is a fan-developed deckbuilder and community website for the card game Ashes Reborn. It's a static front-end application built with Vue.js that connects to a separate Python API backend.

## Structure
- **src/**: Contains the Vue.js application source code
  - **components/**: Vue components organized by feature
  - **store/**: Vuex store modules for state management
  - **assets/**: Static assets like images
  - **composition/**: Vue composition API utilities
  - **utils/**: Utility functions
- **public/**: Static files served directly
- **dist/**: Production build output

## Language & Runtime
**Language**: JavaScript (Vue.js)
**Version**: Vue 3.2.37
**Build System**: Vite 5.2.13
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- vue: ^3.2.37
- vue-router: ^4.0.16
- vuex: ^4.0.0
- axios: ^1.2.6
- vue-toastification: ^2.0.0-rc.1
- date-fns: ^3.6.0
- ashes-pod-link-generator: ^1.0.1

**Development Dependencies**:
- @vitejs/plugin-vue: ^5.0.0
- tailwindcss: ^3.1.4
- postcss: ^8.4.14
- autoprefixer: ^10.4.7
- vite: ^5.2.13

## Build & Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Main Files & Resources
**Entry Point**: src/main.js
**Main Component**: src/App.vue
**Router Configuration**: src/router.js
**Store Configuration**: src/store/index.js
**CSS Entry Point**: src/index.css

## Usage & Operations
The application requires a separate Python API backend to function properly. The backend repository is available at https://github.com/onecrayon/api.ashes.live.

Environment configuration is managed through a .env file (copied from .env.example). The development server runs on http://localhost:3000 by default.

For production deployment, the static files in the dist/ directory can be hosted on any web server. It's important to set NODE_ENV=production when building for production to optimize CSS file sizes.