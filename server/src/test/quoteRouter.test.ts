import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import quoteRouter from '../routes/quoteRouter.js';

// Mock fetch globally
global.fetch = vi.fn();

describe('Quote Router', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/quote', quoteRouter);
    vi.clearAllMocks();
  });

  describe('GET /quote/now', () => {
    it('should return a quote from external API', async () => {
      const mockQuote = {
        _id: '123',
        content: 'Test quote content',
        author: 'Test Author',
        length: 20,
        tags: ['test'],
      };

      (global.fetch as any).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockQuote),
      });

      const response = await request(app).get('/quote/now').expect(200);

      expect(response.body).toEqual({ quote: mockQuote });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.quotable.io/random',
      );
    });

    it('should return backup quote when external API fails', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('API failed'));

      const response = await request(app).get('/quote/now').expect(200);

      expect(response.body).toHaveProperty('quote');
      expect(response.body.quote).toHaveProperty('content');
      expect(response.body.quote).toHaveProperty('author');
      expect(typeof response.body.quote.content).toBe('string');
      expect(typeof response.body.quote.author).toBe('string');
    });
  });

  describe('GET /quote/in3sec', () => {
    it('should return a quote after at least 3 seconds', async () => {
      const mockQuote = {
        _id: '123',
        content: 'Test quote content',
        author: 'Test Author',
        length: 20,
        tags: ['test'],
      };

      (global.fetch as any).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockQuote),
      });

      const startTime = Date.now();
      const response = await request(app).get('/quote/in3sec').expect(200);

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(3000);
      expect(response.body).toEqual({ quote: mockQuote });
    });

    it('should return backup quote when external API fails', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('API failed'));

      const startTime = Date.now();
      const response = await request(app).get('/quote/in3sec').expect(200);

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;

      expect(elapsedTime).toBeGreaterThanOrEqual(3000);
      expect(response.body).toHaveProperty('quote');
      expect(response.body.quote).toHaveProperty('content');
      expect(response.body.quote).toHaveProperty('author');
    });
  });
});
