/**
 * Component Tagger Loader for Visual Editing
 * This webpack loader adds data attributes to React components for visual editing capabilities
 */

module.exports = function componentTaggerLoader(source) {
  // Skip processing for node_modules
  if (this.resourcePath.includes('node_modules')) {
    return source;
  }

  // Skip if not a React component file
  if (!this.resourcePath.match(/\.(jsx|tsx)$/)) {
    return source;
  }

  // Only process in development mode
  if (process.env.NODE_ENV === 'production') {
    return source;
  }

  // Add component tagging for visual editing
  const componentName = this.resourcePath
    .split('/')
    .pop()
    .replace(/\.(jsx|tsx)$/, '');

  // Simple regex to add data attributes to JSX elements
  // This is a basic implementation - for production use a proper AST parser like babel
  const taggedSource = source.replace(
    /(<[A-Z][a-zA-Z0-9]*(?:\s+[^>]*)?)(>)/g,
    (match, opening, closing) => {
      // Avoid adding attributes to already tagged elements
      if (opening.includes('data-visual-edit-component')) {
        return match;
      }
      return `${opening} data-visual-edit-component="${componentName}" data-visual-edit-file="${this.resourcePath}"${closing}`;
    }
  );

  return taggedSource;
};