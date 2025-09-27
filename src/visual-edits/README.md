# Visual Edits System

This directory contains the visual editing functionality for the NovaNet frontend application.

## Components

### VisualEditsMessenger.tsx
- Main component that handles communication between the app and visual editing tools
- Provides iframe detection and cross-frame messaging
- Handles component selection, hovering, and real-time updates
- Only active when the app is loaded in an iframe (visual editing context)

### component-tagger-loader.js
- Webpack loader that adds data attributes to React components
- Enables visual editing tools to identify and interact with components
- Adds `data-visual-edit-component` and `data-visual-edit-file` attributes
- Only active in development mode

### types.ts
- TypeScript type definitions for visual editing interfaces
- Defines message formats and component data structures

## How It Works

1. The component tagger loader adds data attributes to JSX elements during build
2. VisualEditsMessenger listens for iframe context and sets up event handlers
3. When in visual edit mode, components can be selected and modified in real-time
4. Changes are communicated via postMessage to parent frames

## Integration

The system is integrated into the app via:
- `layout.tsx` includes the VisualEditsMessenger component
- `next.config.ts` configures the component tagger loader for Turbopack
- External script in layout.tsx handles route changes for visual editing tools

## Features

- **Component Selection**: Click to select components for editing
- **Hover Preview**: Hover effects to highlight editable components
- **Real-time Updates**: Apply style and content changes without page refresh
- **Multi-frame Communication**: Works across iframe boundaries
- **Development Safety**: Only active in development/iframe contexts