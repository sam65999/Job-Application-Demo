# HireFlow - Frontend Only

This folder contains all the frontend/UI code for HireFlow without any backend API routes or sensitive logic.

## What's Included

### ✅ Frontend Components
- All React components (`components/`)
- Form step components (`components/steps/`)
- UI components (`components/ui/`)
- Main application page (`app/page.tsx`)
- Layout and styling (`app/layout.tsx`, `app/globals.css`)

### ✅ Client-Side Logic
- Custom hooks (`hooks/`)
- State management (`lib/store.ts`)
- Resume parsing utilities (`lib/resume-parser.ts`)
- TypeScript type definitions

### ✅ Static Assets
- Images and logos (`public/`)
- PDF.js worker file
- Icons and SVGs

### ✅ Configuration Files
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config
- `next.config.ts` - Next.js config
- `postcss.config.mjs` - PostCSS config
- `eslint.config.mjs` - ESLint config

## What's NOT Included

### ❌ Backend Code
- API routes (`app/api/`) - **Excluded for security**
- Server-side logic
- Environment variables with sensitive data

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

**Note:** The AI assistant and other backend features will not work without the API routes. This is frontend-only code for learning and demonstration purposes.

## Features

- 🎨 Modern UI with light/dark theme
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion
- 📝 Multi-step application form
- 📄 Resume upload and parsing (client-side)
- 🎯 Form validation
- 💾 State management with Zustand

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Animations:** Framer Motion
- **Document Parsing:** PDF.js, Mammoth

## License

MIT License - Open source for learning purposes

## Contact

**GitHub:** [@sam65999](https://github.com/sam65999)  
**Email:** samuelr.aidev@gmail.com
