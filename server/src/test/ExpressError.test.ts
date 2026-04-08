import { describe, it, expect } from 'vitest';
import ExpressError from '../utils/ExpressError.js';

describe('ExpressError', () => {
  it('should create error with status and message', () => {
    const error = new ExpressError(404, 'Not Found');

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ExpressError');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not Found');
  });

  it('should create error with different status codes', () => {
    const error1 = new ExpressError(500, 'Internal Server Error');
    const error2 = new ExpressError(400, 'Bad Request');

    expect(error1.status).toBe(500);
    expect(error1.message).toBe('Internal Server Error');
    expect(error2.status).toBe(400);
    expect(error2.message).toBe('Bad Request');
  });
});
