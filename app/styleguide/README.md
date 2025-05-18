# Style Guide

This directory contains a developer-only style guide for the Claude React Template project. It provides a comprehensive reference for all UI components, typography, colors, and design patterns used throughout the application.

## Features

- Visual representation of all UI components
- Color palette and theme visualization
- Typography showcase
- Development-only access (not visible in production)
- Interactive examples

## How to Access

The style guide is only accessible in development mode. To view it:

1. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. Navigate to [http://localhost:3000/styleguide](http://localhost:3000/styleguide)

You'll also see a "Style Guide" link in the main navigation menu, but only when running in development mode.

## Purpose

The style guide serves several important purposes:

1. **Documentation**: It provides visual documentation of all UI components and design patterns.
2. **Consistency**: It helps ensure design consistency throughout the application.
3. **Developer Reference**: It makes it easy for developers to see what components are available and how to use them.
4. **Design System**: It serves as a living design system that evolves with the project.

## Implementation Details

- The style guide is only rendered in development environments
- It uses the `process.env.NODE_ENV === 'development'` check to determine visibility
- The page will return a 404 error if accessed in production
- It showcases all shadcn/ui components that are used in the project
