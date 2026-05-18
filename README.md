# Beautiful Nepal 2.0

A modern web client for [beautifulnepal.com](https://beautifulnepal.com) built with Next.js and TypeScript. This project serves as the frontend for the Beautiful Nepal platform, integrating with Sanity CMS and a .NET API backend.

## About

Beautiful Nepal 2.0 is a TypeScript-powered web application that showcases Nepal's beauty, culture, and tourism. The application is designed to provide users with an engaging and responsive experience while fetching content from Sanity CMS and consuming data from a .NET API backend.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) (97.7% of codebase)
- **CMS**: [Sanity](https://www.sanity.io/) - Headless CMS for content management
- **Backend API**: .NET - RESTful API for data services
- **Styling**: HTML/CSS (1.2% of codebase)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/upendrashrestha/beautifulnepal2.0.git
cd beautifulnepal2.0
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

You can start editing pages by modifying files in the `app` directory. The page auto-updates as you edit.

### Build

Build the application for production:

```bash
npm run build
npm start
```

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - Reusable React components
- `pages/` - Application pages (if using pages router)
- `public/` - Static assets
- `styles/` - Global styles and CSS modules
- `lib/` - Utility functions and helpers
- `types/` - TypeScript type definitions

## Integration

### Sanity CMS

This project is integrated with Sanity for content management. Content is fetched and rendered dynamically throughout the application.

### .NET API

The application consumes endpoints from a .NET backend API for dynamic data services.

## Features

- Server-side rendering for optimal performance
- TypeScript for type-safe code
- Responsive design for all devices
- Integration with Sanity CMS for content management
- Connection to .NET API for backend services

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Sanity Documentation](https://www.sanity.io/docs)

## Deployment

The application can be deployed on various platforms:

- [Vercel](https://vercel.com/) - Recommended for Next.js applications
- [Netlify](https://www.netlify.com/)
- Other Node.js hosting providers

For detailed deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is maintained by [upendrashrestha](https://github.com/upendrashrestha).

---

**Live Site**: [beautifulnepal.com](https://beautifulnepal.com)
