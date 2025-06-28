import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      // suppress errors for missing 'import React' in files
      'react/react-in-jsx-scope': 'off',
      // allow jsx syntax in js files (for next.js project)
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }], //should add ".ts" if typescript project
    },
  },
]);
