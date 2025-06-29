import { vi } from 'vitest';
const mockRequire = require('mock-require');
// import '@testing-library/jest-dom/vitest';

vi.mock('./components/svg-icon.tsx', {});
// vi.mock('./components/svg-icon', {}); // also works

mockRequire('webextension-polyfill', { __mocked: 'webextension-polyfill' });
