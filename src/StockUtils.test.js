import { calculatePERatio } from './StockUtils';

describe('calculatePERatio', () => {
  it('should calculate the P/E ratio correctly with valid inputs', () => {
    expect(calculatePERatio(150.75, 7.50)).toBe('20.10');
  });

  it('should return "N/A" when EPS is zero', () => {
    expect(calculatePERatio(150.75, 0)).toBe('N/A');
  });

  it('should return "N/A" for "N/A" inputs', () => {
    expect(calculatePERatio('N/A', 7.50)).toBe('N/A');
    expect(calculatePERatio(150.75, 'N/A')).toBe('N/A');
  });

  it('should return "N/A" for null or undefined inputs', () => {
    expect(calculatePERatio(null, 7.50)).toBe('N/A');
    expect(calculatePERatio(150.75, undefined)).toBe('N/A');
  });
});
