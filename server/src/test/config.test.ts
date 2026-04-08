import { describe, it, expect, vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.resetModules();
});

describe('Global Config', () => {
  it('should have correct development values', async () => {
    process.env.NODE_ENV = 'development';
    process.env.ATLAS_URL = 'mongodb://localhost:27017/test';

    const { inProduction, clientUri, dbName } =
      await import('../config/global.config.js');

    expect(inProduction).toBe(false);
    expect(clientUri).toBe('http://localhost:5173');
    expect(dbName).toBe('quote');
  });

  it('should have production values when NODE_ENV is production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ATLAS_URL = 'mongodb://localhost:27017/test';

    const { inProduction, clientUri } =
      await import('../config/global.config.js');

    expect(inProduction).toBe(true);
    expect(clientUri).toBe('https://quote-chat.vercel.app');
  });
});
