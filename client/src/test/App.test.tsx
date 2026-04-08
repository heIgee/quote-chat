import { describe, it, expect } from 'vitest';
import { generateObjectId } from '../utils/generateObjectId.js';

describe('generateObjectId', () => {
  it('should generate a 24-character string', () => {
    const id = generateObjectId();
    expect(id).toHaveLength(24);
    expect(typeof id).toBe('string');
  });

  it('should generate only hexadecimal characters', () => {
    const id = generateObjectId();
    const hexRegex = /^[0-9a-f]+$/;
    expect(hexRegex.test(id)).toBe(true);
  });

  it('should generate unique IDs', () => {
    const id1 = generateObjectId();
    const id2 = generateObjectId();
    const id3 = generateObjectId();

    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  it('should generate multiple unique IDs consistently', () => {
    const ids = new Set();
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      const id = generateObjectId();
      expect(id).toHaveLength(24);
      ids.add(id);
    }

    expect(ids.size).toBe(iterations);
  });
});
